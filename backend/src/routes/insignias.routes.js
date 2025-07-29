import express from 'express';
import * as insigniaController from '../controllers/insignias.controller.js';

const router = express.Router();

// Obtener vacantes para un usuario específico 
// router.get('/', insigniaController.);

router.post('/insignias-estudiante', insigniaController.asignarInsignia);

export default router;