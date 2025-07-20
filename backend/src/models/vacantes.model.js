import db from '../config/db.js'

//obetenr vacantes
export const obtenerVacantesPorUsuario = async (id_usuario) => {
  try {
    // Obtener id_empresa y nombre de la empresa asociado al id_usuario
    const [empresaRows] = await db.query(
      'SELECT id, nombre FROM empresas WHERE id_usuario = ?',
      [id_usuario]
    );

    if (empresaRows.length === 0) {
      throw new Error('No se encontró empresa para ese usuario');
    }

    const { id: id_empresa, nombre: nombre_empresa } = empresaRows[0];

    // Obtener vacantes de esa empresa
    const [vacantesRows] = await db.query(
      `SELECT id, titulo, descripcion, ubicacion, fecha_publicacion 
       FROM vacantes WHERE id_empresa = ?`,
      [id_empresa]
    );

    return { nombre_empresa, vacantes: vacantesRows };
  } catch (error) {
    console.error('Error al obtener vacantes por usuario:', error);
    throw error;
  }
};

export const postulacionVacante = async (id_usuario, id_vacante) => {
  const sql = `INSERT INTO postulacion (id_usuario, id_vacante, fecha_postulacion)
               VALUES (?, ?, CURDATE())`;
  try {
    const [response] = await db.query(sql, [id_usuario, id_vacante]);
    return response.insertId;
  } catch (error) {
    console.log(`Error al insertar el estudiante en la vacante:\n${error}`);
    throw error;
  }
};

//crear la vacante
export const insertVacante = async (vacanteData, id_empresa) => {
    const { titulo, descripcion, ubicacion } = vacanteData;

    const sql = `
        INSERT INTO vacantes (id_empresa, titulo, descripcion, ubicacion, fecha_publicacion)
        VALUES (?, ?, ?, ?, CURDATE())
    `;

    try {
        const [result] = await db.query(sql, [id_empresa, titulo, descripcion, ubicacion]);
        console.log('Vacante insertada');
        return result.insertId;
    } catch (error) {
        console.error('Error insertando la vacante:', error);
        throw error;
    }
};

//actualiza los campos de vacantes
export const actualizarCampoVacante = async (id_vacante, campo, valor) => {
  const camposPermitidos = [
    "titulo",
    "descripcion",
    "ubicacion",
    "fecha_publicacion",
    "salario",
    "modalidad",
    "requisitos"
  ];

  if (!camposPermitidos.includes(campo)) {
    throw new Error(`El campo "${campo}" no está permitido para actualizar.`);
  }

  const sql = `UPDATE vacantes SET ${campo} = ? WHERE id = ?`;
  const [resultado] = await db.query(sql, [valor, id_vacante]);

  if (resultado.affectedRows === 0) {
    throw new Error(
      `No se encontró vacante con id_vacante = ${id_vacante}.`
    );
  }

  return {
    estado: 1,
    mensaje: `Campo "${campo}" actualizado correctamente.`,
    resultado,
  };
};


export const obtenerVacantesConPostulacion = async (idUsuario) => {
    const sql = `
                SELECT 
                v.*, 
                CASE 
                    WHEN p.id IS NOT NULL THEN TRUE 
                    ELSE FALSE 
                END AS postulado
                FROM vacantes v
                LEFT JOIN postulacion p ON v.id = p.id_vacante AND p.id_usuario = ?
                `
  const [rows] = await db.query(sql,[idUsuario]);
  return rows;
};


//eliminar vacantes 
export const eliminarVacante = async (id_vacante) => {
  const sql = `DELETE FROM vacantes WHERE id = ?`;

  try {
    const [resultado] = await db.query(sql, [id_vacante]);

    if (resultado.affectedRows === 0) {
      throw new Error(`No se encontró vacante con id = ${id_vacante}`);
    }

    return {
      estado: 1,
      mensaje: "Vacante eliminada correctamente junto con sus postulaciones"
    };
  } catch (error) {
    console.error('Error eliminando vacante:', error);
    throw error;
  }
}; 

