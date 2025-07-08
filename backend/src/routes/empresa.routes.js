const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresa.controller');

//para poder adquirir todos los datos de las empresas
router.get('/', empresaController.getEmpresas);
// registrar una empresa
router.post('/register', empresaController.insertEmpresa);
//para que la empresa pueda reclutar un estudiante
router.post('/reclutar', empresaController.reclutarEstudiante); 
module.exports = router;