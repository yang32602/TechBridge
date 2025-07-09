// Importación del modelo de estudiantes usando ES6
import * as estudiantesModel from '../models/estudiantes.model.js';

// Obtener todos los estudiantes
export const getEstudiantes = async (req, res) => {
    try {
        const estudiantes = await estudiantesModel.getEstudiantes();
        res.status(200).json(estudiantes);
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
