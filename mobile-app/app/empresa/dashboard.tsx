// mobile-app/app/empresa/dashboard.tsx
import React, { useState, useCallback } from 'react'; // Importa useCallback
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, BackHandler, Alert } from 'react-native'; // Importa BackHandler y Alert
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para manejar la sesión

import Header from '../../src/components/Header'; // Ajusta la ruta
import { Colors, FontFamilies, Spacing } from '../../src/constants/theme'; // Ajusta la ruta
import { obtenerNuevasPostulaciones } from '../../src/services/api';

// Define una interfaz para los datos de la vacante (para el resumen de vacantes)
interface VacancySummaryData {
  id: string;
  title: string;
  status: 'Activo' | 'Cerrada';
  type: string; // "Híbrido", "Presencial", "Remoto"
  modality: string; // "T. Completo", "T. Parcial", "Por Contrato"
  appliedCount: number;
  totalSpots: number;
}

// Componente para las tarjetas de resumen (Vacantes activas, Nuevas postulaciones, Solicitudes enviadas)
const StatCard: React.FC<{ count: number | string; label: string; color: string; onPress?: () => void }> = ({
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
  vacancyId: string; // Añadido para la navegación al detalle de la vacante de la empresa
  onPress?: (vacancyId: string) => void; // Permite pasar el ID al onPress
}> = ({ title, status, type, modality, appliedCount, totalSpots, vacancyId, onPress }) => (
  <TouchableOpacity style={styles.vacancyCard} onPress={() => onPress && onPress(vacancyId)}>
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
  // Estados para datos dinámicos
  const [activeVacanciesCount, setActiveVacanciesCount] = useState<number | null>(null);
  const [newApplicationsCount, setNewApplicationsCount] = useState<number | null>(null);
  const [sentRequestsCount, setSentRequestsCount] = useState<number | null>(null);
  const [vacanciesSummary, setVacanciesSummary] = useState<VacancySummaryData[]>([]);

  // Estados de carga y error
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [loadingVacancies, setLoadingVacancies] = useState(true);
  const [errorVacancies, setErrorVacancies] = useState<string | null>(null);

  // Función para manejar el cierre de sesión
  const handleLogout = useCallback(async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sí, cerrar sesión",
          onPress: async () => {
            try {
              // Limpiar completamente todos los datos de sesión
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userId');
              await AsyncStorage.removeItem('userType');
              
              console.log('Sesión cerrada correctamente. Datos de AsyncStorage eliminados.');
              
              // Redirigir a la pantalla de login
              router.replace('/');
            } catch (e) {
              console.error("Error al cerrar sesión:", e);
              Alert.alert("Error", "No se pudo cerrar la sesión.");
            }
          },
          style: 'destructive'
        }
      ]
    );
  }, []);

  useFocusEffect( 
    useCallback(() => {
      const backAction = () => {
        Alert.alert(
          "Salir de la aplicación",
          "¿Estás seguro de que quieres cerrar la sesión o salir de la aplicación?",
          [
            {
              text: "Cancelar",
              onPress: () => null,
              style: "cancel"
            },
            {
              text: "Cerrar Sesión",
              onPress: handleLogout,
            },
            {
              text: "Salir",
              onPress: () => BackHandler.exitApp(),
              style: 'destructive'
            }
          ],
          { cancelable: false }
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [handleLogout]) 
  ); 


  // Función para cargar estadísticas reales
  const cargarEstadisticas = async () => {
    try {
      setLoadingStats(true);
      setErrorStats(null);
      
      const idEmpresa = await AsyncStorage.getItem('userId');
      if (!idEmpresa) {
        setErrorStats('ID de empresa no disponible');
        setLoadingStats(false);
        return;
      }

      // Obtener conteo real de nuevas postulaciones (por semana)
      const nuevasPostulacionesData = await obtenerNuevasPostulaciones(idEmpresa, 'semana');
      setNewApplicationsCount(nuevasPostulacionesData.count);
      
      // Mantener datos simulados para las otras estadísticas por ahora
      setActiveVacanciesCount(3);
      setSentRequestsCount(5);
    } catch (e: any) {
      setErrorStats("Error al cargar estadísticas: " + e.message);
    } finally {
      setLoadingStats(false);
    }
  };

  const cargarResumenVacantes = async () => {
    try {
      setLoadingVacancies(true);
      setErrorVacancies(null);
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simular retraso
      const dummyVacancies: VacancySummaryData[] = [
        {
          id: 'vac_fe_jr',
          title: "Desarrollador Frontend Junior",
          status: "Activo",
          type: "Híbrido",
          modality: "T. Completo",
          appliedCount: 5,
          totalSpots: 10,
        },
        {
          id: 'vac_node_sr',
          title: "Desarrollador Node.js",
          status: "Cerrada",
          type: "Presencial",
          modality: "T. Parcial",
          appliedCount: 10,
          totalSpots: 10,
        },
        {
          id: 'vac_android_jr',
          title: "Desarrollador Android Junior",
          status: "Activo",
          type: "Híbrido",
          modality: "T. Parcial",
          appliedCount: 8,
          totalSpots: 10,
        },
        {
          id: 'vac_bi_asst',
          title: "Asistente de BI",
          status: "Activo",
          type: "Presencial",
          modality: "T. Completo",
          appliedCount: 5,
          totalSpots: 10,
        },
      ];
      setVacanciesSummary(dummyVacancies);
    } catch (e: any) {
      setErrorVacancies("Error al cargar resumen de vacantes: " + e.message);
    } finally {
      setLoadingVacancies(false);
    }
  };

  // Actualizar cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      cargarEstadisticas();
      cargarResumenVacantes();
    }, [])
  );

  const manejoPublicarVacante = () => {
    // Aquí implementar la lógica para publicar una nueva vacante;
    console.log('Publicar Vacante');
  };

  const manejoCartasToque = (label: string) => {
    if (label === "Nuevas postulaciones") {
      router.push('/empresa/postulaciones'); 
    } else if (label === "Vacantes activas") {
      // router.push('/empresa/vacantes-activas'); 
    }

  };

  const handleVacancyCardPress = (vacancyId: string) => {
    console.log(`Navegando al detalle de la vacante: ${vacancyId}`);
    // router.push(`/empresa/vacantes/${vacancyId}`); // O una ruta similar
  };

  return (
    <View style={styles.container}>
      <Header
        userType="empresa"
        showLogo={true}
        onNotificationsPress={() => router.push('/empresa/notificaciones')} 
        onLogoutPress={handleLogout} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Te damos la bienvenida</Text>
          <Text style={styles.welcomeSubtitle}>
            A continuación se muestran las estadísticas generales de tu empresa.
          </Text>
        </View>

        {/* Sección de Acciones Rápidas */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={manejoPublicarVacante}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.neutrals0} />
            <Text style={styles.primaryButtonText}>Publicar Vacante</Text>
          </TouchableOpacity>
        </View>

        {/* Tarjetas de Estadísticas */}
        <View style={styles.statsContainer}>
          {loadingStats ? (
            <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
          ) : errorStats ? (
            <Text style={styles.errorText}>{errorStats}</Text>
          ) : (
            <>
              <StatCard
                count={activeVacanciesCount !== null ? activeVacanciesCount : '-'}
                label="Vacantes activas"
                color={Colors.primary}
                onPress={() => manejoCartasToque("Vacantes activas")}
              />
              <StatCard
                count={newApplicationsCount !== null ? newApplicationsCount : '-'}
                label="Nuevas postulaciones"
                color={Colors.success}
                onPress={() => manejoCartasToque("Nuevas postulaciones")}
              />
              <StatCard
                count={sentRequestsCount !== null ? sentRequestsCount : '-'}
                label="Solicitudes enviadas"
                color={Colors.secondary}
                onPress={() => manejoCartasToque("Solicitudes enviadas")}
              />
            </>
          )}
        </View>

        {/* Gráfico de Postulaciones (Placeholder) */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Postulaciones recibidas</Text>
          <Text style={styles.chartPlaceholder}>[Espacio para Gráfico de Postulaciones]</Text>
        </View>

        {/* Postulantes Destacados (Placeholder) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Postulantes destacados</Text>
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
          {loadingVacancies ? (
            <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
          ) : errorVacancies ? (
            <Text style={styles.errorText}>{errorVacancies}</Text>
          ) : vacanciesSummary.length === 0 ? (
            <View style={styles.emptyContentContainer}>
              <Ionicons name="briefcase-outline" size={50} color={Colors.neutrals40} />
              <Text style={styles.emptyContentText}>No hay vacantes para mostrar.</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vacancyList}>
              {vacanciesSummary.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  title={vacancy.title}
                  status={vacancy.status}
                  type={vacancy.type}
                  modality={vacancy.modality}
                  appliedCount={vacancy.appliedCount}
                  totalSpots={vacancy.totalSpots}
                  vacancyId={vacancy.id} 
                  onPress={handleVacancyCardPress} 
                />
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals0,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl + 15 : Spacing.md + 25,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  statsContainer: {
    flexDirection: 'column',
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
    flex: 1,
    marginLeft: Spacing.md,
  },
  statArrow: {
    alignSelf: 'flex-end',
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
    backgroundColor: Colors.neutrals20,
    height: 200,
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
    gap: Spacing.md,
  },
  vacancyCard: {
    backgroundColor: Colors.neutrals0,
    borderWidth: 1,
    borderColor: Colors.neutrals20,
    borderRadius: 8,
    padding: Spacing.md,
    width: 280,
    shadowColor: '#000',
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
  // Nuevos estilos para indicadores de carga y error
  loadingIndicator: {
    paddingVertical: Spacing.xl,
    alignSelf: 'center',
  },
  errorText: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.danger,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
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
    textAlign: 'center',
  },
});