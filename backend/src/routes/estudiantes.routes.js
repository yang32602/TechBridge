// src/routes/estudiantes.routes.js
import express from 'express';
import * as estudiantesController from '../controllers/estudiantes.controller.js';

const router = express.Router();


// Ruta para obtener todos los estudiantes [GET]
router.get('/', estudiantesController.getEstudiantes);

// Registrar un estudiante [POSt]
router.post('/', estudiantesController.insertEstudiante);

export default router;
