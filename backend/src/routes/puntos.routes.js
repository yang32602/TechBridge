import express from 'express';
import * as puntosController from '../controllers/puntos.controller.js';

const router = express.Router();

// Ruta para obtener la cantidad de puntos de un usuario
router.post('/puntosCantidad', puntosController.cantidadPuntos);

// Ruta para gastar puntos de un usuario
router.post('/puntosGastos', puntosController.gastarPuntos);

export default router;
