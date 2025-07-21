// mobile-app/app/empresa/dashboard.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../src/components/Header'; // Ajusta la ruta
import { Colors, FontFamilies, Spacing } from '../../src/constants/theme'; // Ajusta la ruta

// Componente para las tarjetas de resumen (Vacantes activas, Nuevas postulaciones, Solicitudes enviadas)
const StatCard: React.FC<{ count: number; label: string; color: string; onPress?: () => void }> = ({
  count,
  label,
  color,
  onPress,
}) => (
  <TouchableOpacity style={[styles.statCard, { backgroundColor: color }]} onPress={onPress}>
    <Text style={styles.statCount}>{count}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Ionicons name="chevron-forward-outline" size={24} color={Colors.neutrals0} style={styles.statArrow} />
  </TouchableOpacity>
);

// Componente para una tarjeta de vacante
const VacancyCard: React.FC<{
  title: string;
  status: 'Activo' | 'Cerrada';
  type: string;
  modality: string;
  appliedCount: number;
  totalSpots: number;
  onPress?: () => void;
}> = ({ title, status, type, modality, appliedCount, totalSpots, onPress }) => (
  <TouchableOpacity style={styles.vacancyCard} onPress={onPress}>
    <View style={styles.vacancyHeader}>
      <Text style={styles.vacancyTitle}>{title}</Text>
      <View style={[styles.statusBadge, { backgroundColor: status === 'Activo' ? Colors.success : Colors.danger }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
    <View style={styles.vacancyTags}>
      <View style={styles.tag}><Text style={styles.tagText}>{type}</Text></View>
      <View style={styles.tag}><Text style={styles.tagText}>{modality}</Text></View>
    </View>
    <Text style={styles.vacancyApplied}>{appliedCount} aplicados de {totalSpots} reservados</Text>
  </TouchableOpacity>
);

export default function EmpresaDashboard() {
  const handlePublishVacancy = () => {
    // router.push('/empresa/publicar-vacante'); // Ruta para publicar vacantes
    console.log('Publicar Vacante');
  };

  return (
    <View style={styles.container}>
      <Header userType="empresa" showLogo={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bienvenida, María</Text>
          <Text style={styles.welcomeSubtitle}>
            A continuación se muestran las estadísticas generales de tu empresa.
          </Text>
        </View>

        {/* Sección de Acciones Rápidas */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handlePublishVacancy}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.neutrals0} />
            <Text style={styles.primaryButtonText}>Publicar Vacante</Text>
          </TouchableOpacity>
          {/* Un botón de "Regresar a inicio" podría ser el botón de volver en el header o un tab */}
          {/* <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Regresar a inicio</Text>
          </TouchableOpacity> */}
        </View>

        {/* Tarjetas de Estadísticas */}
        <View style={styles.statsContainer}>
          <StatCard
            count={3}
            label="Vacantes activas"
            color={Colors.primary}
            onPress={() => console.log('Ir a vacantes activas')}
          />
          <StatCard
            count={12}
            label="Nuevas postulaciones"
            color={Colors.success} // Ajustado a un color más adecuado
            onPress={() => console.log('Ir a nuevas postulaciones')}//router.push('/empresa/notificaciones/nueva-postulacion')} // Ejemplo de navegación
          />
          <StatCard
            count={5}
            label="Solicitudes enviadas"
            color={Colors.secondary} // Usamos secondary de tu theme
            onPress={() => console.log('Ir a solicitudes enviadas')}
          />
        </View>

        {/* Gráfico de Postulaciones (Placeholder) */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Postulaciones recibidas</Text>
          <Text style={styles.chartPlaceholder}>[Espacio para Gráfico de Postulaciones]</Text>
          {/* Aquí integrarías tu componente de gráfico real */}
        </View>

        {/* Postulantes Destacados (Placeholder) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Postulantes destacados</Text>
          {/* Puedes listar 1 o 2 en móvil, o enlazar a una página completa */}
          <Text style={styles.placeholderText}>[Lista de Postulantes Destacados]</Text>
        </View>

        {/* Resumen de Vacantes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Resumen de vacantes</Text>
            <TouchableOpacity onPress={() => console.log('Ver todo el resumen')}>
              <Text style={styles.viewAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vacancyList}>
            <VacancyCard
              title="Desarrollador Frontend Junior"
              status="Activo"
              type="Híbrido"
              modality="T. Completo"
              appliedCount={5}
              totalSpots={10}
            />
            <VacancyCard
              title="Desarrollador Node.js"
              status="Cerrada"
              type="Presencial"
              modality="T. Parcial"
              appliedCount={10}
              totalSpots={10}
            />
            <VacancyCard
              title="Desarrollador Android Junior"
              status="Cerrada"
              type="Híbrido"
              modality="T. Parcial"
              appliedCount={10}
              totalSpots={10}
            />
            <VacancyCard
              title="Asistente de BI"
              status="Activo"
              type="Presencial"
              modality="T. Completo"
              appliedCount={5}
              totalSpots={10}
            />
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals0,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2, // Espacio extra para el final del scroll
  },
  welcomeSection: {
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    fontFamily: FontFamilies.leagueSpartanSemiBold,
    fontSize: 24,
    color: Colors.neutrals100,
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.neutrals80,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around', // O 'flex-start' con gap
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 5,
    gap: Spacing.xs,
  },
  primaryButtonText: {
    color: Colors.neutrals0,
    fontFamily: FontFamilies.epilogueBold,
    fontSize: 16,
  },
  secondaryButton: {
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 5,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontFamily: FontFamilies.epilogueBold,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'column', // Cambiado a columna para apilar en móvil
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    padding: Spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCount: {
    fontFamily: FontFamilies.leagueSpartanSemiBold,
    fontSize: 32,
    color: Colors.neutrals0,
  },
  statLabel: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 16,
    color: Colors.neutrals0,
    flex: 1, // Permite que el texto ocupe espacio
    marginLeft: Spacing.md, // Espacio entre número y texto
  },
  statArrow: {
    alignSelf: 'flex-end', // Alinea la flecha a la derecha si hay espacio
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamilies.epilogueSemiBold,
    fontSize: 18,
    color: Colors.neutrals100,
  },
  viewAllText: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.primary,
  },
  chartContainer: {
    backgroundColor: Colors.neutrals20, // Un color de fondo para el placeholder
    height: 200, // Altura fija para el gráfico
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  chartPlaceholder: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 16,
    color: Colors.neutrals80,
  },
  placeholderText: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.neutrals80,
    padding: Spacing.md,
    backgroundColor: Colors.neutrals20,
    borderRadius: 8,
  },
  vacancyList: {
    gap: Spacing.md, // Espacio entre las tarjetas de vacantes
  },
  vacancyCard: {
    backgroundColor: Colors.neutrals0,
    borderWidth: 1,
    borderColor: Colors.neutrals20,
    borderRadius: 8,
    padding: Spacing.md,
    width: 280, // Ancho fijo para las tarjetas en un scroll horizontal
    shadowColor: '#000', // Sombra opcional para un efecto de tarjeta
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vacancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  vacancyTitle: {
    fontFamily: FontFamilies.epilogueBold,
    fontSize: 16,
    color: Colors.neutrals100,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: Spacing.xs / 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: FontFamilies.epilogueSemiBold,
    fontSize: 12,
    color: Colors.neutrals0,
  },
  vacancyTags: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: Spacing.xs / 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
  },
  tagText: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 12,
    color: Colors.primary,
  },
  vacancyApplied: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.neutrals80,
  },
});