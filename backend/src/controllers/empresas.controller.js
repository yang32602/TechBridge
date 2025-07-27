// Importación del modelo de empresa usando ES6
import * as empresaModel from '../models/empresas.model.js';

// Obtener todas las empresas 
export const getEmpresas = async (req, res) => {
    const {id_empresa} = req.body
    try {
        const empresas = await empresaModel.getEmpresaPorID(id_empresa);
        if (empresas) {
            return res.status(200).json({data:empresas});
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

//controller
export const actualizarCampoEmpresa = async (req, res) => {
    try {
        const { id_usuario, campo, valor } = req.body;

        if (!id_usuario || !campo || valor === undefined) {
            return res.status(400).json({ error: 'Faltan datos necesarios: id_usuario, campo o valor' });
        }

        const resultado = await empresaModel.actualizarCampoEmpresa(id_usuario, campo, valor);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'No se encontró la empresa para actualizar o el campo no cambió' });
        }

        res.status(200).json({ mensaje: `Campo "${campo}" actualizado correctamente` });
    } catch (error) {
        res.status(500).json({ error: `Error al actualizar el campo: ${error.message}` });
    }
};
