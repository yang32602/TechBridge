// backend/src/routes/usuariosMobile.routes.js
import express from 'express';
import * as usuariosMobileController from '../controllers/usuariosMobile.controller.js';

//Para verificar con un middleware de autenticación (como 'verifyToken')
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de autenticación para la app móvil
router.post('/estudianteLogin', usuariosMobileController.autenticacionEstudianteMobile);
router.post('/empresaLogin', usuariosMobileController.autenticacionEmpresaMobile);

// Ruta para registrar el push token.
router.post('/registerPushToken', verifyToken, usuariosMobileController.registrarPushToken);

export default router;