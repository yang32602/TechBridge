// mobile-app/app/empresa/postulaciones.tsx 

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../../src/components/Header';
import { Colors, FontFamilies, Spacing } from '../../src/constants/theme';
import { obtenerPostulantesPorEmpresa } from '../../src/services/api';
import { useFocusEffect } from '@react-navigation/native';

// Define una interfaz para los datos de cada postulante
interface PostulanteData {
  id_usuario: string; 
  id_estudiante: string; 
  nombre_completo: string;
  pais: string;
  provincia?: string;
  foto_perfil?: string;
}

// Componente para una fila de postulante en la lista
const PostulanteListItem: React.FC<PostulanteData & { onPress: (id: string) => void }> = ({
  id_usuario,
  nombre_completo,
  pais,
  provincia,
  foto_perfil,
  onPress,
}) => {
  // Generar iniciales para el avatar si no hay foto
  const initials = nombre_completo
    ? nombre_completo
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '';

  return (
    <TouchableOpacity style={styles.postulanteItem} onPress={() => onPress(id_usuario)}>
      <View style={styles.avatarContainer}>
        {foto_perfil ? (
          <Image source={{ uri: foto_perfil }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarInitials}>{initials}</Text>
        )}
      </View>
      <View style={styles.postulanteInfo}>
        <Text style={styles.postulanteName}>{nombre_completo}</Text>
        <View style={styles.postulanteLocation}>
          <Ionicons name="location-outline" size={14} color={Colors.neutrals80} />
          <Text style={styles.postulanteCountry}>{provincia ? provincia + ', ' : ''}{pais}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color={Colors.neutrals40} />
    </TouchableOpacity>
  );
};

// --- Main Postulaciones Screen Component ---
export default function PantallaPostulaciones() {
  const [postulantes, setPostulantes] = useState<PostulanteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
  const fetchPostulaciones = async () => {
    try {
      setLoading(true);
      setError(null);

      const idEmpresa = await AsyncStorage.getItem('userId');
      if (!idEmpresa) {
        setError('ID de empresa no disponible');
        setLoading(false);
        return;
      }

      const data = await obtenerPostulantesPorEmpresa(idEmpresa);

      // Mapear para usar id_estudiante en lugar de id_usuario para detalle
      const mappedData = data.map((postulante: any) => ({
        ...postulante,
        id: postulante.id_estudiante, // Usar id_estudiante para detalle
      }));

      setPostulantes(mappedData);
    } catch (e: any) {
      console.error('Error al cargar postulaciones:', e);
      setError(e.message || 'No se pudieron cargar las postulaciones.');
    } finally {
      setLoading(false);
    }
  };

      fetchPostulaciones();
    }, [])
  );

  const eventoClickPostulante = (postulanteId: string) => {
    console.log(`Navegando al perfil del postulante: ${postulanteId}`);
    // Como el id en detalle es id_estudiante, no id_usuario, pasamos id_estudiante
    const postulanteSeleccionado = postulantes.find(p => p.id_usuario === postulanteId);
    if (postulanteSeleccionado && postulanteSeleccionado.id_estudiante) {
      router.push({
        pathname: '/empresa/detalle/[id]',
        params: { id: postulanteSeleccionado.id_estudiante.toString() },
      });
    } else {
      console.error('No se encontró el id_estudiante para el postulante seleccionado');
    }
  };

  return (
    <View style={styles.container}>
      <Header userType="empresa" showLogo={false} title="Nuevas Postulaciones" showBackButton={true} />

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
                key={postulante.id_usuario}
                {...postulante} // Pasa todas las propiedades del objeto postulante como props
                onPress={eventoClickPostulante} // Pasa la función de navegación
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
    paddingTop: Platform.OS === 'ios' ? Spacing.xl + 15 : Spacing.md + 20,
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
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
});
