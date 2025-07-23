import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Header from '../../src/components/Header'; // Asegúrate de la ruta

export default function EmpresaNotificationsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} /> {/* Oculta el Header por defecto de Stack */}
      <Header title="Notificaciones de Empresa" showBackButton={true} userType="empresa" />
      <View style={styles.content}>
        <Text style={styles.text}>Aquí irán las notificaciones de la empresa.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});