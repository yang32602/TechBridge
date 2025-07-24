import * as vacantesModel from '../models/vacantes.model.js';

// Obtener lista de postulantes para una empresa
export const getPostulantesPorEmpresa = async (req, res) => {
  const { id } = req.params; // id empresa
  if (!id) {
    return res.status(400).json({ error: 'Falta el ID de la empresa' });
  }
  try {
    const postulantes = await vacantesModel.obtenerPostulantesPorEmpresa(id);
    return res.status(200).json(postulantes);
  } catch (error) {
    console.error('Error en getPostulantesPorEmpresa:', error);
    return res.status(500).json({ error: 'Error al obtener postulantes' });
  }
};

// Obtener conteo de nuevas postulaciones por periodo (día o semana)
export const getNuevasPostulaciones = async (req, res) => {
  const { id } = req.params; // id empresa
  const { periodo } = req.query; // 'dia' o 'semana'
  if (!id || !periodo) {
    return res.status(400).json({ error: 'Falta ID de empresa o periodo' });
  }
  try {
    const count = await vacantesModel.contarNuevasPostulaciones(id, periodo);
    return res.status(200).json({ count });
  } catch (error) {
    console.error('Error en getNuevasPostulaciones:', error);
    return res.status(500).json({ error: 'Error al obtener nuevas postulaciones' });
  }
};
