// mobile-app/src/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para iconos
import { router } from 'expo-router'; // Para navegación
import { Colors, FontFamilies, Spacing } from '../constants/theme'; // Asegúrate de la ruta correcta

interface HeaderProps {
  title?: string; // Título opcional, si no hay logo
  showLogo?: boolean;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void; // Para un posible menú hamburguesa
  userType?: 'estudiante' | 'empresa'; // Para adaptar iconos/rutas
  showBackButton?: boolean; // <-- AÑADIR ESTA LÍNEA
}

const Header: React.FC<HeaderProps> = ({
  title,
  showLogo = true,
  onNotificationsPress,
  onMenuPress,
  userType,
  showBackButton = false
}) => {
  const handleNotificationsPress = () => {
    if (onNotificationsPress) {
      onNotificationsPress();
    } else {
      // Navegación por defecto a la pantalla de notificaciones
      if (userType === 'estudiante') {
        router.push('/postulante/detalle/[id]');
      } else if (userType === 'empresa') {
        router.push('/empresa/detalle/[id]');
      }
    }
  };

  return (
       <View style={styles.headerContainer}>
      {/* Contenedor Izquierdo: Botón de retroceso O Botón de Menú */}
      <View style={styles.leftContainer}>
        {showBackButton ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.neutrals100} />
          </TouchableOpacity>
        ) : onMenuPress ? ( // Only show menu button if no back button and onMenuPress is provided
          <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
            <Ionicons name="menu-outline" size={28} color={Colors.neutrals100} />
          </TouchableOpacity>
        ) : (
          // Esto es para mantener el espacio si no hay botón a la izquierda y el contenido central se va a alinear
          // Puedes ajustarlo, por ejemplo, poner una View con un width fijo.
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Contenido Central: Logo o Título */}
      <View style={styles.centerContainer}>
        {showLogo ? (
          <Image
            style={styles.logo}
            source={{ uri: 'https://c.animaapp.com/mOfRBxl8/img/logo-3.png' }} // Tu logo
          />
        ) : (
          <Text style={styles.headerTitle}>{title}</Text>
        )}
      </View>

      {/* Contenedor Derecho: Iconos */}
      <View style={styles.rightContainer}>
         {onNotificationsPress !== null && ( // Permite que se oculte explícitamente
          <TouchableOpacity onPress={handleNotificationsPress} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.neutrals100} />
            {/* Opcional: Contador de notificaciones */}
            {/* <View style={styles.notificationBadge}><Text style={styles.badgeText}>1</Text></View> */}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Cambio clave aquí para el posicionamiento
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl + 10 : Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.neutrals0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutrals20,
    minHeight: Platform.OS === 'ios' ? 90 : 60,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
    justifyContent: 'flex-start'
  },
  centerContainer: {
    flex: 1,
    // Elimina o comenta estas líneas si estaban aquí, ya que son de texto:
    // alignItems: 'center',
    // justifyContent: 'center',
    // CAMBIO: Asegúrate de que solo propiedades de ViewStyle estén aquí
    marginLeft: Spacing.sm, // Ajusta este valor si necesitas más o menos desplazamiento
    marginRight: Spacing.sm, // Para que el título no se pegue demasiado a la derecha
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: 40,
    justifyContent: 'flex-end',
    marginLeft: Spacing.md,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontFamily: FontFamilies.leagueSpartanSemiBold,
    fontSize: 20,
    color: Colors.neutrals100,
    flexShrink: 1,
    // AHORA ESTA PROPIEDAD DE TEXTO DEBE ESTAR SOLAMENTE AQUÍ:
    textAlign: 'left' // <--- DEBE ESTAR EN headerTitle, NO en centerContainer
  },
  iconButton: {
    padding: Spacing.xs,
  },
  placeholder: {
    width: 40,
  },
});

export default Header;