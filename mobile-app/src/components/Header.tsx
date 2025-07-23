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
      <View style={[
        styles.leftContainer,
        { width: showBackButton ? 40 : Spacing.xs } // Aplica el ancho aquí dinámicamente
      ]}>
        {showBackButton ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.neutrals100} />
          </TouchableOpacity>
        ) : onMenuPress ? (
          <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
            <Ionicons name="menu-outline" size={28} color={Colors.neutrals100} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Contenido Central: Logo o Título */}
      <View style={styles.centerContainer}>
        {showLogo ? (
          <Image
            style={styles.logo} // El estilo `logo` ahora controlará la posición directamente
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
    justifyContent: 'flex-start',
    paddingHorizontal: Spacing.md, // Ya tiene padding aquí
    paddingBottom: Spacing.md,
    backgroundColor: Colors.neutrals0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutrals20,
    minHeight: Platform.OS === 'ios' ? 90 : 60,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  centerContainer: {
    flex: 1,
    // --- CAMBIO CLAVE AQUÍ ---
    // Eliminamos el marginLeft/marginRight de centerContainer para que el logo tenga más libertad.
    // La alineación la manejaremos directamente en el estilo del logo o del título.
    // ANTES: marginLeft: Spacing.sm,
    // ANTES: marginRight: Spacing.sm,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: 40, // Mantenemos un ancho fijo para que los iconos siempre tengan su espacio
    justifyContent: 'flex-end',
    // marginLeft: Spacing.md, // Esto se puede quitar si el gap ya es suficiente y el flex: 1 de centerContainer hace su trabajo
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
    // --- CAMBIO CLAVE AQUÍ ---
    // Añadimos un marginLeft negativo o ajustamos un paddingLeft para acercarlo.
    // Experimenta con estos valores. Spacing.sm es un buen punto de partida.
    marginLeft: -Spacing.sm * 2, // Mueve el logo más a la izquierda, puedes ajustar el multiplicador
    // O podrías usar paddingLeft en centerContainer en lugar de marginLeft negativo aquí,
    // pero para un control más fino del logo, un marginLeft negativo es efectivo.
  },
  headerTitle: {
    fontFamily: FontFamilies.leagueSpartanSemiBold,
    fontSize: 20,
    color: Colors.neutrals100,
    flexShrink: 1,
    textAlign: 'left'
  },
  iconButton: {
    padding: Spacing.xs, // Este padding es el que da espacio alrededor de la campanita
  },
  placeholder: {
    width: Spacing.md, // Ajusta este ancho para controlar el espacio cuando no hay botón izquierdo
  },
});

export default Header;