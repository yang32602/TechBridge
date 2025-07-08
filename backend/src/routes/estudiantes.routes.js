const express = require('express');
const router = express.Router();
const estudiantesController = require('../controllers/estudiantes.controller');
console.log('✅ Archivo estudiantes.routes.js cargado');

// Ruta para obtener todos los estudiantes
router.get('/', estudiantesController.getEstudiantes);
//inserta el estudiante
router.post('/', estudiantesController.insertEstudiante)

module.exports = router;