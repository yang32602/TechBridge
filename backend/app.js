const express = require('express');
const app = express();
require('dotenv').config();

// Middlewares
app.use(express.json()); // Para leer JSON del body

// Rutas
const usuarioRoutes = require('./src/routes/usuario.routes');
app.use('/api/usuarios', usuarioRoutes);

// //ruta de los estudiantes
const estudiantesRoutes = require('./src/routes/estudiantes.routes');
app.use('/api/estudiantes', estudiantesRoutes);

//ruta de la empresa
const empresaRoutes = require('./src/routes/empresa.routes');
app.use('/api/empresas', empresaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});