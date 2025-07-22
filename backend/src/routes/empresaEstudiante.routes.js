import express from 'express';

import * as empresaEstudianteController from '../controllers/empresaEstudiante.controller.js'

const router = express.Router();


router.post('/desbloquearEstudiante', empresaEstudianteController.insertEmpresaEstudiante);

export default router;
