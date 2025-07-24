// backend/src/models/vacantes.model.js
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
      e.nombre AS nombre_empresa,
      v.responsabilidades,
      v.requisitos,
      v.beneficios
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
      u.id as id_usuario,
      e.id as id_estudiante,
      e.nombre_completo,
      u.correo,
      e.telefono,
      e.cv,
      p.estado,
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

/**
 * Obtiene los IDs necesarios (ID de estudiante, ID de empresa, FCM token de empresa)
 * para enviar una notificación después de una postulación.
 * @param {number} idVacante - El ID de la vacante a la que se postuló.
 * @param {number} idUsuarioEstudiante - El ID del usuario (estudiante) que se postuló.
 * @returns {Promise<{estudiante_id: number, empresa_id: number, empresa_fcmToken: string} | null>}
 */
export const obtenerNotifiacionDetails = async (id_vacante, id_usuario) => {
    try {
        const sql = `
            SELECT
                e.id AS estudiante_id,            -- ID del estudiante de la tabla 'estudiantes'
                emp.id AS empresa_id,             -- ID de la empresa de la tabla 'empresas'
                emp.fcmToken AS empresa_fcmToken  -- FCM Token de la empresa
            FROM
                postulacion p
            JOIN
                vacantes v ON p.id_vacante = v.id
            JOIN
                empresas emp ON v.id_empresa = emp.id
            JOIN
                usuarios u_estudiante ON p.id_usuario = u_estudiante.id
            JOIN
                estudiantes e ON u_estudiante.id = e.id_usuario
            WHERE
                p.id_vacante = ? AND p.id_usuario = ?;
        `;
        const [rows] = await db.query(sql, [id_vacante, id_usuario]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error al obtener detalles para notificación:', error);
        throw error;
    }
};

export const obtenerEstudianteNombre = async (id_usuario) => {
    try {
        const sql = `
            SELECT nombre_completo
            FROM estudiantes
            WHERE id_usuario = ?;
        `;
        const [rows] = await db.query(sql, [id_usuario]);
        // Retorna el nombre o 'Un estudiante' como valor predeterminado
        return rows.length > 0 ? rows[0].nombre_completo : 'Un estudiante';
    } catch (error) {
        console.error('Error al obtener nombre de estudiante por id_usuario:', error);
        // Si hay un error, también retorna un valor predeterminado para no romper el flujo
        return 'Un estudiante';
    }
};
