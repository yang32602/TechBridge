// mobile-app/src/services/api.ts

// Asegúrate de que esta URL base esté bien configurada para tu IP/Emulador
// Si tu IP es 192.168.0.9 y tu backend corre en el puerto 3000
// mobile-app/src/config/api.ts DEBE tener: export const API_BASE_URL = 'http://192.168.0.9:3000';
import { API_BASE_URL } from '../config/api'; // Importa la URL base sin el '/api' final

// Interfaz para la respuesta de registro de token push
interface RegisterPushTokenResponse {
  message: string;
}

// Interfaz para la respuesta de login del backend (tal como la devuelve AHORA)
interface BackendLoginResponse {
  estado: number;
  mensaje: string;
  id: number; // Este es el userId
}

// Interfaz para la respuesta de login que el frontend ESPERA y NECESITA
interface FrontendLoginResponse {
  userId: number;
  userType: 'estudiante' | 'empresa'; // 'estudiante' es lo que tu backend devuelve para postulantes
  token: string; // ¡Esto es crucial y tu backend NO lo está devolviendo aún!
  message?: string;
}

// Función para enviar el token de Expo Push al backend
export const registerPushTokenOnBackend = async (
  userId: number,
  userType: 'estudiante' | 'empresa', // Asegúrate de que esto coincida con lo que tu backend espera ('estudiante' o 'empresa')
  expoPushToken: string,
  authToken?: string // Opcional: si tu ruta de registro de token en el backend requiere autenticación
): Promise<RegisterPushTokenResponse> => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    // Si tu backend protege la ruta /registerPushToken, añade el token de autenticación aquí
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // La ruta completa para el registro de token
    const response = await fetch(`${API_BASE_URL}/api/usuariosMobile/registerPushToken`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        userId: userId,
        userType: userType,
        expoPushToken: expoPushToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: Failed to register push token.`);
    }

    return response.json(); // Devuelve la respuesta del backend
  } catch (error: any) {
    console.error('Error sending push token to backend:', error.message);
    throw error; // Propaga el error para que pueda ser manejado en el componente de login
  }
};

// Función para el login, ahora recibe el tipo de usuario
export const loginUser = async (
  credentials: { correo: string; contrasena: string }, // Cambiado a 'correo' y 'contrasena' para coincidir con tu backend
  userType: 'estudiante' | 'empresa' // Recibe el tipo de usuario para seleccionar el endpoint
): Promise<FrontendLoginResponse> => { // Ahora retorna la interfaz que el frontend necesita
  try {
    let loginEndpoint = '';
    if (userType === 'estudiante') {
      loginEndpoint = '/api/usuarios/estudianteLogin'; // Ruta correcta para postulantes
    } else if (userType === 'empresa') {
      loginEndpoint = '/api/usuarios/empresaLogin'; // Ruta correcta para empresas
    } else {
      throw new Error('Tipo de usuario no válido para el login.');
    }

    const response = await fetch(`${API_BASE_URL}${loginEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Login failed'); // Usa errorData.mensaje
    }

    const data: BackendLoginResponse = await response.json(); // Lee la respuesta actual del backend

    // ***********************************************************************************
    // *** ¡ATENCIÓN CRÍTICA AQUÍ! ***
    // Tu backend actualmente devuelve { estado, mensaje, id }.
    // Para que el frontend funcione correctamente (especialmente con el registro de push token
    // y la navegación), NECESITA que el backend devuelva:
    // { userId: number, userType: 'estudiante' | 'empresa', token: string }
    //
    // Por ahora, estoy simulando la respuesta esperada para que el frontend no falle,
    // pero DEBES MODIFICAR TU BACKEND para que devuelva 'userType' y un 'token' JWT.
    // ***********************************************************************************

    // Mapea la respuesta actual del backend a la estructura que el frontend espera
    // Esto es una SOLUCIÓN TEMPORAL hasta que modifiques el backend
    const frontendData: FrontendLoginResponse = {
      userId: data.id,
      userType: userType, // Mapea 'postulante' a 'estudiante'
      token: 'FAKE_TOKEN_FROM_BACKEND_PLEASE_GENERATE_REAL_ONE', // ¡MUY IMPORTANTE: Tu backend debe generar un JWT real!
      message: data.mensaje,
    };

    return frontendData;
  } catch (error: any) {
    console.error('Error during login API call:', error.message);
    throw error;
  }
};

// Puedes añadir aquí otras funciones para interactuar con tu API...