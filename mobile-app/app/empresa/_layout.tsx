// mobile-app/app/empresa/_layout.tsx
import { Stack } from 'expo-router';

export default function EmpresaLayout() {
  return (
    // Aquí el screenOptions={{ headerShown: false }} es CRUCIAL.
    // Le dice a Expo Router que no muestre el header por defecto para
    // NINGUNA de las pantallas dentro de la carpeta 'empresa'.
    // Esto te libera para poner tu componente <Header /> en cada pantalla individual.
    <Stack screenOptions={{ headerShown: false }}>
      {/* Opcional: Si quisieras anidar más stacks o definir opciones específicas
          para pantallas individuales DENTRO de la sección 'empresa', lo harías aquí.
          Por ejemplo, si 'empresa/perfil.tsx' tuviera un header por defecto diferente:
          <Stack.Screen name="perfil" options={{ title: "Mi Perfil de Empresa" }} />
      */}
      {/* No necesitas listar explícitamente dashboard, notificaciones, detalle/[id], etc. aquí
          porque Expo Router ya los encontrará automáticamente por su nombre de archivo
          y les aplicará el headerShown: false de este layout.
      */}
    </Stack>
  );
}