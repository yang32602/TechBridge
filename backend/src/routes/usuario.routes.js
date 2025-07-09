// src/routes/usuario.routes.js
import express from 'express';
import * as usuarioController from '../controllers/usuario.controller.js';

const router = express.Router();

// Obtener todos los usuarios estudiantes [GET]
router.get('/estudiantes', usuarioController.obtenerEstudiantes);

// Obtener todos los usuarios [GET]
router.get('/empresas', usuarioController.obtenerEmpresas);

// Obtener insignias de un usuario [GET]
router.get('/:id_usuario/insignias', usuarioController.insigniaUsuario);

// Registrar un nuevo usuario [POSt]
router.post('/register', usuarioController.insertarUsuario);

// Inicio de sesión para postulante [POSt]
router.post('/loginPostulante', usuarioController.autenticacionEstudiante);

// Inicio de sesión para empresa [POSt]
router.post('/loginEmpresa', usuarioController.autenticacionEmpresa);

// Cambio de contraseña [POSt]
router.post('/cambio', usuarioController.cambioContrasenaUsuario);

export default router;
