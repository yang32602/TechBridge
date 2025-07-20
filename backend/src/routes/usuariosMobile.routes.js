// backend/src/routes/users.js
import express from 'express';
import * as usuariosMobileController from '../controllers/usuariosMobile.controller.js';

// Opcional: Si vas a usar un middleware de autenticación (como 'verifyToken')
import { verifyToken } from '../middleware/authMiddleware.js';

import db from '../config/db.js'; // Tu configuración de base de datos MySQL

const router = express.Router();

// Rutas de autenticación para la app móvil
router.post('/estudianteLogin', usuariosMobileController.autenticacionEstudianteMobile);
router.post('/empresaLogin', usuariosMobileController.autenticacionEmpresaMobile);

// Ruta para registrar el push token.
// Ahora, esta ruta también llama a una función del controlador.
// Si quieres que esta ruta esté protegida, descomenta 'verifyToken'.
router.post('/registerPushToken', verifyToken, usuariosMobileController.registerPushToken);

// Nueva ruta para enviar notificaciones de prueba
router.post('/send-test-notification', usuariosMobileController.sendTestPushNotification); // <-- ¡Añade esta ruta
export default router;