// mobile-app/app/empresa/detalle/[id].tsx (NUEVO ARCHIVO)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../../src/components/Header';
import { Colors, FontFamilies, Spacing } from '../../../src/constants/theme';
import { getDetalleEstudiante } from '../../../src/services/api';

interface PostulanteProfileData {
  id: string;
  nombre_completo: string;
  correo?: string;
  telefono?: string;
  pais: string;
  provincia?: string;
  sobremi?: string;
  experiencia?: Array<{
    titulo: string;
    empresa_o_institucion: string;
    fecha_inicio: string;
    fecha_fin?: string;
  }>;
  educacion?: Array<{
    nombre: string;
    institucion: string;
    fecha_inicio: string;
    fecha_fin?: string;
  }>;
  github?: string;
}

export default function PostulanteDetailScreen() {
  const { id } = useLocalSearchParams();
  const [postulante, setPostulante] = useState<PostulanteProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('ID de postulante no proporcionado.');
      return;
    }

    const fetchPostulanteDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const idString = Array.isArray(id) ? id[0] : id;
        const data = await getDetalleEstudiante(idString);
        setPostulante(data);
      } catch (e: any) {
        console.error(`Error al cargar detalles del postulante ${id}:`, e);
        setError(e.message || 'No se pudieron cargar los detalles del postulante.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostulanteDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (error || !postulante) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Ionicons name="alert-circle-outline" size={60} color={Colors.danger} />
        <Text style={styles.errorText}>{error || 'Perfil no encontrado.'}</Text>
      </View>
    );
  }

  // Función para mostrar texto bloqueado con efecto borroso
  const TextoBloqueado: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Text style={[styles.sectionContentText, styles.textoBloqueado]}>{children}</Text>
  );

  return (
    <View style={styles.container}>
      <Header userType="empresa" showLogo={false} title="Perfil del Postulante" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>
              {postulante.nombre_completo
                ? postulante.nombre_completo
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                : ''}
            </Text>
          </View>
          <Text style={styles.profileName}>{postulante.nombre_completo}</Text>
          <View style={styles.profileLocation}>
            <Ionicons name="location-outline" size={16} color={Colors.neutrals80} />
            <Text style={styles.profileLocationText}>
              {postulante.provincia ? postulante.provincia + ', ' : ''}{postulante.pais}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre Mí</Text>
          <TextoBloqueado>{postulante.sobremi || 'Información bloqueada'}</TextoBloqueado>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <TextoBloqueado>Email: {postulante.correo || 'Información bloqueada'}</TextoBloqueado>
          <TextoBloqueado>Teléfono: {postulante.telefono || 'Información bloqueada'}</TextoBloqueado>
          {postulante.github && (
            <TextoBloqueado>GitHub: {postulante.github}</TextoBloqueado>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia</Text>
          {postulante.experiencia && postulante.experiencia.length > 0 ? (
            postulante.experiencia.map((exp, index) => (
              <View key={index} style={styles.detailItem}>
                <TextoBloqueado>{exp.titulo}</TextoBloqueado>
                <TextoBloqueado>{exp.empresa_o_institucion} - {exp.fecha_inicio} a {exp.fecha_fin || 'Presente'}</TextoBloqueado>
              </View>
            ))
          ) : (
            <TextoBloqueado>Información bloqueada</TextoBloqueado>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educación</Text>
          {postulante.educacion && postulante.educacion.length > 0 ? (
            postulante.educacion.map((edu, index) => (
              <View key={index} style={styles.detailItem}>
                <TextoBloqueado>{edu.nombre}</TextoBloqueado>
                <TextoBloqueado>{edu.institucion} ({edu.fecha_inicio} - {edu.fecha_fin || 'Presente'})</TextoBloqueado>
              </View>
            ))
          ) : (
            <TextoBloqueado>Información bloqueada</TextoBloqueado>
          )}
        </View>

        {/* Aquí puedes añadir más secciones como habilidades, idiomas, etc. visibles o bloqueadas según necesidad */}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals0,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl + 15 : Spacing.md + 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 16,
    color: Colors.neutrals80,
  },
  errorText: {
    marginTop: Spacing.md,
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 16,
    color: Colors.danger,
    textAlign: 'center',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.neutrals20,
    borderRadius: 8,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  profileInitials: {
    fontFamily: FontFamilies.leagueSpartanSemiBold,
    fontSize: 40,
    color: Colors.primary,
  },
  profileName: {
    fontFamily: FontFamilies.leagueSpartanSemiBold,
    fontSize: 28,
    color: Colors.neutrals100,
    marginBottom: Spacing.xs,
  },
  profileLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  profileLocationText: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.neutrals80,
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
  sectionTitle: {
    fontFamily: FontFamilies.epilogueSemiBold,
    fontSize: 18,
    color: Colors.neutrals100,
    marginBottom: Spacing.md,
  },
  sectionContentText: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.neutrals80,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  detailItem: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutrals20,
  },
  textoBloqueado: {
    color: Colors.neutrals40,
    fontStyle: 'italic',
  },
});
