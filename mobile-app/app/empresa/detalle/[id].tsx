// mobile-app/app/empresa/detalle/[id].tsx (NUEVO ARCHIVO)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Platform, TextProps } from 'react-native';
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
  fecha_nacimiento?: string;
  cedula?: string;
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
  insignias?: Array<{
    nombre: string;
    descripcion: string;
  }>;
  lenguajes?: String | Array<{
    nombre: string;
    nivel: string;
  }>;
  cv?: string;
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

  // Función para mostrar texto visible
  const TextoVisible: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Text style={styles.sectionContentText}>{children}</Text>
  );
  const lenguajesArray =
    typeof postulante.lenguajes === "string"
    ? postulante.lenguajes.split(",").map((nombre: string) => ({ nombre: nombre.trim() }))
    : Array.isArray(postulante.lenguajes)
    ? postulante.lenguajes
    : [];

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

        {/* Datos VISIBLES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <TextoVisible><Ionicons name="person-outline" size={14} /> Nombre: {postulante.nombre_completo}</TextoVisible>
          <TextoVisible><Ionicons name="calendar-outline" size={14} /> Fecha de nacimiento: {postulante.fecha_nacimiento ? postulante.fecha_nacimiento.split('T')[0] : 'No disponible'}</TextoVisible>
          <TextoVisible><Ionicons name="id-card-outline" size={14} /> Cédula: {postulante.cedula || 'No disponible'}</TextoVisible>
          <TextoVisible><Ionicons name="location-outline" size={14} /> País: {postulante.pais}</TextoVisible>
          {postulante.provincia && (
            <TextoVisible><Ionicons name="map-outline" size={14} /> Provincia: {postulante.provincia}</TextoVisible>
          )}
        </View>

        {/* Datos BLOQUEADOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre Mí</Text>
          <TextoBloqueado>{postulante.sobremi ? 'Información bloqueada' : 'No disponible'}</TextoBloqueado>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <TextoBloqueado><Ionicons name="mail-outline" size={14} /> Email: {postulante.correo ? 'Información bloqueada' : 'No disponible'}</TextoBloqueado>
          <TextoBloqueado><Ionicons name="call-outline" size={14} /> Teléfono: {postulante.telefono ? 'Información bloqueada' : 'No disponible'}</TextoBloqueado>
          <TextoBloqueado><Ionicons name="logo-github" size={14} /> GitHub: {postulante.github ? 'Información bloqueada' : 'No disponible'}</TextoBloqueado>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia</Text>
          {postulante.experiencia && postulante.experiencia.length > 0 ? (
            postulante.experiencia.map((exp, index) => (
              <View key={index} style={styles.detailItem}>
                <TextoBloqueado><Ionicons name="briefcase-outline" size={14} /> {exp.titulo ? 'Información bloqueada' : 'No disponible'}</TextoBloqueado>
                <TextoBloqueado>{exp.empresa_o_institucion ? 'Información bloqueada' : 'No disponible'} - {exp.fecha_inicio.split('T')[0] ? 'Información bloqueada' : 'No disponible'} a {exp.fecha_fin ? 'Información bloqueada' : 'No disponible'}</TextoBloqueado>
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
                <TextoBloqueado><Ionicons name="school-outline" size={14} /> {edu.nombre ? 'Información bloqueada' : 'No disponible'}</TextoBloqueado>
                <TextoBloqueado>{edu.institucion ? 'Información bloqueada' : 'No disponible'} ({edu.fecha_inicio ? 'Información bloqueada' : 'No disponible'} - {edu.fecha_fin ? 'Información bloqueada' : 'No disponible'})</TextoBloqueado>
              </View>
            ))
          ) : (
            <TextoBloqueado>Información bloqueada</TextoBloqueado>
          )}
        </View>

        {/* Insignias - VISIBLES */}
        {postulante.insignias && postulante.insignias.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insignias</Text>
            <View style={styles.skillsContainer}>
              {postulante.insignias.map((insignia, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{insignia.nombre}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Lenguajes - BLOQUEADOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lenguajes</Text>
          <TextoBloqueado>
            {lenguajesArray.length > 0
              ? lenguajesArray.map(lang => lang.nombre ? 'Información bloqueada' : 'No disponible').filter(Boolean).join(', ')
              : "Información bloqueada"}
          </TextoBloqueado>
        </View>

        {/* CV - BLOQUEADO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Curriculum Vitae</Text>
          <TextoBloqueado>CV bloqueado</TextoBloqueado>
        </View>

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
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  skillBadge: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: Spacing.xs / 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 15,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  skillText: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 12,
    color: Colors.primary,
  },
});
