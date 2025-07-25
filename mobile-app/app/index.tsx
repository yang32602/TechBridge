//mobile-app/app/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useFonts } from 'expo-font';
import { router, type RelativePathString, type ExternalPathString } from 'expo-router';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Importa tus funciones API y de notificaciones
import { loginUser, registerPushTokenOnBackend, validateToken, clearSession } from '../src/services/api';
import { registerForPushNotificationsAsync } from '../src/utils/firebaseNotifications';

// Obtener el ancho de la pantalla para estilos responsivos si es necesario
const { width } = Dimensions.get('window');

// Estilos de color y fuente (adaptados de tu styleguide.css)
// Puedes crear un archivo separado para esto, ej: src/constants/colors.ts, src/constants/fonts.ts
const Colors = {
  neutrals100: '#25324B',
  neutrals40: '#A8ADBB',
  neutrals80: '#515B6F',
  neutrals0: '#FFFFFF',
  black: '#202430',
  brandsSecondary: '#CCCCF5',
  neutrals20: '#D6DDEB',
  techBridgeBlue: '#0A5CB8', // De tu css para el color del botón y links
  techBridgeLightBlue: '#C2DFFF', // Color de fondo del tab "Postulante"
};

// Se necesitan las fuentes en el proyecto
// Asegúrate de tener los archivos .ttf de estas fuentes en tu carpeta assets/fonts/
// o similar, y cárgalas correctamente.
// Aquí solo simulamos que ya están cargadas.
const FontFamilies = {
  epilogueSemiBold: 'Epilogue-SemiBold', // Mapping for font loading
  epilogueRegular: 'Epilogue-Regular',
  epilogueBold: 'Epilogue-Bold', // For button-normal-font-weight: 700
  leagueSpartanSemiBold: 'LeagueSpartan-SemiBold', // For 32px title
  interSemiBold: 'Inter-SemiBold', // For "Crea una cuenta"
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'estudiante' | 'empresa'>('estudiante');
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Carga de fuentes (asegúrate de que los archivos estén en assets/fonts)
  const [fontsLoaded] = useFonts({
    'Epilogue-SemiBold': require('../assets/fonts/Epilogue-SemiBold.ttf'), // Ajusta la ruta
    'Epilogue-Regular': require('../assets/fonts/Epilogue-Regular.ttf'),   // Ajusta la ruta
    'Epilogue-Bold': require('../assets/fonts/Epilogue-Bold.ttf'),         // Ajusta la ruta
    'LeagueSpartan-SemiBold': require('../assets/fonts/LeagueSpartan-SemiBold.ttf'), // Ajusta la ruta
    'Inter-SemiBold': require('../assets/fonts/Inter_28pt-SemiBold.ttf'),        // Ajusta la ruta
  });

  // Verificar si ya hay una sesión activa al cargar la pantalla
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const userType = await AsyncStorage.getItem('userType');
        const userToken = await AsyncStorage.getItem('userToken');

        if (userId && userType && userToken && (userType === 'estudiante' || userType === 'empresa')) {
          console.log('Sesión existente encontrada en login screen. Validando token...');
          
          // Validar si el token sigue siendo válido
          const isTokenValid = await validateToken();
          
          if (isTokenValid) {
            console.log('Token válido en login screen. Redirigiendo...');
            
            // Pequeño delay para evitar conflictos con navegación de notificaciones
            setTimeout(() => {
              // Redirigir al dashboard correspondiente
              if (userType === 'estudiante') {
                router.replace('/postulante/dashboard' as RelativePathString | ExternalPathString);
              } else if (userType === 'empresa') {
                router.replace('/empresa/dashboard' as RelativePathString | ExternalPathString);
              }
            }, 100);
          } else {
            console.log('Token expirado en login screen. Limpiando sesión...');
            // Limpiar la sesión si el token no es válido
            await clearSession();
          }
        }
      } catch (error) {
        console.error('Error al verificar sesión existente:', error);
      }
    };

    if (fontsLoaded) {
      // Verificar inmediatamente sin esperar
      checkExistingSession();
    }
  }, [fontsLoaded]);

  const handleLogin = async () => {
    setIsLoading(true); // Mostrar indicador de carga
    try {
      // 1. Intentar iniciar sesión con el backend
      // Se pasa un objeto con 'correo' y 'contrasena' (nombres de campos que espera tu backend)
      // Se pasa 'activeTab' para que loginUser sepa qué endpoint usar
      const loginResponse = await loginUser({ correo: email, contrasena: password }, activeTab);
      // loginResponse debería ser un objeto como: { userId: 1, userType: 'postulante', token: 'tu_jwt_aqui' }

      console.log('LoginScreen: loginResponse después de llamar a loginUser:', loginResponse); // <-- Añade esto
      // 2. Si el login es exitoso, obtener el token de notificación del dispositivo
      if (loginResponse && loginResponse.userId && loginResponse.userType && loginResponse.token) {
        // --- INICIO: LÓGICA CLAVE PARA ALMACENAR Y REGISTRAR FCM TOKEN ---

        // 2. Guardar la información del usuario en AsyncStorage
        // Esto es CRUCIAL para que _layout.tsx y firebaseNotifications.ts puedan acceder a ellos
        await AsyncStorage.setItem('userToken', loginResponse.token);
        await AsyncStorage.setItem('userId', String(loginResponse.userId)); // Guardar como string
        await AsyncStorage.setItem('userType', loginResponse.userType);

        // 3. Obtener el token de notificación del dispositivo (FCM Token)
        const fcmToken = await registerForPushNotificationsAsync();
        console.log('🎉 FCM Token OBTENIDO DESPUÉS DEL LOGIN:', fcmToken); // Log importante

        // 4. Enviar el token FCM y los datos del usuario al backend
        if (fcmToken) {
          try {
            await registerPushTokenOnBackend(
              loginResponse.userId,
              loginResponse.userType,
              fcmToken,
              loginResponse.token // Pasa el token de sesión (JWT) para autenticar la petición
            );
            console.log('Token FCM registrado con éxito en el backend después del login.');
          } catch (fcmRegisterError) {
            console.error('Error al registrar FCM Token en backend después del login:', fcmRegisterError);
            Alert.alert('Error de Notificaciones', 'No se pudo registrar el dispositivo para notificaciones push. Por favor, reintenta más tarde.');
          }
        }

        // --- FIN: LÓGICA CLAVE PARA ALMACENAR Y REGISTRAR FCM TOKEN ---


        // 5. Navegar a la pantalla principal después de un login exitoso y registro de token
        if (loginResponse.userType === 'estudiante') {
          router.replace('/postulante/dashboard' as RelativePathString | ExternalPathString);
        } else if (loginResponse.userType === 'empresa') {
          router.replace('/empresa/dashboard' as RelativePathString | ExternalPathString);
        } else {
          Alert.alert('Error de inicio de sesión', 'Tipo de usuario no reconocido. Por favor, contacta a soporte.');
        }

      } else {
        console.log('LoginScreen: loginResponse es incompleto o falsy:', loginResponse);
        Alert.alert('Error de inicio de sesión', loginResponse?.mensaje || 'Credenciales inválidas o datos de usuario incompletos recibidos.');
      }
    } catch (error: any) {
      // Manejo de errores de la API (ej. 401 Credenciales inválidas, Network request failed)
      console.error('Error durante el inicio de sesión o registro de token:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setIsLoading(false); // Ocultar indicador de carga
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color={Colors.techBridgeBlue} style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.loginPostulante}>
      <View style={styles.topNav}>
        <Image
          style={styles.logo}
          source={{ uri: 'https://c.animaapp.com/mOfRBxl8/img/logo-3.png' }}
        />
      </View>
      <View style={styles.landingPageLogin}>
        <View style={styles.frame}>
          <View style={styles.signUpOptions}>
            <TouchableOpacity
              style={[styles.tabBase, activeTab === 'estudiante' ? styles.activeTab : styles.inactiveTab]} // Modificado
              onPress={() => setActiveTab('estudiante')}
            >
              <Text style={[styles.caption, activeTab === 'estudiante' && styles.activeCaption]}>Postulante</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBase, activeTab === 'empresa' ? styles.activeTab : styles.inactiveTab]} // Modificado
              onPress={() => setActiveTab('empresa')}
            >
              <Text style={[styles.caption, activeTab === 'empresa' && styles.activeCaption]}>Empresa</Text>
            </TouchableOpacity>
          </View>
          {activeTab === 'estudiante' && (
            <Text style={styles.welcomeBackDude}>Obten más oportunidades</Text>
          )}
          {activeTab === 'empresa' && (
            <Text style={styles.welcomeBackDude}>Impulsa tu empresa</Text>
          )}
        </View>

        <View style={styles.forms}>
          <View style={styles.textfield}>
            <Text style={styles.label}>Correo</Text>
            <View style={styles.input}>
              <TextInput
                style={styles.textInputStyle}
                placeholder="Ingresa tu correo"
                placeholderTextColor={Colors.neutrals40}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={styles.textfield}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.input}>
              <TextInput
                style={styles.textInputStyle}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor={Colors.neutrals40}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={Colors.neutrals80} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.divWrapper}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.neutrals0} />
            ) : (
              <Text style={styles.caption2}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.alreadyHaveAn}>
          <Text style={styles.dontHaveAn}>¿No tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => router.push('/signup' as RelativePathString | ExternalPathString)}> {/* Asume una ruta de registro */}
            <Text style={styles.signUp}>Crea una cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// --- StyleSheet para React Native ---
const styles = StyleSheet.create({
  loginPostulante: {
    flex: 1,
    backgroundColor: Colors.neutrals0,
    justifyContent: 'center', // ¡NUEVO! Centra los hijos verticalmente
    alignItems: 'center',     // ¡NUEVO! Centra los hijos horizontalmente (si es necesario para todo el contenedor)
    paddingTop: 50,
    paddingVertical: 20, // Opcional: añadir un poco de padding vertical si todo se pega a los bordes
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 37,
    paddingHorizontal: 16,
    paddingBottom: 0,
    width: '100%',
    backgroundColor: Colors.neutrals0,
  },
  logo: {
    width: 240,
    height: 80,
    resizeMode: 'contain',
    marginTop: -1,
  },
  landingPageLogin: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    maxWidth: 383,
    alignSelf: 'center',
    alignItems: 'flex-start',
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 40,
    backgroundColor: Colors.neutrals0,
  },
  frame: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    width: '100%',
  },
  signUpOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: Colors.techBridgeLightBlue,
  },
  caption: {
    fontFamily: FontFamilies.epilogueSemiBold,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 16 * 1.6,
    color: Colors.neutrals100,
    marginTop: -1,
  },
  activeTab: {
    backgroundColor: Colors.techBridgeLightBlue,
  },
  inactiveTab: {
    backgroundColor: Colors.neutrals0, // El color de fondo cuando NO está activo
    // Aquí puedes añadir un borde si quieres diferenciarlos más cuando están inactivos
    // borderWidth: 1,
    // borderColor: Colors.neutrals20,
  },
  activeCaption: {
    color: Colors.techBridgeBlue,
  },
  tabBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    // NO pongas backgroundColor aquí if you want 'inactiveTab' to define it
    // or if the global background of the tab container is already neutral.
    // You could put a borderRadius or a border here if it's common for both.
  },
  captionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: Colors.neutrals0,
  },
  welcomeBackDude: {
    width: '100%',
    fontFamily: FontFamilies.leagueSpartanSemiBold,
    fontSize: 32,
    lineHeight: 38.4,
    textAlign: 'center',
    color: Colors.neutrals100,
  },
  orSignUpWith: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutrals20,
  },
  orLoginWithEmail: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 16 * 1.6,
    color: Colors.neutrals40,
    textAlign: 'center',
    marginTop: -1,
  },
  forms: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 22,
    width: '100%',
  },
  textfield: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    width: '100%',
  },
  label: {
    fontFamily: FontFamilies.epilogueSemiBold,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 16 * 1.6,
    color: Colors.neutrals80,
    marginTop: -1,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: Colors.neutrals0,
    borderWidth: 1,
    borderColor: Colors.neutrals20,
  },
  textInputStyle: {
    flex: 1,
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 16,
    color: Colors.neutrals100,
  },
  eyeIcon: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.techBridgeBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  caption2: {
    fontFamily: FontFamilies.epilogueBold,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 16 * 1.6,
    color: Colors.neutrals0,
    textAlign: 'center',
    marginTop: -1,
  },
  alreadyHaveAn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: -14,
  },
  dontHaveAn: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 16 * 1.6,
    color: Colors.black,
    marginTop: -1,
    opacity: 0.7,
  },
  signUp: {
    fontFamily: FontFamilies.interSemiBold,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.techBridgeBlue,
    textAlign: 'center',
    marginTop: -1,
  },
});
