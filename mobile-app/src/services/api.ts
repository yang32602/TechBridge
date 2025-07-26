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
    
    // Obtener el token de autenticación de AsyncStorage
    const storedAuthToken = await AsyncStorage.getItem('userToken');
    console.log('🔐 REGISTRO FCM TOKEN - Verificando autenticación...');
    console.log('   Token presente en AsyncStorage:', storedAuthToken ? 'SÍ' : 'NO');
    
    if (!storedAuthToken) {
      console.warn('⚠️ ADVERTENCIA: No hay token de autenticación disponible');
      throw new Error('Token de autenticación no disponible. Por favor, inicia sesión nuevamente.');
    }

    // Verificar si el token no está expirado antes de usarlo
    try {
      const tokenParts = storedAuthToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          console.warn('⚠️ Token de autenticación expirado localmente');
          throw new Error('Token de autenticación expirado. Por favor, inicia sesión nuevamente.');
        }
      }
    } catch (jwtError) {
      console.warn('⚠️ No se pudo verificar la expiración del token:', jwtError);
      // Continuar con la petición, el backend validará el token
    }

    headers['Authorization'] = `Bearer ${storedAuthToken}`;

    const fullApiUrl = `${API_BASE_URL}/api/usuariosMobile/registerPushToken`;
    console.log('📡 Enviando FCM token al backend...');
    console.log('   URL:', fullApiUrl);
    console.log('   FCM Token (primeros 20 chars):', fcmToken.substring(0, 20) + '...');

    const response = await fetch(fullApiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ fcmToken: fcmToken }),
    });

    console.log('📡 Respuesta del backend - Status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        // Si no se puede parsear la respuesta como JSON
        errorData = { message: `Error HTTP ${response.status}` };
      }
      
      console.error('❌ ERROR al registrar FCM token en backend!');
      console.error('   Status:', response.status);
      console.error('   Mensaje:', errorData.message || 'Sin mensaje específico');
      
      // Crear un mensaje de error más específico basado en el status code
      let errorMessage = errorData.message || `Error ${response.status}: Failed to register push token.`;
      
      if (response.status === 401) {
        errorMessage = 'Token de autenticación inválido. Por favor, inicia sesión nuevamente.';
      } else if (response.status === 403) {
        errorMessage = 'No tienes permisos para registrar el token push.';
      } else if (response.status === 500) {
        errorMessage = 'Error interno del servidor. Intenta nuevamente más tarde.';
      }
      
      throw new Error(errorMessage);
    }

    console.log('✅ Token FCM registrado exitosamente en backend');
    return response.json();

  } catch (error: any) {
    console.error('❌ Error durante el registro del FCM token:', error.message);
    
    // Mejorar los mensajes de error para diferentes tipos de problemas
    if (error.message.includes('Network request failed')) {
      throw new Error('Error de conexión. Verifica tu conexión a internet y que el servidor esté disponible.');
    } else if (error.message.includes('fetch')) {
      throw new Error('Error de red al conectar con el servidor. Intenta nuevamente.');
    }
    
    // Propagar el error original si ya tiene un mensaje específico
    throw error;
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
    await AsyncStorage.multiRemove([
      'userToken',
      'userId',
      'userType',
      'fcmToken', // También limpiar FCM token si se guarda
      'lastTokenRefresh' // Y cualquier timestamp de refresh
    ]);
    console.log('✅ Sesión limpiada completamente (incluyendo tokens FCM)');
  } catch (error) {
    console.error('❌ Error clearing session:', error);
  }
};

// Nueva función para detectar y manejar tokens inválidos automáticamente
export const manejarErrorToken = async (error: any): Promise<boolean> => {
  try {
    // Verificar si el error indica un problema de autenticación
    const isAuthError = error.message && (
      error.message.includes('401') ||
      error.message.includes('403') ||
      error.message.includes('Unauthorized') ||
      error.message.includes('Token inválido') ||
      error.message.includes('Token de autenticación inválido') ||
      error.message.includes('Token de autenticación no disponible')
    );

    if (isAuthError) {
      console.log('🧹 Error de autenticación detectado - Limpiando sesión automáticamente...');
      await limpiarSesion();
      return true; // Indica que se limpió la sesión
    }

    return false; // No se requirió limpieza
  } catch (cleanupError) {
    console.error('❌ Error durante la limpieza automática de sesión:', cleanupError);
    return false;
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
