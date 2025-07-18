// mobile-app/src/utils/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'; // Importa expo-device
import Constants from 'expo-constants'; // Importa expo-constants
import { Platform } from 'react-native';
import { Router } from 'expo-router'; // Importa el tipo Router para tipado correcto

// Configura cómo se deben manejar las notificaciones cuando la app está en primer plano
// Esto es importante para decidir si la notificación se muestra como un banner, si reproduce sonido, etc.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    // Agrega estas dos propiedades que faltan según el error
    shouldShowBanner: true, // Esto es generalmente lo que quieres para notificaciones push
    shouldShowList: true,   // Esto es para mostrar en la lista de notificaciones del sistema
  }),
});

/**
 * Solicita permisos de notificación al usuario y obtiene el token de Expo Push para el dispositivo.
 * Este token es el que tu backend usará para enviar notificaciones push.
 * @returns {Promise<string | undefined>} El token de Expo Push o undefined si no se pudo obtener.
 */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token;

  // Asegúrate de que el código se ejecute en un dispositivo físico para las notificaciones push
  if (Device.isDevice) {
    // Comprobar el estado actual de los permisos
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Si los permisos no han sido otorgados, solicitarlos
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Si los permisos no se otorgaron, alertar al usuario
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    // Si es Android, configura un canal de notificación (obligatorio desde Android 8.0)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX, // Muestra la notificación de forma destacada
        vibrationPattern: [0, 250, 250, 250], // Patrón de vibración
        lightColor: '#FF231F7C', // Color de la luz LED si el dispositivo lo soporta
      });
    }

    // Obtener el token de Expo Push
    
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId || Constants.expoConfig?.owner  // Expo Router usa projectId de app.json/app.config.js o el owner
    })).data;

    console.log('Expo Push Token:', token);
    return token;

  } else {
    // Si no es un dispositivo físico, no se pueden obtener tokens de push
    alert('Must use physical device for Push Notifications');
  }

  return undefined;
}

/**
 * Escucha las notificaciones recibidas y las interacciones del usuario con ellas.
 * @param {Router} router - El objeto 'router' de Expo Router para la navegación.
 * @returns {() => void} Una función para limpiar los listeners al desmontar el componente.
 */
export function setupNotificationListeners(router: Router) { // Cambiado 'any' por 'Router' para mejor tipado
  // Listener para notificaciones recibidas mientras la app está en primer plano
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log("Notification received in foreground:", notification);
    // Aquí puedes hacer algo en la UI si la app está abierta, como mostrar un banner flotante
  });

  // Listener para cuando el usuario presiona o interactúa con una notificación
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log("Notification tapped/interacted:", response);
    // Extraer datos personalizados de la notificación
    // Asumimos que `data` contiene `{ screen: 'postulanteNotificaciones', itemId: 'ID_DE_LA_OFERTA' }`
    const { screen, ...data } = response.notification.request.content.data; // Desestructuramos 'screen' y el resto de 'data'

    // Define el tipo esperado para los parámetros del router
    type RouterParams = Record<string, string | number | (string | number)[] | null | undefined>;

    if (typeof screen === 'string') { // Asegurarnos de que 'screen' sea una cadena
      console.log(`Navigating to ${screen} with data:`, data);

      // Lógica de redirección basada en la pantalla y, opcionalmente, otros datos
      switch (screen) {
        case 'postulanteDashboard':
          router.push('/postulante/dashboard');
          break;
        case 'postulanteNotificaciones':
          // Ejemplo: Si itemId es el ID de una oferta, navegar a una pantalla de detalle de oferta
          router.push({ pathname: '/postulante/notificaciones', params: data as RouterParams});
          break;
        case 'empresaDashboard':
          router.push('/empresa/dashboard');
          break;
        case 'empresaNotificaciones':
          // Ejemplo: Si itemId es el ID de un postulante, navegar a una pantalla de detalle del postulante
          router.push({ pathname: '/empresa/notificaciones', params: data as RouterParams});
          break;
        // Añade más casos si tienes otras pantallas a las que las notificaciones pueden redirigir
        default:
          // Redirección por defecto si la pantalla no es reconocida (ej. al dashboard principal)
          // Puedes usar router.replace si quieres que no se pueda volver a la notificación
          router.push('/postulante/dashboard'); // O a una ruta genérica como '/home'
          break;
      }
    } else {
      console.warn("Notification data 'screen' is missing or not a string, cannot navigate.");
    }
  });

  // Función para limpiar los listeners
  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}

// Función opcional para enviar una notificación de prueba localmente (solo para depuración)
export async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Título de Prueba! 📬",
      body: 'Este es el cuerpo de la notificación de prueba.',
      data: {
        screen: 'postulanteNotificaciones', // Ejemplo: redirige a la pantalla de notificaciones del postulante
        itemId: 'oferta123', // Ejemplo de un ID de item
        messageId: 'msg456'
      },
    },
    // Modifica el trigger para incluir 'type'
    trigger: {
      repeats: false, // Opcional: true si quieres que se repita
      seconds: 2,
      // La propiedad 'type' podría ser necesaria para algunas configuraciones
      // pero 'seconds' ya implica un TimeIntervalTrigger.
      // Si el error persiste, intenta con esto, aunque es menos común para 'seconds':
      // type: 'timeInterval', // Si esto da error, probemos sin él.
    } as Notifications.TimeIntervalTriggerInput,
  });
}