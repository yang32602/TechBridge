// src/routes/empresa.routes.js
import express from 'express';
import * as empresaController from '../controllers/empresas.controller.js';

const router = express.Router();

// Obtener todas las empresas [GET]
router.post('/', empresaController.getEmpresas);

// Registrar una nueva empresa [POSt]
router.post('/register', empresaController.insertEmpresa);

// Reclutar a un estudiante [POSt]
router.post('/reclutar', empresaController.reclutarEstudiante);

export default router;
