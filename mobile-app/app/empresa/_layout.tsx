// mobile-app/app/empresa/_layout.tsx
import { Stack } from 'expo-router';

export default function EmpresaLayout() {
  return (
    // Aquí el screenOptions={{ headerShown: false }} es CRUCIAL.
    // Le dice a Expo Router que no muestre el header por defecto para
    <Stack screenOptions={{ headerShown: false }}>
    </Stack>
  );
}