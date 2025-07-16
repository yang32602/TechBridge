import db from '../config/db.js'

export const asingarPuntos = async (id_empresa, id_techpoints) => {
  const sql = `
    INSERT INTO usuario_techpoint_pago (id_usuario, id_techpoints, fecha_asignacion, tipo_pago)
    VALUES (?, ?, CURDATE(), 'paypal')
  `;

  try {
    const [row] = await db.query(sql, [id_empresa, id_techpoints]);
    return row.insertId;
  } catch (error) {
    console.log(`Error al asignar los puntos: ${error}`);
    throw error;
  }
};



export const cantidadPuntos = async (id_empresa) => {
  const sql = `
              SELECT 
                  utp.id_usuario,
                  SUM(tp.puntos) AS total_puntos
              FROM 
                  usuario_techpoint_pago utp
              JOIN 
                  techpoints tp ON utp.id_techpoints = tp.id
              WHERE 
                  utp.id_usuario = ?
  `;

  try {
    const [row] = await db.query(sql, [id_empresa]);
    return row[0].total_puntos;
  } catch (error) {
    console.log(`Error al asignar los puntos: ${error}`);
    throw error;
  }
};


