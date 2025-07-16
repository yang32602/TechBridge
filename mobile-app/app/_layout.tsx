// mobile-app/app/_layout.tsx
import React, { useEffect, useRef } from 'react';
import { Stack, router } from 'expo-router'; // Importa 'router' de expo-router
import { StatusBar } from 'expo-status-bar';

// Importa tus funciones de utilidad para notificaciones
import { registerForPushNotificationsAsync, setupNotificationListeners } from '../src/utils/notifications'; // Ajusta la ruta si es necesario

export default function RootLayout() {
  useEffect(() => {
    let cleanupListeners: (() => void) | undefined;

    const setupNotifications = async () => {
      // 1. Obtener el token y enviarlo a tu backend
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log("Expo Push Token:", token);
        // AQUI: Debes enviar este 'token' a tu backend.
        // Lo ideal es que lo asocies con el 'userId' una vez que el usuario inicie sesión.
        // Esto podría hacerse a través de un hook de autenticación o un contexto.
        // Por ejemplo, una vez que sabes qué usuario está logueado, haces una llamada a tu API:
        // api.sendPushToken(token, currentUserId, currentUserType);
        // Asegúrate de manejar esto en tu flujo de inicio de sesión/registro.
      }

      // 2. Configurar listeners para notificaciones
      // Pasamos el objeto 'router' para que la utilidad pueda navegar
      cleanupListeners = setupNotificationListeners(router);
    };

    setupNotifications();

    // Limpia los listeners cuando el componente se desmonte
    return () => {
      if (cleanupListeners) {
        cleanupListeners();
      }
    };
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar

  return (
    <>
      <StatusBar style="light" /> {/* Puedes ajustar el estilo de la barra de estado */}
      <Stack>
        {/* Aquí defines tu estructura de navegación principal con Expo Router */}

        {/* La pantalla 'index' (que probablemente es tu pantalla de inicio/login) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Las rutas dentro de (tabs) se manejan con su propio _layout.tsx */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Ruta para el manejo de "no encontrado" */}
        <Stack.Screen name="+not-found" />

        {/* Puedes añadir otras rutas globales aquí, como pantallas de perfil o configuración
            que no estén dentro de las pestañas */}
        {/* <Stack.Screen name="profile/[id]" options={{ title: 'Perfil' }} /> */}
        {/* <Stack.Screen name="vacantes/[id]" options={{ title: 'Detalle Vacante' }} /> */}
      </Stack>
    </>
  );
}
