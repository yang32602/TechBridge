// mobile-app/app/_layout.tsx
if (__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

import React, { useEffect , useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import { registrarPushNotificacionesAsync, setupListenersNotificaciones } from '../src/utils/firebaseNotifications';
import { registrarTokenPushEnBackend, validarToken, limpiarSesion } from '../src/services/api';

// Función para detectar si es un nuevo build y limpiar datos antiguos
async function detectarYLimpiarNuevoBuild(): Promise<void> {
  try {
    const currentVersion = Constants.expoConfig?.version || '1.0.0';
    const storedVersion = await AsyncStorage.getItem('appVersion');
    
    console.log('🔍 Detectando versión de build...');
    console.log('   Versión actual:', currentVersion);
    console.log('   Versión almacenada:', storedVersion);
    
    if (!storedVersion || storedVersion !== currentVersion) {
      console.log('🆕 NUEVO BUILD DETECTADO - Limpiando datos antiguos...');
      
      // Limpiar todos los datos relacionados con tokens y sesión
      await AsyncStorage.multiRemove([
        'userToken',
        'userId', 
        'userType',
        'fcmToken', // Si guardas el FCM token
        'lastTokenRefresh' // Si tienes timestamp del último refresh
      ]);
      
      // Guardar la nueva versión
      await AsyncStorage.setItem('appVersion', currentVersion);
      
      console.log('✅ Datos antiguos limpiados exitosamente para nuevo build');
      console.log('   Nueva versión guardada:', currentVersion);
    } else {
      console.log('✅ Misma versión detectada - No se requiere limpieza');
    }
  } catch (error) {
    console.error('❌ Error al detectar/limpiar nuevo build:', error);
    // En caso de error, continuar normalmente pero log el problema
  }
}

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

    // 2. Detectar nuevo build y limpiar datos antiguos ANTES de cualquier otra operación
    const setupInicialConDeteccionBuild = async () => {
      // PASO 1: Detectar y limpiar nuevo build
      await detectarYLimpiarNuevoBuild();
      
      // PASO 2: Después de la limpieza, obtener info del usuario
      const userInfo = await obtenerUsuarioAuth();
      setCurrentUserInfo(userInfo); // Guarda la info del usuario en el estado

      if (userInfo) {
        console.log('👤 Usuario encontrado en almacenamiento. Validando token...');
        
        // Validar si el token sigue siendo válido
        const isTokenValid = await validarToken();
        
        if (isTokenValid) {
          console.log('✅ Token válido en _layout. Registrando FCM token...');
          
          // NO redirigir desde aquí, dejar que index.tsx maneje la redirección
          // Solo registrar FCM token en segundo plano
          const fcmToken = await registrarPushNotificacionesAsync();
          if (fcmToken) {
            try {
              console.log('🎉 FCM Token OBTENIDO DESDE LA APP (inicial):', fcmToken);
              await registrarTokenPushEnBackend(userInfo.id, userInfo.userType, fcmToken);
              console.log('✅ Token FCM inicial registrado con éxito en el backend.');
            } catch (error: any) {
              console.error('❌ Error al registrar el token FCM inicial en el backend:', error);
              
              // Si el error es por token inválido, limpiar sesión
              if (error.message && (
                error.message.includes('401') || 
                error.message.includes('403') || 
                error.message.includes('Unauthorized') ||
                error.message.includes('Token inválido')
              )) {
                console.log('🧹 Token de sesión inválido detectado. Limpiando sesión...');
                await limpiarSesion();
                setCurrentUserInfo(null);
              }
            }
          } else {
            console.warn('⚠️ No se pudo obtener el FCM Token inicial para el usuario autenticado.');
          }
        } else {
          console.log('❌ Token expirado o inválido. Limpiando sesión...');
          // Limpiar la sesión si el token no es válido
          await limpiarSesion();
          setCurrentUserInfo(null);
        }
      } else {
        console.log('👤 No hay usuario autenticado en el almacenamiento al iniciar la app.');
      }
      setAuthChecked(true); // Marca que la comprobación inicial de autenticación ha terminado
    };

    setupInicialConDeteccionBuild();

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
