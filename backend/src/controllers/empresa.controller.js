// Importación del modelo de empresa usando ES6
import * as empresaModel from '../models/empresa.model.js';

// Obtener todas las empresas
export const getEmpresas = async (req, res) => {
    try {
        const empresas = await empresaModel.getEmpresas();
        if (empresas) {
            return res.status(200).json(empresas);
        } else {
            return res.status(404).json({ mensaje: 'No se encontraron empresas' });
        }
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al traer las empresas' });
    }
};

// Insertar una nueva empresa
export const insertEmpresa = async (req, res) => {
    try {
        const nuevaEmpresa = await empresaModel.insertEmpresas(req.body);
        res.status(200).json(nuevaEmpresa);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al insertar la empresa' });
    }
};

// Reclutar a un estudiante
export const reclutarEstudiante = async (req, res) => {
    try {
        const { id_empresa, id_estudiante } = req.body;

        if (!id_empresa || !id_estudiante) {
            return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        }

        const reclutamiento = await empresaModel.reclutarEstudiante(id_empresa, id_estudiante);

        if (reclutamiento) {
            return res.status(200).json({ mensaje: 'Reclutamiento exitoso' });
        } else {
            return res.status(400).json({ mensaje: 'No se pudo reclutar al estudiante' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Hubo un error al reclutar' });
    }
};
