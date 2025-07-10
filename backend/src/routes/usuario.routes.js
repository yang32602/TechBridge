// src/routes/usuario.routes.js
import express from 'express';
import * as usuarioController from '../controllers/usuario.controller.js';

const router = express.Router();

// Obtener todos los usuarios estudiantes [GET]
router.get('/estudiantes', usuarioController.obtenerEstudiantes);

// Obtener todos los usuarios [GET]
router.get('/empresas', usuarioController.obtenerEmpresas);

// Obtener insignias de un usuario [GET], tiene que recibir el id del estudiante y le devuelve todas sus insignias
router.get('/:id_usuario/insignias', usuarioController.insigniaUsuario);

//registrar un nuevo Estudiante  Recibe correo, contrasena y nombre y los almacena en la db
router.post('/registerPostulante', usuarioController.insertarUsuarioEstudiante);

// Registrar un nuevo usuario Empresa[POSt] Recibe correo, contrasena y nombre y los almacena en la db
router.post('/registerEmpresa', usuarioController.insertarUsuarioEmpresa);

// Inicio de sesión para postulante [POSt]
router.post('/loginPostulante', usuarioController.autenticacionEstudiante);

// Inicio de sesión para empresa [POSt] Recibe correo y contrasena para inicir sesion
router.post('/loginEmpresa', usuarioController.autenticacionEmpresa);

// Cambio de contraseña recibe el correo y la contrasena para cambiarla
router.post('/cambio', usuarioController.cambioContrasenaUsuario);

export default router;
