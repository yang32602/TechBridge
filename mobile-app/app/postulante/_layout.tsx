// mobile-app/app/postulante/_layout.tsx
import { Stack } from 'expo-router';

export default function PostulanteLayout() {
  return (
    // Igual que con 'empresa', este asegura que no haya un header por defecto
    // para las pantallas de postulante.
    <Stack screenOptions={{ headerShown: false }}>
      {/* Opcional: Aquí podrías definir pantallas específicas para el grupo de postulante
          o cualquier opción particular para sub-rutas anidadas dentro de postulante.
      */}
    </Stack>
  );
}