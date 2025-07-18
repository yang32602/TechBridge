// mobile-app/app/empresa/_layout.tsx (y similar para postulante/_layout.tsx)
import { Stack } from 'expo-router';

export default function EmpresaLayout() {
  return (
    <Stack>
      {/* Aquí podrías definir pantallas específicas para el grupo de empresa */}
      {/* <Stack.Screen name="dashboard" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="notificaciones" options={{ title: 'Notificaciones Empresa' }} /> */}
      {/* Si ya los declaras en el _layout raíz, no hace falta aquí, a menos que quieras una sub-navegación específica */}
    </Stack>
  );
}