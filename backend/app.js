import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usuarioRoutes from './src/routes/usuarios.routes.js';
import estudiantesRoutes from './src/routes/estudiantes.routes.js';
import empresaRoutes from './src/routes/empresas.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import empresaEstudiante from './src/routes/empresaEstudiante.router.js';
import puntos from './src/routes/puntos.routes.js';

import usuariosMobile from './src/routes/usuariosMobile.routes.js';

dotenv.config();
 
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
app.use('/api/empresa-Estudiante', empresaEstudiante);
app.use('/api/puntos', puntos);

app.use('/api/usuariosMobile', usuariosMobile);


// Servidor
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}); 
