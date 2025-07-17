// src/routes/estudiantes.routes.js
import express from 'express';
import * as estudiantesController from '../controllers/estudiantes.controller.js';

const router = express.Router();


// Ruta para obtener todos los estudiantes [GET]
router.post('/', estudiantesController.getEstudiantes);

router.patch('/actualizar', estudiantesController.updateCampoEstudiante);

export default router;
