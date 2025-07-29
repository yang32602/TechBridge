import * as puntosModel from '../models/puntos.model.js';

export const cantidadPuntos = async (req, res) => {
  const { id_empresa } = req.body;
  try {
    if (!id_empresa) {
      return res.status(400).json({ mensaje: "id_empresa vacío" });
    }
    const cantPuntos = await puntosModel.puntosRestantes(id_empresa);
    // Siempre responde, incluso si es 0
    return res.status(200).json({ cantidad: cantPuntos || 0 });
  } catch (error) {
    console.error('Error en cantidadPuntos:', error);
    return res.status(500).json({ error: 'Error al obtener la cantidad de puntos' });
  }
};

export const gastarPuntos = async (req, res) => {
  const { id_empresa, puntos, descripcion } = req.body;

  if (!id_empresa || !puntos || puntos <= 0) {
    return res.status(400).json({ estado: 0, mensaje: 'Datos inválidos para gastar puntos' });
  }

  try {
    // 1. Verificar puntos disponibles
    const puntosDisponibles = await puntosModel.puntosRestantes(id_empresa);

    if (puntos > puntosDisponibles) {
      return res.status(400).json({ estado: 0, mensaje: 'No tienes suficientes puntos' });
    }

    // 2. Obtener id_usuario desde la empresa
    const [empresaRows] = await db.query(`SELECT id_usuario FROM empresas WHERE id = ?`, [id_empresa]);
    if (empresaRows.length === 0) {
      return res.status(400).json({ estado: 0, mensaje: 'Empresa no encontrada' });
    }

    const id_usuario = empresaRows[0].id_usuario;

    // 3. Registrar el gasto correctamente
    await puntosModel.registrarGasto(id_usuario, puntos, descripcion);

    return res.status(200).json({ estado: 1, mensaje: 'Puntos gastados correctamente' });
  } catch (error) {
    console.error('Error en gastarPuntos:', error);
    return res.status(500).json({ error: 'Error al gastar puntos' });
  }
};

