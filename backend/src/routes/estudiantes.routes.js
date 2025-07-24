// src/routes/estudiantes.routes.js
import express from 'express';
import * as estudiantesController from '../controllers/estudiantes.controller.js';

const router = express.Router();

// Obtener estudiantes por id_usuario (pasado en query o body, según preferencia)
// Normalmente GET con query param
router.post('/', estudiantesController.getEstudiantes);

// Actualizar campo específico de estudiante (patch con body: id_usuario, campo, valor)
router.patch('/actualizar', estudiantesController.updateCampoEstudiante);

// --- Rutas para EXPERIENCIAS ---

// Crear nueva experiencia (POST, body con id_estudiante)
router.post('/experiencias', estudiantesController.crearExperiencia);

// Obtener experiencias de un estudiante (GET, id_estudiante como param)
router.get('/experiencias/:id_estudiante', estudiantesController.obtenerExperienciasPorEstudiante);

// Actualizar experiencia (PATCH, idExperiencia como param, body con campos a actualizar)
router.patch('/experiencias', estudiantesController.actualizarCampoExperiencia);

// --- Rutas para EDUCACION ---

// Crear nueva educación (POST, body con id_estudiante)
router.post('/educacion', estudiantesController.crearEducacion);

// Obtener educaciones de un estudiante (GET, id_estudiante como param)
router.get('/educacion/:id_estudiante', estudiantesController.obtenerEducacionesPorEstudiante);

// Actualizar educación (PATCH, idEducacion como param, body con campos a actualizar)
router.patch('/educacion', estudiantesController.actualizarCampoEducacion);

// Rutas para eliminar
router.delete('/experiencia', estudiantesController.eliminarExperienciaController);

router.delete('/educacion', estudiantesController.eliminarEducacionController);

// Nuevo endpoint para detalle completo del estudiante
router.get('/detalle/:id', estudiantesController.getDetalleEstudiante);

export default router;
