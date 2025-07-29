import * as insigniaModel from '../models/insignias.model.js';

export const asignarInsignia = async (req, res) => {
    const { id_usuario, id_insignia } = req.body;

    if (!id_usuario || !id_insignia) {
        return res.status(400).json({ estado: 0, mensaje: 'Faltan datos: id_usuario o id_insignia' });
    }

    try {
        const resultado = await insigniaModel.insigniasEstudiante(id_usuario, id_insignia);


        return res.json({ estado: 1, mensaje: 'Insignia asignada correctamente', nombre: resultado});

    } catch (error) {
        console.error('Error en asignarInsignia:', error);
        return res.status(500).json({ estado: 0, mensaje: 'Error interno del servidor'+error });
    }
};
