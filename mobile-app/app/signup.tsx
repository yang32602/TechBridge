// mobile-app/app/signup.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router'; // Necesitas importar router aquí también

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Registro</Text>
      <Text>Aquí irá tu formulario para crear una nueva cuenta.</Text>
      {/* Un botón para volver a la pantalla de login (que ahora es (tabs)/index) */}
      <Button title="Volver al Inicio de Sesión" onPress={() => router.replace('/')} />
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
    marginBottom: 20,
  },
});