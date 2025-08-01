// src/routes/usuario.routes.js
import express from 'express';
import * as usuarioController from '../controllers/usuarios.controller.js';

const router = express.Router();

// Obtener todos los usuarios estudiantes [POST]
router.post('/estudiantes', usuarioController.obtenerEstudiantes);

// Obtener todos las empresas [GET]
router.get('/empresas', usuarioController.obtenerEmpresas);

// Obtener insignias de un usuario [GET], tiene que recibir el id del estudiante y le devuelve todas sus insignias
router.get('/:id_usuario/estudianteInsignia', usuarioController.insigniaUsuario);

//registrar un nuevo Estudiante  Recibe correo, contrasena y nombre y los almacena en la db
router.post('/estudianteRegister', usuarioController.insertarUsuarioEstudiante); 

// Registrar un nuevo usuario Empresa[POSt] Recibe correo, contrasena, RUC, nombre y los almacena en la db
router.post('/empresaRegister', usuarioController.insertarUsuarioEmpresa);

// Inicio de sesión para postulante [POSt]
router.post('/estudianteLogin', usuarioController.autenticacionEstudiante);

// Inicio de sesión para empresa [POSt] Recibe correo y contrasena para inicir sesion
router.post('/empresaLogin', usuarioController.autenticacionEmpresa);

// Cambio de contraseña recibe el correo y la contrasena para cambiarla
router.post('/cambio', usuarioController.cambioContrasenaUsuario);

export default router; 
