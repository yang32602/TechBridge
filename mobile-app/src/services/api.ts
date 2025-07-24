// mobile-app/src/services/api.ts

// Asegúrate de que esta URL base esté bien configurada para tu IP/Emulador
// Si tu IP es 192.168.0.9 y tu backend corre en el puerto 3000
// mobile-app/src/config/api.ts DEBE tener: export const API_BASE_URL = 'http://192.168.0.9:3000';
import { API_BASE_URL } from '../config/api'; // Importa la URL base sin el '/api' final
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para obtener el token de autenticación si es necesario

// Interfaz para la respuesta de registro de token push
interface RegisterPushTokenResponse {
  message: string;
}

// Interfaz para la respuesta de login que el frontend ESPERA y NECESITA
interface FrontendLoginResponse {
  userId: number;
  userType: 'estudiante' | 'empresa'; // 'estudiante' es lo que tu backend devuelve para postulantes
  token: string; // ¡Esto es crucial y tu backend NO lo está devolviendo aún!
  mensaje?: string;
  estado: number;
}

// Función para enviar el token de Expo Push al backend
export const registerPushTokenOnBackend = async (
  userId: number,
  userType: 'estudiante' | 'empresa', // Asegúrate de que esto coincida con lo que tu backend espera ('estudiante' o 'empresa')
  fcmToken: string,
  authToken?: string // Opcional: si tu ruta de registro de token en el backend requiere autenticación
): Promise<RegisterPushTokenResponse> => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    // Tu backend debería esperar un token de autenticación para esta ruta
    const authToken = await AsyncStorage.getItem('userToken'); // Obtén el token de sesión
    console.log('--- FRONTEND LOG (api.ts) ---');
    console.log('1. Valor de authToken recuperado de AsyncStorage:', authToken ? 'Token presente' : 'Token AUSENTE');
    if (!authToken) {
        console.warn('   ADVERTENCIA: No se encontró token de autenticación en AsyncStorage.');
        // Considera si la ruta de registro de token en el backend DEBE requerir autenticación
        // Si tu backend requiere el token, esta petición fallará con 403.
    }
    // =========================================================================

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // LOG AÑADIDO: Muestra la URL completa antes de la llamada fetch
    // =========================================================================
    const fullApiUrl = `${API_BASE_URL}/api/usuariosMobile/registerPushToken`;
    console.log('--- FRONTEND LOG (api.ts) ---');
    console.log('2. Realizando llamada a la URL del backend:', fullApiUrl);
    console.log('   Headers que se enviarán (sin Auth si no hay token):', headers); // No mostrar authToken directamente por seguridad

    // El cuerpo de la petición simplificado, ya que userId y userType se obtienen del JWT en el backend
    const requestBody = JSON.stringify({
      fcmToken: fcmToken, 
    });
    console.log('   Cuerpo de la petición que se enviará:', requestBody); // Muestra el cuerpo, que solo debe tener fcmToken

    const response = await fetch(fullApiUrl, { // Usa fullApiUrl aquí
      method: 'POST',
      headers: headers,
      body: requestBody, // Usa requestBody aquí
    });

    // =========================================================================
    // LOG AÑADIDO: Muestra el estado de la respuesta del backend
    // =========================================================================
    console.log('--- FRONTEND LOG (api.ts) ---');
    console.log('3. Respuesta del backend - Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('--- FRONTEND LOG (api.ts) ---');
      console.error('4. ERROR al registrar FCM token en backend!');
      console.error('   Mensaje de error del backend:', errorData.message || 'Sin mensaje específico');
      console.error('   Detalles completos del error:', errorData); // Para ver todos los detalles del error
      throw new Error(errorData.message || `Error ${response.status}: Failed to register push token.`);
    }

    console.log('--- FRONTEND LOG (api.ts) ---');
    console.log('5. Token FCM registrado con éxito en backend.');
    return response.json(); // Devuelve la respuesta del backend

  } catch (error: any) {
    console.error('--- FRONTEND LOG (api.ts) ---');
    console.error('6. Error de red o en API durante el registro del FCM token:', error.message);
    if (error.message.includes('Network request failed')) {
      console.error('   Sugerencia: Revisa tu conexión a internet o la URL del backend (`API_BASE_URL`).');
    }
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
      loginEndpoint = '/api/usuariosMobile/estudianteLogin'; // Ruta correcta para postulantes
    } else if (userType === 'empresa') {
      loginEndpoint = '/api/usuariosMobile/empresaLogin'; // Ruta correcta para empresas
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
    // Si la respuesta no es OK (ej. 401 Unauthorized, 500 Internal Server Error)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Login failed'); // Usa errorData.mensaje
    }
    const data: FrontendLoginResponse = await response.json();
    console.log('API: Datos recibidos del backend:', data); // <-- Añade esto
    return data;
  } catch (error: any) {
    console.error('Error during login API call:', error.message);
    throw error; // Propaga el error para que sea manejado por el componente que llama
  }
};

// Puedes añadir aquí otras funciones para interactuar con tu API...