// mobile-app/app/(tabs)/index.tsx (Nueva pantalla inicial de pestañas)
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router'; // Importar router

export default function TabHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a tu Dashboard!</Text>
      <Text style={styles.subtitle}>Aquí verás tus vacantes o el contenido principal.</Text>
      <Button title="Cerrar Sesión" onPress={() => router.replace('/')} /> {/* Ejemplo: botón de cerrar sesión */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});