// mobile-app/app/_layout.tsx
import React, { useEffect} from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native'; // Asegúrate de importar Platform si lo usas en StatusBar

// Importa las utilidades de notificaciones de Firebase
import { setupNotificationListeners } from '../src/utils/firebaseNotifications';

export default function RootLayout() {
  useEffect(() => {
    const cleanupListeners = setupNotificationListeners(router);
    return () => {
      if (cleanupListeners) {
        cleanupListeners();
      }
    };
  }, []);

  return (
    <>
      {/* Ajusta el estilo de la barra de estado. 'dark' es bueno para fondos claros. */}
      <StatusBar style="dark" animated={true} />
      
      <Stack>
        {/* LoginScreen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/* Pantalla de Registro */}
        <Stack.Screen name="signup" options={{ headerShown: false }} />

        {/* ======================= Delegación a Layouts Anidados ======================= */}
        
        {/* Rutas para Postulante:
            Esta línea le dice a Expo Router que para CUALQUIER ruta dentro de la carpeta 'postulante',
            utilice el layout definido en 'mobile-app/app/postulante/_layout.tsx'.
            El 'headerShown: false' aquí en el layout raíz es un respaldo para asegurarnos de
            que el header por defecto de Stack no aparezca, aunque el _layout.tsx anidado también lo maneja.
        */}
        <Stack.Screen name="postulante" options={{ headerShown: false }} />

        {/* Rutas para Empresa:
            Similar a 'postulante', delega a 'mobile-app/app/empresa/_layout.tsx'.
            De nuevo, 'headerShown: false' es un respaldo.
        */}
        <Stack.Screen name="empresa" options={{ headerShown: false }} />
        
        {/* ======================= Rutas Genéricas / No Encontradas ======================= */}
        
        {/* Ruta para el manejo de "no encontrado" */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}