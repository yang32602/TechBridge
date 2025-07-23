// mobile-app/app/postulante/dashboard.tsx 
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../src/components/Header'; // Asegúrate de la ruta correcta
import { Colors, FontFamilies, Spacing } from '../../src/constants/theme'; // Asegúrate de la ruta correcta

// --- Componentes Reutilizables (Si no los tienes ya definidos, agrégalos aquí o en un archivo aparte) ---

// Componente para una tarjeta de estadísticas generales (ej. Pruebas Completadas)
const StatItem: React.FC<{ count: number | string; label: string; iconName: keyof typeof Ionicons.glyphMap }> = ({
  count,
  label,
  iconName,
}) => (
  <View style={styles.statItem}>
    <Ionicons name={iconName} size={24} color={Colors.primary} />
    <Text style={styles.statCount}>{count}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Componente para una tarjeta de prueba técnica
const TechnicalTestCard: React.FC<{ title: string; techStack: string; status: 'Disponible' | 'Realizada'; onPress?: () => void }> = ({
  title,
  techStack,
  status,
  onPress,
}) => (
  <TouchableOpacity style={styles.testCard} onPress={onPress}>
    <View>
      <Text style={styles.testTitle}>{title}</Text>
      <Text style={styles.testTechStack}>{techStack}</Text>
    </View>
    <View style={[styles.testStatusBadge, { backgroundColor: status === 'Disponible' ? Colors.success : Colors.primaryLight }]}>
      <Text style={styles.testStatusText}>{status}</Text>
    </View>
  </TouchableOpacity>
);

// Componente para una tarjeta de vacante (en el resumen o aplicadas)
const VacancySummaryCard: React.FC<{
  title: string;
  companyName: string; // Añadido para mostrar la empresa en la vacante aplicada
  modality: string;
  vacancyId: string; // Añadir el ID de la vacante
}> = ({ title, companyName, modality, vacancyId  }) => (
  <TouchableOpacity
      style={styles.vacancySummaryCard}
      onPress={() => {
        // Navegar a la ruta dinámica correcta y pasar el ID de la vacante
        router.push({
          pathname: '/postulante/detalle/[id]', // **AQUÍ VA TU RUTA DINÁMICA REAL**
          params: { id: vacancyId } // Pasa el ID real de la vacante
        });
      }}
  >
    <Text style={styles.vacancySummaryTitle}>{title}</Text>
    <Text style={styles.vacancySummaryCompany}>{companyName}</Text>
    <View style={styles.vacancySummaryTags}>
      <View style={styles.tagStudent}><Text style={styles.tagTextStudent}>{modality}</Text></View>
    </View>
  </TouchableOpacity>
);

// --- Main Dashboard Component ---
export default function PostulanteDashboard() {
  const handleTestOrientation = () => {
    console.log('Iniciar Test de Orientación');
    // router.push('/postulante/test-orientacion');
  };

  return (
    <View style={styles.container}>
      {/* El Header para estudiantes, con el logo y el icono de notificaciones */}
      <Header userType="estudiante" showLogo={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bienvenido, NombreUsuario</Text>
          <Text style={styles.welcomeSubtitle}>
            Se muestra tu progreso y oportunidades disponibles
          </Text>
        </View>

        {/* Botón de Test de Orientación */}
        <TouchableOpacity style={styles.orientationTestButton} onPress={handleTestOrientation}>
          <Ionicons name="search-outline" size={20} color={Colors.neutrals0} />
          <Text style={styles.orientationTestButtonText}>Test de Orientación</Text>
        </TouchableOpacity>

        {/* Estadísticas Generales */}
        <View style={styles.statsGeneralContainer}>
          <StatItem count={0} label="Pruebas Completadas" iconName="checkmark-circle-outline" />
          <StatItem count={0} label="Proyectos Subidos" iconName="code-slash-outline" />
          <StatItem count={0} label="Vacantes Disponibles" iconName="briefcase-outline" />
          <StatItem count="0%" label="Perfil Completado" iconName="person-circle-outline" />
        </View>

        {/* Pruebas Técnicas Disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pruebas Técnicas Disponibles</Text>
          <TechnicalTestCard
            title="Evaluación Frontend avanzado"
            techStack="React, Javascript, CSS"
            status="Disponible"
            onPress={() => console.log('Ir a prueba Frontend')}
          />
          <TechnicalTestCard
            title="Test Python"
            techStack="Python, Django, APIs"
            status="Disponible"
            onPress={() => console.log('Ir a prueba Python')}
          />
          <TechnicalTestCard
            title="Prueba Bases de Datos"
            techStack="SQL, PostgreSQL"
            status="Disponible"
            onPress={() => console.log('Ir a prueba DB')}
          />
        </View>

        {/* Proyectos Subidos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proyectos Subidos</Text>
          <View style={styles.emptyContentContainer}>
            <Ionicons name="sad-outline" size={50} color={Colors.neutrals40} />
            <Text style={styles.emptyContentText}>No se ha subido ningún proyecto</Text>
          </View>
        </View>

        {/* Vacantes Aplicadas (NUEVA SECCIÓN) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vacantes Aplicadas</Text>
            <TouchableOpacity onPress={() => router.push('/postulante/vacantes-aplicadas')}>
              <Text style={styles.viewAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            <VacancySummaryCard
              title="Desarrollador Web"
              companyName="TechSolutions Inc."
              modality="Remoto"
              vacancyId="1" // ID de ejemplo
            />
            <VacancySummaryCard
              title="Senior Full Stack Developer"
              companyName="Global Innovate"
              modality="Híbrido"
              vacancyId="2" // ID de ejemplo
            />
             <VacancySummaryCard
              title="Project Manager"
              companyName="Consulting Group"
              modality="Presencial"
              vacancyId="3" // ID de ejemplo
            />
             <VacancySummaryCard
              title="Senior Desarrollador Backend"
              companyName="Software Factory"
              modality="Remoto"
              vacancyId="4" // ID de ejemplo
            />
          </ScrollView>
        </View>


        {/* Progreso de Habilidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progreso de Habilidades</Text>
          <View style={styles.skillProgressItem}>
            <Text style={styles.skillText}>Desarrollo Frontend</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '80%', backgroundColor: Colors.primary }]} />
            </View>
          </View>
          <View style={styles.skillProgressItem}>
            <Text style={styles.skillText}>Desarrollo Backend</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '60%', backgroundColor: Colors.success }]} />
            </View>
          </View>
          <View style={styles.skillProgressItem}>
            <Text style={styles.skillText}>Gestión de Base de datos</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '70%', backgroundColor: Colors.warning }]} />
            </View>
          </View>
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
    paddingBottom: Spacing.xl * 2,
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
  orientationTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 5,
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  orientationTestButtonText: {
    color: Colors.neutrals0,
    fontFamily: FontFamilies.epilogueBold,
    fontSize: 16,
  },
  statsGeneralContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que los elementos se envuelvan a la siguiente línea
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.md / 2, // Espacio entre ítems
  },
  statItem: {
    backgroundColor: Colors.neutrals0,
    borderWidth: 1,
    borderColor: Colors.neutrals20,
    borderRadius: 8,
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%', // Casi la mitad para que quepan dos por fila
    minHeight: 100, // Altura mínima para que se vean bien
  },
  statCount: {
    fontFamily: FontFamilies.leagueSpartanSemiBold,
    fontSize: 28,
    color: Colors.neutrals100,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 12,
    color: Colors.neutrals80,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
    backgroundColor: Colors.neutrals0,
    borderRadius: 8,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
  testCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.neutrals0,
    borderWidth: 1,
    borderColor: Colors.neutrals20,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  testTitle: {
    fontFamily: FontFamilies.epilogueBold,
    fontSize: 16,
    color: Colors.neutrals100,
  },
  testTechStack: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 12,
    color: Colors.neutrals80,
    marginTop: Spacing.xs,
  },
  testStatusBadge: {
    paddingVertical: Spacing.xs / 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
  },
  testStatusText: {
    fontFamily: FontFamilies.epilogueSemiBold,
    fontSize: 12,
    color: Colors.neutrals0,
  },
  emptyContentContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyContentText: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.neutrals40,
    marginTop: Spacing.sm,
  },
  horizontalList: {
    gap: Spacing.md, // Espacio entre tarjetas
  },
  vacancySummaryCard: {
    backgroundColor: Colors.neutrals0,
    borderWidth: 1,
    borderColor: Colors.neutrals20,
    borderRadius: 8,
    padding: Spacing.md,
    width: 250, // Ancho fijo para las tarjetas en scroll horizontal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vacancySummaryTitle: {
    fontFamily: FontFamilies.epilogueBold,
    fontSize: 16,
    color: Colors.neutrals100,
    marginBottom: Spacing.xs,
  },
  vacancySummaryCompany: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.neutrals80,
    marginBottom: Spacing.sm,
  },
  vacancySummaryTags: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  skillProgressItem: {
    marginBottom: Spacing.sm,
  },
  skillText: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.neutrals100,
    marginBottom: Spacing.xs,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.neutrals20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  // Reutilizamos estilos de tag para VacancySummaryCard
  tagStudent: {
    backgroundColor: Colors.neutrals20,
    paddingVertical: Spacing.xs / 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
  },
  tagTextStudent: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 12,
    color: Colors.neutrals80,
  },
});