// mobile-app/src/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para iconos
import { router } from 'expo-router'; // Para navegación
import { Colors, FontFamilies, Spacing } from '../constants/theme'; // Asegúrate de la ruta correcta

interface HeaderProps {
  title?: string; // Título opcional, si no hay logo
  showLogo?: boolean;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void; // Para un posible menú hamburguesa
  userType?: 'estudiante' | 'empresa'; // Para adaptar iconos/rutas
}

const Header: React.FC<HeaderProps> = ({
  title,
  showLogo = true,
  onNotificationsPress,
  onMenuPress,
  userType,
}) => {
  const handleNotificationsPress = () => {
    if (onNotificationsPress) {
      onNotificationsPress();
    } else {
      // Navegación por defecto a la pantalla de notificaciones
      if (userType === 'estudiante') {
        router.push('/postulante/notificaciones');
      } else if (userType === 'empresa') {
        router.push('/empresa/notificaciones');
      }
    }
  };

  return (
    <View style={styles.headerContainer}>
      {onMenuPress && (
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Ionicons name="menu-outline" size={28} color={Colors.neutrals100} />
        </TouchableOpacity>
      )}

      {showLogo ? (
        <Image
          style={styles.logo}
          source={{ uri: 'https://c.animaapp.com/mOfRBxl8/img/logo-3.png' }} // Tu logo
        />
      ) : (
        <Text style={styles.headerTitle}>{title}</Text>
      )}

      <View style={styles.rightIcons}>
        {/* Aquí puedes añadir el botón de "Publicar Vacante" o "Regresar a inicio"
            siempre visible, o moverlos a otro lugar para móvil.
            Por ahora, solo el icono de notificaciones. */}
        {onNotificationsPress !== null && ( // Permitir que se oculte explícitamente
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.neutrals0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutrals20,
  },
  logo: {
    width: 120, // Ajustado para móvil
    height: 40, // Ajustado para móvil
    resizeMode: 'contain',
  },
  headerTitle: {
    fontFamily: FontFamilies.leagueSpartanSemiBold,
    fontSize: 20,
    color: Colors.neutrals100,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  notificationBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.neutrals0,
    fontSize: 12,
    fontFamily: FontFamilies.epilogueBold,
  },
});

export default Header;