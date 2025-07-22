// mobile-app/app/empresa/notificaciones.tsx (y similar para postulante/notificaciones.tsx)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Para acceder a los parámetros de la notificación

export default function EmpresaNotificacionesScreen() {
  const params = useLocalSearchParams(); // Esto contendrá los 'data' del payload de la notificación

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones de postulante</Text>
      {/* Puedes mostrar los parámetros recibidos */}
      <Text>ID del item: {params.itemId || 'N/A'}</Text>
      <Text>Tipo: {params.type || 'N/A'}</Text>
      {/* Añade más UI para mostrar las notificaciones */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});