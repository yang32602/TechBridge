// src/routes/empresa.routes.js
import express from 'express';
import * as empresaController from '../controllers/empresas.controller.js';
import * as empresaPostulacionesController from '../controllers/empresaPostulaciones.controller.js';

const router = express.Router();

// Obtener todas las empresas [GET]
router.post('/', empresaController.getEmpresas);

// Registrar una nueva empresa [POST]
router.post('/register', empresaController.insertEmpresa);

router.patch('/actualizar', empresaController.actualizarCampoEmpresa);

// Reclutar a un estudiante [POST]
router.post('/reclutar', empresaController.reclutarEstudiante);

// Nuevas rutas para postulantes y nuevas postulaciones
router.get('/:id/postulantes', empresaPostulacionesController.getPostulantesPorEmpresa);

router.get('/:id/nuevas-postulaciones', empresaPostulacionesController.getNuevasPostulaciones);

export default router;
