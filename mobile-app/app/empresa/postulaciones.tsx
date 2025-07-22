// mobile-app/app/empresa/postulaciones.tsx (NUEVO ARCHIVO)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../src/components/Header';
import { Colors, FontFamilies, Spacing } from '../../src/constants/theme';

// Define una interfaz para los datos de cada postulante
interface PostulanteData {
  id: string; // ID del postulante
  firstName: string;
  lastName: string;
  languages: string[]; // Array de lenguajes (ej: ['JavaScript', 'Python'])
  country: string;
  // Puedes añadir más campos aquí según lo que tu API devuelva
}

// Componente para una fila de postulante en la lista
const PostulanteListItem: React.FC<PostulanteData & { onPress: (id: string) => void }> = ({
  id,
  firstName,
  lastName,
  languages,
  country,
  onPress,
}) => {
  // Generar iniciales para el avatar
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <TouchableOpacity style={styles.postulanteItem} onPress={() => onPress(id)}>
      <View style={styles.avatarContainer}>
        {/* Aquí podrías usar una Image real si tu postulante tiene URL de foto */}
        {/* De lo contrario, este es un buen placeholder de iniciales */}
        <Text style={styles.avatarInitials}>{initials}</Text>
      </View>
      <View style={styles.postulanteInfo}>
        <Text style={styles.postulanteName}>{`${firstName} ${lastName}`}</Text>
        <Text style={styles.postulanteLanguages}>{languages.join(', ')}</Text>
        <View style={styles.postulanteLocation}>
          <Ionicons name="location-outline" size={14} color={Colors.neutrals80} />
          <Text style={styles.postulanteCountry}>{country}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color={Colors.neutrals40} />
    </TouchableOpacity>
  );
};

// --- Main Postulaciones Screen Component ---
export default function PostulacionesScreen() {
  const [postulantes, setPostulantes] = useState<PostulanteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- SIMULACIÓN DE LLAMADA A API PARA OBTENER EL LISTADO DE POSTULANTES ---
        // En una aplicación real:
        // const response = await fetch('TU_API_URL/empresa/postulaciones/listado');
        // const data = await response.json();
        // setPostulantes(data);

        // Datos de ejemplo para simular la respuesta de una API
        const dummyPostulantes: PostulanteData[] = [
          {
            id: 'postu001',
            firstName: 'Ana',
            lastName: 'López',
            languages: ['JavaScript', 'React'],
            country: 'España',
          },
          {
            id: 'postu002',
            firstName: 'Carlos',
            lastName: 'García',
            languages: ['Python', 'Django', 'SQL'],
            country: 'México',
          },
          {
            id: 'postu003',
            firstName: 'María',
            lastName: 'Martínez',
            languages: ['Java', 'Spring Boot'],
            country: 'Colombia',
          },
          {
            id: 'postu004',
            firstName: 'Juan',
            lastName: 'Pérez',
            languages: ['Node.js', 'Express', 'MongoDB'],
            country: 'Argentina',
          },
        ];
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simular retraso
        setPostulantes(dummyPostulantes);
        // --- FIN SIMULACIÓN ---

      } catch (e: any) { // Captura el error para tiparlo como 'any' o 'Error'
        console.error("Error al cargar postulaciones:", e);
        setError(e.message || "No se pudieron cargar las postulaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostulaciones();
  }, []);

  const handlePostulantePress = (postulanteId: string) => {
    console.log(`Navegando al perfil del postulante: ${postulanteId}`);
    router.push({
      pathname: '/empresa/detalle/[id]', // <<-- RUTA ABSOLUTA AL PERFIL DEL POSTULANTE
      params: { id: postulanteId }, // Pasa el ID del postulante
    });
  };

  return (
    <View style={styles.container}>
      <Header userType="empresa" showLogo={false} title="Nuevas Postulaciones" showBackButton={true} /> {/* Añade un título y botón de retroceso */}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Listado de Postulaciones Recientes</Text>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
        ) : error ? (
          <View style={styles.emptyContentContainer}>
            <Ionicons name="alert-circle-outline" size={50} color={Colors.danger} />
            <Text style={styles.emptyContentText}>{error}</Text>
          </View>
        ) : postulantes.length === 0 ? (
          <View style={styles.emptyContentContainer}>
            <Ionicons name="people-outline" size={50} color={Colors.neutrals40} />
            <Text style={styles.emptyContentText}>No hay nuevas postulaciones en este momento.</Text>
          </View>
        ) : (
          <View>
            {postulantes.map((postulante) => (
              <PostulanteListItem
                key={postulante.id}
                {...postulante} // Pasa todas las propiedades del objeto postulante como props
                onPress={handlePostulantePress} // Pasa la función de navegación
              />
            ))}
          </View>
        )}
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
  pageTitle: {
    fontFamily: FontFamilies.leagueSpartanSemiBold,
    fontSize: 22,
    color: Colors.neutrals100,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: Spacing.xl,
  },
  emptyContentContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginTop: Spacing.lg,
  },
  emptyContentText: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 14,
    color: Colors.neutrals40,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  postulanteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutrals0,
    borderWidth: 1,
    borderColor: Colors.neutrals20,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarInitials: {
    fontFamily: FontFamilies.leagueSpartanSemiBold,
    fontSize: 20,
    color: Colors.primary,
  },
  postulanteInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  postulanteName: {
    fontFamily: FontFamilies.epilogueBold,
    fontSize: 16,
    color: Colors.neutrals100,
  },
  postulanteLanguages: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 12,
    color: Colors.neutrals80,
    marginTop: Spacing.xs / 2,
  },
  postulanteLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs / 2,
  },
  postulanteCountry: {
    fontFamily: FontFamilies.epilogueRegular,
    fontSize: 12,
    color: Colors.neutrals80,
  },
  // Reutiliza los estilos de Header si es necesario o crea los tuyos
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
});