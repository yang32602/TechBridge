const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { route } = require('./empresa.routes');

// obtener los usuarios
router.get('/', usuarioController.obtenerUsuarios);
//obtiene la insignia de los usuarios
router.get('/:id_usuario/insignias', usuarioController.insigniaUsuario);
//ruta para registrar el nuevo usuario
router.post('/register', usuarioController.insertarUsuario);
//ruta para el inicio de sesion del postulante
router.post('/loginPostulante', usuarioController.autenticacionEstudiante);
//ruta para el inicio de sension de la empresa
router.post('/loginEmpresa', usuarioController.autenticacionEmpresa);
//para cambiar la contrasena
router.post('/cambio', usuarioController.cambioContrasenaUsuario);
module.exports = router;