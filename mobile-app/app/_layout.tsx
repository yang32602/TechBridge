// mobile-app/app/_layout.tsx
import React, { useEffect , useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { registrarPushNotificacionesAsync, setupListenersNotificaciones } from '../src/utils/firebaseNotifications';
import { registrarTokenPushEnBackend, validarToken, limpiarSesion } from '../src/services/api';

async function obtenerUsuarioAuth(): Promise<{ id: number; userType: 'estudiante' | 'empresa'; token: string } | null> {
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
    const limpiarListeners = setupListenersNotificaciones(router);

    // 2. Intentar registrar el token FCM inicial si el usuario ya está autenticado
    const setupInicialFcmToken = async () => {
      const userInfo = await obtenerUsuarioAuth();
      setCurrentUserInfo(userInfo); // Guarda la info del usuario en el estado

      if (userInfo) {
        console.log('Usuario encontrado en almacenamiento. Validando token...');
        
        // Validar si el token sigue siendo válido
        const isTokenValid = await validarToken();
        
        if (isTokenValid) {
          console.log('Token válido en _layout. Solo registrando FCM token...');
          
          // NO redirigir desde aquí, dejar que index.tsx maneje la redirección
          // Solo registrar FCM token en segundo plano
          const fcmToken = await registrarPushNotificacionesAsync();
          if (fcmToken) {
            try {
              console.log('🎉 FCM Token OBTENIDO DESDE LA APP (inicial):', fcmToken);
              await registrarTokenPushEnBackend(userInfo.id, userInfo.userType, fcmToken);
              console.log('Token FCM inicial registrado con éxito en el backend.');
            } catch (error) {
              console.error('Error al registrar el token FCM inicial en el backend:', error);
            }
          } else {
            console.warn('No se pudo obtener el FCM Token inicial para el usuario autenticado.');
          }
        } else {
          console.log('Token expirado o inválido. Limpiando sesión...');
          // Limpiar la sesión si el token no es válido
          await limpiarSesion();
          setCurrentUserInfo(null);
        }
      } else {
        console.log('No hay usuario autenticado en el almacenamiento al iniciar la app.');
      }
      setAuthChecked(true); // Marca que la comprobación inicial de autenticación ha terminado
    };

    setupInicialFcmToken();

    // Función de limpieza para los listeners
    return () => {
      if (limpiarListeners) {
        limpiarListeners();
      }
    };
  }, []); // Se ejecuta solo una vez al montar el componente

  
  if (!authChecked) {
    // Retorna un splash screen o un indicador de carga mientras se verifica la auth y se configura FCM
    return null; 
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

        <Stack.Screen name="postulante" options={{ headerShown: false }} />

        <Stack.Screen name="empresa" options={{ headerShown: false }} />

        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
