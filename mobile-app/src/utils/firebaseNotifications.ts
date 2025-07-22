// mobile-app/src/utils/firebaseNotifications.ts
// Implementación básica para integración con Firebase Cloud Messaging (FCM) V1 para notificaciones push

import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { Router } from 'expo-router'; // Importa Router desde expo-router
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

/**
 * Función auxiliar para manejar la navegación basada en la carga útil de la notificación.
 * @param data - Los datos de la notificación.
 * @param router - El objeto router de Expo Router para navegación.
 */
function handleNotificationNavigation(data: Record<string, any> | undefined, router: Router) {
  if (data && typeof data.screen === 'string') {
    const { screen, ...params } = data;
    console.log(`Intentando navegar a ${screen} con params:`, params);

    const dynamicRouteTemplates: { [key: string]: string } = {
      'postulante/detalle': 'postulante/detalle/[id]',
      'empresa/detalle': 'empresa/detalle/[id]',
    };

    let handledAsDynamic = false;
    for (const basePrefix in dynamicRouteTemplates) {
      if (screen.startsWith(`${basePrefix}/`) && params.id) {
        const pathnameTemplate = dynamicRouteTemplates[basePrefix];
        router.push({
          pathname: pathnameTemplate as any, // CAMBIO: Usamos 'any' aquí para evitar el error de tipo.
                                            // Esto le dice a TypeScript que confíe en que sabemos que el string es una ruta válida.
          params: { id: params.id, ...params }
        });
        handledAsDynamic = true;
        console.log(`Navegando a ruta dinámica: ${pathnameTemplate} con ID: ${params.id}`);
        break;
      }
    }
    // Si no fue una ruta dinámica, intenta manejar como ruta estática
    if (!handledAsDynamic) {
      const validRoutes = [
        'postulante/dashboard',
        'postulante/vacantes-aplicadas',
        'empresa/dashboard',
        'empresa/postulaciones',
      ];

      if (validRoutes.includes(screen)) {
        // Usamos 'push' para añadir a la pila de navegación
        router.push({
          pathname: screen as any, // 'as any' workaround
          params: params as Record<string, string | number | (string | number)[] | null | undefined>
        });
        console.log(`Navegando a ruta estática: ${screen}`);
      } else {
        console.warn(`Ruta desconocida para navegación desde notificación: ${screen}. Navegación cancelada.`);
      }
    } else {
      console.warn("Datos de notificación no tienen 'screen' válido para navegación o están vacíos.");
    }
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
    // Aquí deberías enviar el nuevo token a tu backend para actualizarlo
    // Si el usuario está logeado, podrías usar registerPushTokenOnBackend aquí.
    // Esto es crucial para asegurar que siempre tengas un token válido en tu DB.
    // Considera una estrategia para reenviar el token si la app está en segundo plano.
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
