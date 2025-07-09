// app.js
import express from 'express';
import dotenv from 'dotenv';

//import de las rutas
import usuarioRoutes from './src/routes/usuario.routes.js';
import estudiantesRoutes from './src/routes/estudiantes.routes.js';
import empresaRoutes from './src/routes/empresa.routes.js';
// import paymentRoutes from './src/routes/pago.routes.js'

dotenv.config();

const app = express();

// Middlewares
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
