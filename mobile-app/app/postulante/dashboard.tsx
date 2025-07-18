import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Si usas ThemedText

export default function PostulanteDashboardScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Dashboard Postulante</ThemedText>
      <Text>¡Bienvenido, postulante! Aquí verás tus oportunidades.</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' } });