// mobile-app/app/empresa/detalle/[id].tsx (NUEVO ARCHIVO)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Importar useLocalSearchParams
import { Ionicons } from '@expo/vector-icons';

import Header from '../../../src/components/Header'; // Ajusta la ruta si es necesario
import { Colors, FontFamilies, Spacing } from '../../../src/constants/theme';

interface PostulanteProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  bio: string;
  experience: { title: string; company: string; years: number }[];
  education: { degree: string; institution: string; year: number }[];
  skills: string[];
  languages: string[];
  portfolioUrl?: string; // Opcional
  linkedinUrl?: string; // Opcional
  // Puedes añadir más campos que un perfil completo tendría
}

export default function PostulanteDetailScreen() {
  const { id } = useLocalSearchParams(); // Obtiene el ID del postulante de la URL
  const [postulante, setPostulante] = useState<PostulanteProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID de postulante no proporcionado.");
      return;
    }

    const fetchPostulanteDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- SIMULACIÓN DE LLAMADA A API PARA OBTENER DETALLES DEL POSTULANTE ---
        // En una aplicación real:
        // const response = await fetch(`TU_API_URL/postulantes/${id}`);
        // const data = await response.json();
        // setPostulante(data);

        // Datos de ejemplo para simular la respuesta de una API
        // Adaptar estos datos para que coincidan con la interfaz PostulanteProfileData
        const dummyPostulanteData: PostulanteProfileData = {
          id: id as string, // Aseguramos que 'id' es string
          firstName: 'Ana',
          lastName: 'López',
          email: 'ana.lopez@example.com',
          phone: '+507 6123-4567',
          country: 'Panamá',
          city: 'Ciudad de Panamá',
          bio: 'Desarrolladora frontend apasionada por crear experiencias de usuario intuitivas y responsivas. Experiencia en React y JavaScript moderno.',
          experience: [
            { title: 'Desarrolladora Frontend', company: 'Innovate Solutions', years: 3 },
            { title: 'Diseñadora Web Junior', company: 'Creative Studio', years: 1 },
          ],
          education: [
            { degree: 'Ingeniería de Software', institution: 'Universidad Tecnológica de Panamá', year: 2020 },
          ],
          skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Figma', 'Git', 'Redux', 'APIs REST'],
          languages: ['Español (nativo)', 'Inglés (avanzado)'],
          portfolioUrl: 'https://ana.dev',
          linkedinUrl: 'https://linkedin.com/in/analopez',
        };

        await new Promise(resolve => setTimeout(resolve, 1000));
        setPostulante(dummyPostulanteData);
        // --- FIN SIMULACIÓN ---

      } catch (e: any) {
        console.error(`Error al cargar detalles del postulante ${id}:`, e);
        setError(e.message || "No se pudieron cargar los detalles del postulante.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostulanteDetails();
  }, [id]); // Vuelve a cargar si el ID cambia

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
        <Text style={styles.errorText}>{error || "Perfil no encontrado."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header userType="empresa" showLogo={false} title="Perfil del Postulante" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          {/* Avatar con iniciales o Image si hay URL de perfil */}
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>{`${postulante.firstName.charAt(0)}${postulante.lastName.charAt(0)}`.toUpperCase()}</Text>
          </View>
          <Text style={styles.profileName}>{`${postulante.firstName} ${postulante.lastName}`}</Text>
          <View style={styles.profileLocation}>
            <Ionicons name="location-outline" size={16} color={Colors.neutrals80} />
            <Text style={styles.profileLocationText}>{`${postulante.city}, ${postulante.country}`}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre Mí</Text>
          <Text style={styles.sectionContentText}>{postulante.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <Text style={styles.sectionContentText}>Email: {postulante.email}</Text>
          <Text style={styles.sectionContentText}>Teléfono: {postulante.phone}</Text>
          {postulante.linkedinUrl && (
            <Text style={[styles.sectionContentText, styles.linkText]} onPress={() => console.log('Abrir LinkedIn')}>
              LinkedIn: {postulante.linkedinUrl}
            </Text>
          )}
          {postulante.portfolioUrl && (
            <Text style={[styles.sectionContentText, styles.linkText]} onPress={() => console.log('Abrir Portafolio')}>
              Portafolio: {postulante.portfolioUrl}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia</Text>
          {postulante.experience.length > 0 ? (
            postulante.experience.map((exp, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailItemTitle}>{exp.title}</Text>
                <Text style={styles.detailItemSubtitle}>{exp.company} - {exp.years} años</Text>
              </View>
            ))
          ) : (
            <Text style={styles.sectionContentText}>Sin experiencia registrada.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educación</Text>
          {postulante.education.length > 0 ? (
            postulante.education.map((edu, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailItemTitle}>{edu.degree}</Text>
                <Text style={styles.detailItemSubtitle}>{edu.institution} ({edu.year})</Text>
              </View>
            ))
          ) : (
            <Text style={styles.sectionContentText}>Sin educación registrada.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <View style={styles.skillsContainer}>
            {postulante.skills.length > 0 ? (
              postulante.skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.sectionContentText}>Sin habilidades registradas.</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Idiomas</Text>
          <View style={styles.skillsContainer}>
            {postulante.languages.length > 0 ? (
              postulante.languages.map((lang, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{lang}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.sectionContentText}>Sin idiomas registrados.</Text>
            )}
          </View>
        </View>

        {/* Aquí puedes añadir más secciones como proyectos, certificaciones, etc. */}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals0,
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
  detailItemTitle: {
    fontFamily: FontFamilies.epilogueBold,
    fontSize: 16,
    color: Colors.neutrals100,
  },
  detailItemSubtitle: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.neutrals80,
    marginTop: Spacing.xs / 2,
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
  },
  skillText: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 12,
    color: Colors.primary,
  },
});