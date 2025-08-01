// backend/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import usuarioRoutes from './src/routes/usuarios.routes.js';
import estudiantesRoutes from './src/routes/estudiantes.routes.js';
import empresaRoutes from './src/routes/empresas.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import empresaEstudianteRoutes from './src/routes/empresaEstudiante.routes.js';
import puntosRoutes from './src/routes/puntos.routes.js';
import vacantesRoutes from './src/routes/vacantes.routes.js';
import techpointsRoutes from './src/routes/techPoints.routes.js';
import insigniasRoutes from './src/routes/insignias.routes.js';

//parte mobile
import usuariosMobile from './src/routes/usuariosMobile.routes.js';
import admin from 'firebase-admin'; 

const serviceAccountPath = path.join(__dirname, 'src', 'config', 'firebase-service-account.json');

let serviceAccount;
try {
    // Lee el contenido del archivo JSON de forma síncrona
    const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
    // Parsea el contenido a un objeto JavaScript
    serviceAccount = JSON.parse(fileContent);
    console.log('Archivo de cuenta de servicio de Firebase cargado exitosamente.');
} catch (error) {
    console.error('ERROR: No se pudo cargar el archivo de cuenta de servicio de Firebase:', error);
    process.exit(1); // Sale de la aplicación si no puede cargar la clave
}

dotenv.config();

console.log('--- app.js: Antes de inicializar Firebase ---');
console.log('admin.apps.length antes:', admin.apps.length); // Debería ser 0
 
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK inicializado exitosamente en app.js.');
} else {
    console.log('Firebase Admin SDK ya estaba inicializado (desde app.js).');
}
console.log('admin.apps.length DESPUÉS:', admin.apps.length); // Debería ser 1
console.log('admin.app() después de inicializar:', admin.app() ? 'Inicializado' : 'NO INICIALIZADO');
console.log('--- app.js: Fin diagnóstico ---');

const app = express(); 

const FEPORT = process.env.FEPORT || 5173

//permite peticiones desde otro origen
app.use(cors({
  origin: 'http://localhost:' + FEPORT,
  credentials: true
}));

// Middleware
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/usuariosMobile', usuariosMobile);
app.use('/api/empresa-estudiante', empresaEstudianteRoutes);
app.use('/api/puntos', puntosRoutes);
app.use('/api/vacantes', vacantesRoutes);
app.use('/api/techpoint', techpointsRoutes);
app.use('/api/insignias', insigniasRoutes);
// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
