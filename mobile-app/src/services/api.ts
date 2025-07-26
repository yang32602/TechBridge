// mobile-app/src/services/api.ts

// Asegúrate de que esta URL base esté bien configurada para tu IP/Emulador
// Si tu IP es 192.168.0.9 y tu backend corre en el puerto 3000
// mobile-app/src/config/api.ts DEBE tener: export const API_BASE_URL = 'http://192.168.0.9:3000';
import { API_BASE_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RespuestaRegistroTokenPush {
  message: string;
}

interface RespuestaLoginFrontend {
  userId: number;
  userType: 'estudiante' | 'empresa';
  token: string;
  mensaje?: string;
  estado: number;
}

// Función para enviar el token de Expo Push al backend
export const registrarTokenPushEnBackend = async (
  userId: number,
  userType: 'estudiante' | 'empresa',
  fcmToken: string,
  authToken?: string
): Promise<RespuestaRegistroTokenPush> => {
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
      body: JSON.stringify({ fcmToken: fcmToken }),
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
export const iniciarSesionUsuario = async (
  credentials: { correo: string; contrasena: string },
  userType: 'estudiante' | 'empresa'
): Promise<RespuestaLoginFrontend> => {
  try {
    let loginEndpoint = '';
    if (userType === 'estudiante') {
      loginEndpoint = '/api/usuariosMobile/estudianteLogin';
    } else if (userType === 'empresa') {
      loginEndpoint = '/api/usuariosMobile/empresaLogin';
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
      throw new Error(errorData.mensaje || 'Login failed');
    }
    const data: RespuestaLoginFrontend = await response.json();
    console.log('API: Datos recibidos del backend:', data); // <-- Añade esto
    return data;
  } catch (error: any) {
    console.error('Error during login API call:', error.message);
    throw error; // Propaga el error para que sea manejado por el componente que llama
  }
};

// Función para validar si el token sigue siendo válido
export const validarToken = async (): Promise<boolean> => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    const userType = await AsyncStorage.getItem('userType');
    
    if (!userToken || !userType) {
      console.log('validateToken: No hay token o userType en storage');
      return false;
    }

    // Verificar si el token está expirado localmente (decodificar JWT)
    try {
      const tokenParts = userToken.split('.');
      if (tokenParts.length !== 3) {
        console.log('validateToken: Token JWT malformado');
        return false;
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        console.log('validateToken: Token expirado localmente');
        return false;
      } else {
        console.log('validateToken: Token válido localmente, exp:', new Date(payload.exp * 1000));
        // Si el token es válido localmente, no necesitamos validar con el backend
        // ya que los endpoints de validación no existen en el backend
        console.log('validateToken: Token válido, no se requiere validación adicional del backend');
        return true;
      }
    } catch (jwtError) {
      console.error('validateToken: Error al decodificar JWT:', jwtError);
      return false;
    }
  } catch (error: any) {
    console.error('validateToken: Error al validar token:', error.message);
    // En caso de error, asumir que el token es válido para evitar logout forzado
    console.log('validateToken: Error en validación, asumiendo token válido por seguridad');
    return true;
  }
};

// Función para limpiar completamente la sesión
export const limpiarSesion = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userType');
    console.log('Sesión limpiada completamente');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

// Función para obtener información de la sesión actual
export const obtenerSesionActual = async (): Promise<{ id: number; userType: 'estudiante' | 'empresa'; token: string } | null> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const userType = await AsyncStorage.getItem('userType');
    const userToken = await AsyncStorage.getItem('userToken');

    if (userId && userType && userToken && (userType === 'estudiante' || userType === 'empresa')) {
      return { 
        id: parseInt(userId, 10), 
        userType: userType as 'estudiante' | 'empresa', 
        token: userToken 
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

// Puedes añadir aquí otras funciones para interactuar con tu API...

// NUEVAS FUNCIONES PARA LOS ENDPOINTS CREADOS

export const obtenerDetalleEstudiante = async (idEstudiante: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/estudiantes/detalle/${idEstudiante}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al obtener detalle del estudiante, response text:', errorText);
      throw new Error('Error al obtener detalle del estudiante');
    }
    const data = await response.json();
    console.log('getDetalleEstudiante data:', data);
    return data;
  } catch (error) {
    console.error('Error en getDetalleEstudiante:', error);
    throw error;
  }
};

export const obtenerPostulantesPorEmpresa = async (idEmpresa: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/empresas/${idEmpresa}/postulantes`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al obtener postulantes por empresa, response text:', errorText);
      throw new Error('Error al obtener postulantes por empresa');
    }
    const data = await response.json();
    console.log('getPostulantesPorEmpresa data:', data);
    return data;
  } catch (error) {
    console.error('Error en getPostulantesPorEmpresa:', error);
    throw error;
  }
};

export const obtenerNuevasPostulaciones = async (idEmpresa: string, periodo: 'dia' | 'semana') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/empresas/${idEmpresa}/nuevas-postulaciones?periodo=${periodo}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al obtener nuevas postulaciones, response text:', errorText);
      throw new Error('Error al obtener nuevas postulaciones');
    }
    const data = await response.json();
    console.log('getNuevasPostulaciones data:', data);
    return data;
  } catch (error) {
    console.error('Error en getNuevasPostulaciones:', error);
    throw error;
  }
};
