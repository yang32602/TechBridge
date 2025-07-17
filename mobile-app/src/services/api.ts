// mobile-app/src/services/api.ts
import { API_BASE_URL } from '../config/api'; // Importa la URL base que acabas de definir

interface RegisterPushTokenResponse {
  message: string;
}

// Función para enviar el token de Expo Push al backend
export const registerPushTokenOnBackend = async (
  userId: number,
  userType: 'postulante' | 'empresa',
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

    const response = await fetch(`${API_BASE_URL}/registerPushToken`, {
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

// Función de ejemplo para el login (asegúrate de que esta función exista y devuelva los datos necesarios)
// Adapta esto a cómo manejas actualmente el inicio de sesión en tu app.
export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, { // Asegúrate de que esta sea la URL de tu endpoint de login
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    // ESTO ES CLAVE: Asume que la respuesta del login incluye el userId, userType, y el token de sesión (JWT)
    // Ejemplo de lo que debería devolver tu backend en un login exitoso:
    // { userId: 123, userType: 'postulante', token: 'eyJhbGciOiJIUzI1Ni...' }
    return data;
  } catch (error: any) {
    console.error('Error during login API call:', error.message);
    throw error;
  }
};

// Puedes añadir aquí otras funciones para interactuar con tu API...