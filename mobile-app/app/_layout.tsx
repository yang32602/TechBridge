// mobile-app/app/_layout.tsx
import React, { useEffect , useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native'; // Asegúrate de importar Platform si lo usas en StatusBar
import AsyncStorage from '@react-native-async-storage/async-storage';

import { registerForPushNotificationsAsync, setupNotificationListeners } from '../src/utils/firebaseNotifications';
import { registerPushTokenOnBackend } from '../src/services/api'; // Para el token inicial

async function getAuthUserInfoFromStorage(): Promise<{ id: number; userType: 'estudiante' | 'empresa'; token: string } | null> {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const userType = await AsyncStorage.getItem('userType');
    const userToken = await AsyncStorage.getItem('userToken'); // Asumiendo que también guardas el token JWT

    if (userId && userType && userToken && (userType === 'estudiante' || userType === 'empresa')) {
      return { id: parseInt(userId, 10), userType: userType as 'estudiante' | 'empresa', token: userToken };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener info de usuario de AsyncStorage en _layout:', error);
    return null;
  }
}

export default function RootLayout() {
  const [authChecked, setAuthChecked] = useState(false); // Nuevo estado para indicar si ya se chequeó la autenticación
  const [currentUserInfo, setCurrentUserInfo] = useState<{ id: number; userType: 'estudiante' | 'empresa'; token: string } | null>(null);

  useEffect(() => {
    // 1. Configurar los listeners de Firebase FCM (para mensajes en primer plano, abrir app, y refresco de token)
    // Estos listeners no necesitan info del usuario al inicio, la obtienen cuando se activan (ej. token refresh)
    const cleanupListeners = setupNotificationListeners(router);

    // 2. Intentar registrar el token FCM inicial si el usuario ya está autenticado
    const setupInitialFcmToken = async () => {
      const userInfo = await getAuthUserInfoFromStorage();
      setCurrentUserInfo(userInfo); // Guarda la info del usuario en el estado

      if (userInfo) {
        console.log('Usuario ya autenticado en el almacenamiento. Intentando registrar FCM token.');
        const fcmToken = await registerForPushNotificationsAsync();
        if (fcmToken) {
          try {
            console.log('🎉 FCM Token OBTENIDO DESDE LA APP (inicial):', fcmToken);
            await registerPushTokenOnBackend(userInfo.id, userInfo.userType, fcmToken);
            console.log('Token FCM inicial registrado con éxito en el backend.');
          } catch (error) {
            console.error('Error al registrar el token FCM inicial en el backend:', error);
          }
        } else {
          console.warn('No se pudo obtener el FCM Token inicial para el usuario autenticado.');
        }
      } else {
        console.log('No hay usuario autenticado en el almacenamiento al iniciar la app.');
      }
      setAuthChecked(true); // Marca que la comprobación inicial de autenticación ha terminado
    };

    setupInitialFcmToken();

    // Función de limpieza para los listeners
    return () => {
      if (cleanupListeners) {
        cleanupListeners();
      }
    };
  }, []); // Se ejecuta solo una vez al montar el componente

  // Puedes usar 'authChecked' para renderizar un splash screen o loading inicial
  if (!authChecked) {
    // Retorna un splash screen o un indicador de carga mientras se verifica la auth y se configura FCM
    return null; // O un componente <SplashScreen />
  }

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