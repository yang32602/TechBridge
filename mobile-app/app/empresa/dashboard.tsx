import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Si usas ThemedText

export default function PostulanteDashboardScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Dashboard Empresa</ThemedText>
      <Text>¡Te damos la bienvenida! Aquí podrás obtener a jovenes talentosos.</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' } });