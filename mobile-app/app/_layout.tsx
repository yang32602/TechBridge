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
        // IMPORTANTE: NO ENVÍES EL TOKEN AL BACKEND AQUÍ.
        // Esto se hace en tu pantalla de LOGIN (app/(tabs)/index.tsx)
        // una vez que el usuario esté autenticado y sepas su userId y userType.
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

        {/* LoginScreen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Pantalla de Registro */}
        <Stack.Screen name="signup" options={{ headerShown: false }} />

        {/* Rutas para Postulante */}
        <Stack.Screen name="postulante/dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="postulante/notificaciones" options={{ title: 'Mis Notificaciones' }} />
        {/* Si Postulante tiene su propio _layout.tsx para sub-rutas, puedes usar: */}
        {/* <Stack.Screen name="postulante" options={{ headerShown: false }} /> */}

        {/* Rutas para Empresa */}
        <Stack.Screen name="empresa/dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="empresa/notificaciones" options={{ title: 'Mis Notificaciones' }} />
        {/* Si Empresa tiene su propio _layout.tsx, puedes usar: */}
        {/* <Stack.Screen name="empresa" options={{ headerShown: false }} /> */}
        
        {/* Ruta para el manejo de "no encontrado" */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}