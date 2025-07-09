import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usuarioRoutes from './src/routes/usuario.routes.js';
import estudiantesRoutes from './src/routes/estudiantes.routes.js';
import empresaRoutes from './src/routes/empresa.routes.js';
//import paymentRoutes from './src/routes/pago.routes.js'

dotenv.config();

const app = express();

//permite peticiones desde otro origen
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

// Middleware
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/empresas', empresaRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
