import db from '../config/db.js'

//obetenr vacantes
export const obtenerVacantesPorIDEmpesa = async (id_empresa) => {
  try {
    const sql = `
      SELECT 
        v.id AS id_vacante,
        v.titulo,
        v.descripcion,
        v.ubicacion,
        v.fecha_publicacion,
        e.nombre AS nombre_empresa
      FROM vacantes v
      JOIN empresas e ON v.id_empresa = e.id
      WHERE e.id = ?`;

    const [vacantes] = await db.query(sql, [id_empresa]);

    if (vacantes.length === 0) {
      throw new Error('No se encontraron vacantes para este usuario');
    }

    return vacantes;
  } catch (error) {
    console.log(`Error al obtener las vacantes: ${error.message}`);
    return [];
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
                  e.nombre AS nombre_empresa,
                  CASE 
                    WHEN p.id IS NOT NULL THEN TRUE 
                    ELSE FALSE 
                  END AS postulado
                FROM vacantes v
                JOIN empresas e ON v.id_empresa = e.id
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

//mostrar vacante por id
export const vacantePorID = async (id_vacante) => {
  const sql = `
    SELECT 
      v.id, 
      v.titulo, 
      v.descripcion, 
      v.ubicacion, 
      v.fecha_publicacion,
      v.id_empresa,
      e.nombre AS nombre_empresa
    FROM vacantes v
    JOIN empresas e ON v.id_empresa = e.id
    WHERE v.id = ?
  `;
  
  try {
    const [response] = await db.query(sql, [id_vacante]);
    return response[0];
  } catch (error) {
    console.log(`Error al traer la información de la vacante: ${error}`);
  }
};
export const obtenerPostuladosPorVacante = async (idVacante) => {
  const sql = `
SELECT 
      e.id as id_estudiante,
      e.nombre_completo,
      u.correo,
      e.telefono,
      e.cv,
      emp.nombre AS nombre_empresa
    FROM postulacion p
    JOIN estudiantes e ON p.id_usuario = e.id_usuario
    JOIN usuarios u ON e.id_usuario = u.id
    JOIN vacantes v ON p.id_vacante = v.id
    JOIN empresas emp ON v.id_empresa = emp.id
    WHERE p.id_vacante = ?
  `;
  const [rows] = await db.query(sql, [idVacante]);
  return rows;
};

// export const obtenerVacantesPostuladasPorEstudiante = async (id_usuario) => {
//   const sql = `
//     SELECT 
//       v.id AS id_vacante,
//       v.titulo,
//       v.descripcion,
//       v.fecha_publicacion,
//       v.ubicacion,
//       emp.nombre AS nombre_empresa
//     FROM postulacion p
//     JOIN vacantes v ON p.id_vacante = v.id
//     JOIN empresas emp ON v.id_empresa = emp.id
//     WHERE p.id_usuario = ?
//   `;
//   const [rows] = await db.query(sql, [id_usuario]);
//   return rows;
// };


export const obtenerVacantesPostuladasPorEstudiante = async (id_estudiante) => {
  const sql = `
    SELECT 
      v.id AS id_vacante,
      v.titulo,
      v.descripcion,
      v.fecha_publicacion,
      v.ubicacion,
      emp.nombre AS nombre_empresa
    FROM postulacion p
    JOIN vacantes v ON p.id_vacante = v.id
    JOIN empresas emp ON v.id_empresa = emp.id
    JOIN estudiantes e ON p.id_usuario = e.id_usuario
    WHERE e.id = ?
  `;
  const [rows] = await db.query(sql, [id_estudiante]);
  return rows;
};
