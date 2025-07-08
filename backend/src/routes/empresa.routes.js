const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresa.controller');

router.get('/', empresaController.getEmpresas);
router.post('/registrar', empresaController.insertEmpresa);
router.post('/reclutar', empresaController.reclutarEstudiante); 
module.exports = router;