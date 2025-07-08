const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id_usuario/insignias', usuarioController.insigniaUsuario);
//ruta para insertar el nuevo usuario
router.post('/', usuarioController.insertarUsuario);
//ruta para el inicio de sesion
router.post('/login', usuarioController.autenticacionUsuario);
router.post('/cambio', usuarioController.cambioContrasenaUsuario);
module.exports = router;