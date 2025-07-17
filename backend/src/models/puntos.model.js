import db from '../config/db.js';

export const asingarPuntos = async (id_usuario, id_techpoints) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insertar el registro en el historial de asignaciones
    const insertPagoSQL = `
      INSERT INTO usuario_techpoint_pago (id_usuario, id_techpoints, fecha_asignacion, tipo_pago)
      VALUES (?, ?, CURDATE(), 'paypal')
    `;
    await connection.query(insertPagoSQL, [id_usuario, id_techpoints]);

    // 2. Obtener la cantidad de puntos que corresponden a ese techpoint
    const puntosSQL = `SELECT puntos FROM techpoints WHERE id = ?`;
    const [rows] = await connection.query(puntosSQL, [id_techpoints]);
    if (rows.length === 0) throw new Error('Techpoint no encontrado');
    const puntosASumar = rows[0].puntos;

    // 3. Actualizar o insertar en wallet el saldo actual
    const walletSQL = `SELECT puntos_actuales FROM wallet WHERE id_usuario = ?`;
    const [walletRows] = await connection.query(walletSQL, [id_usuario]);

    if (walletRows.length > 0) {
      // Ya tiene wallet, actualiza puntos
      const updateWalletSQL = `
        UPDATE wallet SET puntos_actuales = puntos_actuales + ? WHERE id_usuario = ?
      `;
      await connection.query(updateWalletSQL, [puntosASumar, id_usuario]);
    } else {
      // No tiene wallet, insertar nuevo
      const insertWalletSQL = `
        INSERT INTO wallet (id_usuario, puntos_actuales) VALUES (?, ?)
      `;
      await connection.query(insertWalletSQL, [id_usuario, puntosASumar]);
    }

    await connection.commit();
    return { mensaje: `Puntos asignados: ${puntosASumar}` };

  } catch (error) {
    await connection.rollback();
    console.error('Error al asignar puntos:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export const registrarGasto = async (id_usuario, puntos_utilizados, descripcion) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Verificar saldo actual en wallet
    const walletSQL = `SELECT puntos_actuales FROM wallet WHERE id_usuario = ? FOR UPDATE`;
    const [walletRows] = await connection.query(walletSQL, [id_usuario]);

    if (walletRows.length === 0 || walletRows[0].puntos_actuales < puntos_utilizados) {
      throw new Error('Saldo insuficiente');
    }

    // 2. Restar puntos del wallet
    const updateWalletSQL = `
      UPDATE wallet SET puntos_actuales = puntos_actuales - ? WHERE id_usuario = ?
    `;
    await connection.query(updateWalletSQL, [puntos_utilizados, id_usuario]);

    // 3. Registrar gasto en historial
    const insertGastoSQL = `
      INSERT INTO usuario_techpoint_gasto (id_usuario, puntos_utilizados, fecha_uso)
      VALUES (?, ?, CURDATE())
    `;
    await connection.query(insertGastoSQL, [id_usuario, puntos_utilizados]);

    await connection.commit();
    return { mensaje: `Se han gastado ${puntos_utilizados} puntos` };

  } catch (error) {
    await connection.rollback();
    console.error('Error al gastar puntos:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export const puntosRestantes = async (id_usuario) => {
  const sql = `
    SELECT puntos_actuales FROM wallet WHERE id_usuario = ?
  `;

  try {
    const [rows] = await db.query(sql, [id_usuario]);
    if (rows.length === 0) return 0;
    return rows[0].puntos_actuales;
  } catch (error) {
    console.error('Error al obtener puntos restantes:', error);
    throw error;
  }
};
