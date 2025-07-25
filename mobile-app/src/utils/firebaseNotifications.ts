// mobile-app/src/utils/firebaseNotifications.ts
// Implementación básica para integración con Firebase Cloud Messaging (FCM) V1 para notificaciones push

import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { Router } from 'expo-router'; // Importa Router desde expo-router
import { registerPushTokenOnBackend } from '../services/api'; // <--- ¡Importa tu función de API!
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// Define la interfaz para la información mínima del usuario que necesitamos
interface UserInfoForFCM {
  id: number;
  userType: 'estudiante' | 'empresa';
}


/**
 * Solicita permisos para recibir notificaciones push y obtiene el token FCM del dispositivo.
 * @returns {Promise<string | undefined>} Token FCM o undefined si no se pudo obtener.
 */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      Alert.alert('Permiso denegado', 'No se otorgaron permisos para notificaciones push.');
      return undefined;
    }

    // Obtener token FCM
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
    return fcmToken;
  } catch (error) {
    console.error('Error al registrar para notificaciones push:', error);
    return undefined;
  }
}

async function getLoggedInUserInfo(): Promise<UserInfoForFCM | null> {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const userType = await AsyncStorage.getItem('userType'); // 'estudiante' o 'empresa'

    if (userId && userType && (userType === 'estudiante' || userType === 'empresa')) {
      return { id: parseInt(userId, 10), userType: userType as 'estudiante' | 'empresa' };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener info de usuario de AsyncStorage:', error);
    return null;
  }
}


/**
 * Función auxiliar para manejar la navegación basada en la carga útil de la notificación.
 * @param data - Los datos de la notificación.
 * @param router - El objeto router de Expo Router para navegación.
 */
function handleNotificationNavigation(data: Record<string, any> | undefined, router: Router) {
  if (data && typeof data.screen === 'string') {
    const { screen, ...params } = data;
    console.log(`Intentando navegar a ${screen} con params:`, params);

    // Delay para evitar conflictos con redirección automática del login
    setTimeout(() => {
      const dynamicRouteTemplates: { [key: string]: string } = {
        'postulante/detalle/vacante': '/postulante/detalle/[id]',
        'empresa/detalle/postulante': '/empresa/detalle/[id]',
      };

      let handledAsDynamic = false;
      for (const key in dynamicRouteTemplates) {
        if (screen === key) { // Coincidencia exacta con el identificador de pantalla
          const pathnameTemplate = dynamicRouteTemplates[key];
          let idToPass;

          // Determinar qué ID pasar basado en el tipo de ruta dinámica
          if (key === 'postulante/detalle/vacante' && params.id) {
            idToPass = params.id; // El ID de la vacante para el postulante
          } else if (key === 'empresa/detalle/postulante' && params.postulanteId) {
            idToPass = params.postulanteId; // El ID del postulante para la empresa
          }

          if (idToPass) {
            console.log(`Navegando a ruta dinámica: ${pathnameTemplate} con ID: ${idToPass}`);
            router.push({
              pathname: pathnameTemplate as any, // 'as any' porque el tipo generico '[id]' no es string literal
              params: { id: idToPass, ...params } // Pasa el ID al parámetro '[id]' y el resto de los parámetros
            });
            handledAsDynamic = true;
            break;
          } else {
            console.warn(`Error: ID no proporcionado para la ruta dinámica ${screen}.`);
          }
        }
      }
      
      // Si no fue una ruta dinámica, intenta manejar como ruta estática
      if (!handledAsDynamic) {
        const validStaticRoutes = [
          '/signup',
          '/postulante/dashboard',
          '/postulante/vacantes-aplicadas',
          '/empresa/dashboard',
          '/empresa/postulaciones', // La lista de postulaciones para la empresa
          '/empresa/vacantes', // Si tuvieras una página para listar vacantes de la empresa
          '/empresa/notificaciones/nueva-postulacion',
        ];

        if (validStaticRoutes.includes(screen)) {
          console.log(`Navegando a ruta estática: ${screen}`);
          // Usamos 'push' para añadir a la pila de navegación
          router.push({
            pathname: screen as any, // 'as any' workaround
            params: params as Record<string, string | number | (string | number)[] | null | undefined>
          });
        } else {
          console.warn(`Ruta desconocida para navegación desde notificación: ${screen}. Navegación cancelada.`);
        }
      }
    }, 500); // Delay de 500ms para evitar conflictos con redirección automática
  } else {
    console.warn("Datos de notificación no tienen 'screen' válido para navegación o están vacíos.");
  }
}

/**
 * Configura los listeners para recibir notificaciones en primer plano y manejar interacciones.
 * @param router - El objeto router de Expo Router para manejar la navegación.
 * @returns {() => void} Función para remover los listeners.
 */
export function setupNotificationListeners(router: Router) {
  const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    console.log('Notificación recibida en primer plano:', remoteMessage);
    Alert.alert(
      remoteMessage.notification?.title || 'Nueva Notificación',
      remoteMessage.notification?.body || 'Has recibido un mensaje.',
      [
        { text: 'Ver', onPress: () => handleNotificationNavigation(remoteMessage.data, router) },
        { text: 'Cerrar', style: 'cancel' }
      ]
    );
  });

  const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notificación abierta por el usuario:', remoteMessage);
    handleNotificationNavigation(remoteMessage.data, router);
  });

  // Para manejar notificación que abrió la app desde estado cerrado
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('App abierta desde notificación (quit state):', remoteMessage);
        handleNotificationNavigation(remoteMessage.data, router);
      }
    });

  // Listener para tokens refrescados
  const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(async token => {
    console.log('FCM Token refrescado:', token);
    // Intentar obtener la información del usuario ANTES de enviar el token
    const userInfo = await getLoggedInUserInfo();
    if (userInfo) {
      try {
        await registerPushTokenOnBackend(userInfo.id, userInfo.userType, token);
        console.log('Token FCM refrescado enviado al backend con éxito para usuario:', userInfo.id);
      } catch (error) {
        console.error('Error al enviar FCM Token refrescado al backend:', error);
      }
    } else {
      console.warn('Usuario no logeado o sin info en AsyncStorage para enviar token FCM refrescado.');
    }
  });

  return () => {
    unsubscribeOnMessage();
    unsubscribeOnNotificationOpened();
    unsubscribeOnTokenRefresh(); // Asegúrate de limpiar también este listener
  };
}

/**
 * Función para enviar una notificación push de prueba localmente (solo para desarrollo).
 * Esta función debe ser implementada en backend o usando Firebase Admin SDK.
 * Aquí solo se deja como placeholder.
 */
export async function sendTestNotification() {
  console.warn('Función sendTestNotification no implementada. Debe implementarse en backend.');
}
