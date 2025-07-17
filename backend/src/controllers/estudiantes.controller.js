// Importación del modelo de estudiantes usando ES6
import * as estudiantesModel from '../models/estudiantes.model.js';

// Obtener todos los estudiantes
export const getEstudiantes = async (req, res) => {
    const{id_usuario} = req.body;
    try {
        const estudiantes = await estudiantesModel.getEstudiantes(id_usuario);
        res.status(200).json({data:estudiantes});
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
};

// Insertar un nuevo estudiante
export const insertEstudiante = async (req, res) => {
    try {
        const nuevoEstudiante = await estudiantesModel.insertEstudiante(req.body);
        res.status(200).json(nuevoEstudiante);
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar al estudiante' });
    }
};

// Actualizar un campo del estudiante
export const updateCampoEstudiante = async (req, res) => {
    const { id_usuario, campo, valor } = req.body;

    if (!id_usuario || !campo) {
        return res.status(400).json({ error: 'ID y campo son requeridos' });
    }

    try {
        const resultado = await estudiantesModel.actualizarCampoEstudiante(id_usuario, campo, valor);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado o sin cambios' });
        }

        res.status(200).json({ mensaje: `Campo "${campo}" actualizado con éxito.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

