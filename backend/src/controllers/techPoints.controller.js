import * as techPointsModel from '../models/techPoints.model.js'

export const obtenerTodos = async (req, res) => {
  try {
    const techpoints = await techPointsModel.obtenerTodosLosTechpoints();
    res.json(techpoints);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener techpoints", error: error.message });
  }
};