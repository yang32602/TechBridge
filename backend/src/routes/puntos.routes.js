import express from 'express';
import * as puntosController from '../controllers/puntos.controller.js';

const router = express.Router();

router.post('/puntosCantidad', puntosController.cantidadPuntos);

export default router;