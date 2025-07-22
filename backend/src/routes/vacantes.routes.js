import express from 'express';
import * as vacanteController from '../controllers/vacantes.controller.js';

const router = express.Router();

// Obtener vacantes para un usuario específico 
router.post('/empresas', vacanteController.obtenerVacantesPorUsuario);

//obtener los estudiantes postulados en una vacante
router.post('/estudiantes-postulados', vacanteController.mostrarPostuladosPorVacante);


//obtener vacantes para los usuarios
router.post('/',vacanteController.obtenerVacantesConEstadoDePostulacion)
 
//Obtenr vacante por ID
router.post('/porID', vacanteController.obtenerVacantePorID);

// Postular a una vacante
router.post('/postular', vacanteController.postulacionVacante);

// Crear nueva vacante
router.post('/crearVacante', vacanteController.crearVacante);

// Actualizar vacante 
router.patch('/actualizarVacante', vacanteController.actualizarCampoVacante);

// Ruta para eliminar vacante 
router.delete('/eliminar', vacanteController.eliminarVacanteController);

export default router;
