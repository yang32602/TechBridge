// mobile-app/src/utils/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'; // Importa expo-device
import Constants from 'expo-constants'; // Importa expo-constants
import { Platform } from 'react-native';

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
      projectId: Constants.expoConfig?.extra?.eas?.projectId || Constants.expoConfig?.owner // Expo Router uses projectId from app.json/app.config.js
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
 * @param {any} router - El objeto 'router' de Expo Router para la navegación.
 * @returns {() => void} Una función para limpiar los listeners al desmontar el componente.
 */
export function setupNotificationListeners(router: any) {
  // Listener para notificaciones recibidas mientras la app está en primer plano
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log("Notification received in foreground:", notification);
    // Aquí puedes hacer algo en la UI si la app está abierta, como mostrar un banner flotante
  });

  // Listener para cuando el usuario presiona o interactúa con una notificación
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log("Notification tapped/interacted:", response);
    // Extraer datos personalizados de la notificación
    const { screen, data } = response.notification.request.content.data;

    if (screen) {
      console.log(`Navigating to ${screen} with data:`, data);
      // Usar el objeto `router` de Expo Router para navegar
      // router.push() para añadir una nueva pantalla a la pila
      // router.replace() para reemplazar la pantalla actual
      // router.navigate() para navegar de forma inteligente (push o reemplazar)

      // Asegúrate de que `screen` sea una ruta válida en tu Expo Router,
      // por ejemplo, 'profile', 'vacantes/detalle', 'empresa/postulaciones'
      // y que `data` sea un objeto de parámetros válido para esa ruta.
      router.push({ pathname: screen, params: data });
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
      data: { screen: 'explore', itemId: '123' },
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