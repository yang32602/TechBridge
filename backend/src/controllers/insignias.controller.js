import * as insigniaModel from '../models/insignias.model.js';

export const asignarInsignia = async (req, res) => {
    const { id_usuario, id_insignia } = req.body;

    if (!id_usuario || !id_insignia) {
        return res.status(400).json({ estado: 0, mensaje: 'Faltan datos: id_usuario o id_insignia' });
    }

    try {
        const resultado = await insigniaModel.insigniasEstudiante(id_usuario, id_insignia);

        if (resultado === true || (resultado?.asignado === true)) {
            return res.json({ estado: 1, mensaje: 'Insignia asignada correctamente' });
        } else if (resultado?.motivo) {
            return res.json({ estado: 0, mensaje: resultado.motivo });
        } else {
            return res.json({ estado: 0, mensaje: 'No se pudo asignar la insignia' });
        }
    } catch (error) {
        console.error('Error en asignarInsignia:', error);
        return res.status(500).json({ estado: 0, mensaje: 'Error interno del servidor' });
    }
};
