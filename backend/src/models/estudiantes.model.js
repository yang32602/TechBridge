import db from "../config/db.js";

export const getEstudiantes = async (id_usuario) => {
  const sql = `
    SELECT 
      e.*, 
      u.correo 
    FROM 
      estudiantes e
    JOIN 
      usuarios u ON e.id_usuario = u.id
    WHERE 
      e.id_usuario = ?
  `;
  try {
    const [rows] = await db.query(sql, [id_usuario]);
    return rows;
  } catch (error) {
    console.error("Error al obtener los estudiantes:", error);
    throw error;
  }
};


export const obtenerid_estudiante= async (id_usuario) => {
    const sql = 'SELECT id FROM estudiantes WHERE id_usuario = ?';
    try {
        const [rows] = await db.query(sql,[id_usuario]);
        return rows[0].id;
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
        throw error;
    }
};

export const insertEstudiante = async (estudianteData, id_usuario) => {
  const { nombre_completo } = estudianteData; // <-- aquí el cambio

  const sql = `
        INSERT INTO estudiantes (nombre_completo, id_usuario)
        VALUES (?, ?)
    `;

    try {
        const [result] = await db.query(sql, [nombre_completo, id_usuario]);
        return result.insertId;
    } catch (error) {
        console.error('Error al agregar el estudiante:', error);
        throw error;
    }
};
 


export const actualizarCampoEstudiante = async (id_usuario, campo, valor) => {
  const camposPermitidos = [
    "nombre_completo",
    "fecha_nacimiento",
    "cedula",
    "sobremi",
    "github",
    "lenguajes",
    "pais",
    "provincia",
    "telefono",
    "email",
    "contratado",
    "cv"
  ];

  if (!camposPermitidos.includes(campo)) {
    throw new Error(`El campo "${campo}" no está permitido para actualizar.`);
  }

  const sql = `UPDATE estudiantes SET ${campo} = ? WHERE id_usuario = ?`;
  const [resultado] = await db.query(sql, [valor, id_usuario]);

  if (resultado.affectedRows === 0) {
    throw new Error(
      `No se encontró estudiante con id_usuario = ${id_usuario}.`,
    );
  }

  return {
    estado: 1,
    mensaje: `Campo "${campo}" actualizado correctamente.`,
    resultado,
  };
};

//experiencias
export const crearExperiencia = async (id_estudiante) => {
  const sql = `INSERT INTO experiencias(id_estudiante) Values (?)`;

  try {
    const row = await db.query(sql, [id_estudiante]);
    return row.insertId;
  } catch (error) {
    console.log("Error al insertar experiencia");
  }
};

export const obtenerExperienciasPorEstudiante = async (id_estudiante) => {
  const [rows] = await db.query(
    "SELECT * FROM experiencias WHERE id_estudiante = ?",
    [id_estudiante],
  );
  return rows;
};

export const actualizarCampoExperiencia = async (campo, valor, campos) => {
  const camposPermitidos = [
    "tipo",
    "titulo",
    "empresa_o_institucion",
    "descripcion",
    "fecha_inicio",
    "fecha_fin",
    "ubicacion",
  ];

  if (!camposPermitidos.includes(campo)) {
    throw new Error(`El campo "${campo}" no está permitido para actualizar.`);
  }

  const { id_experiencia } = campos;
  if (!id_experiencia) {
    throw new Error("El campo 'id_experiencia' es obligatorio.");
  }

  const sql = `UPDATE experiencias SET ${campo} = ? WHERE id = ?`;
  const [resultado] = await db.query(sql, [valor, id_experiencia]);

  if (resultado.affectedRows === 0) {
    throw new Error(`No se encontró experiencia con id = ${id_experiencia}.`);
  }

  return {
    estado: 1,
    mensaje: `Campo "${campo}" actualizado correctamente.`,
    resultado,
  };
};

//educacion
export const crearEducacion = async (id_estudiante) => {
  const sql = `INSERT INTO educacion(id_estudiante) Values (?)`;

  try {
    const row = await db.query(sql, [id_estudiante]);
    return { id_educacion: row.insertId };
  } catch (error) {
    console.log("Error al insertar experiencia");
  }
};

export const obtenerEducacionesPorEstudiante = async (id_estudiante) => {
  const [rows] = await db.query(
    "SELECT * FROM educacion WHERE id_estudiante = ?",
    [id_estudiante],
  );
  return rows;
};

export const actualizarCampoEducacion = async (campo, valor, campos) => {
  const camposPermitidos = [
    "nombre",
    "pais",
    "institucion",
    "descripcion",
    "fecha_inicio",
    "fecha_fin",
    "ubicacion",
  ];

  if (!camposPermitidos.includes(campo)) {
    throw new Error(`El campo "${campo}" no está permitido para actualizar.`);
  }

  const { id_educacion } = campos;
  if (!id_educacion) {
    throw new Error("El campo 'id_educacion' es obligatorio.");
  }

  const sql = `UPDATE educacion SET ${campo} = ? WHERE id = ?`;
  const [resultado] = await db.query(sql, [valor, id_educacion]);

  if (resultado.affectedRows === 0) {
    throw new Error(`No se encontró educación con id = ${id_educacion}.`);
  }

  return {
    estado: 1,
    mensaje: `Campo "${campo}" actualizado correctamente.`,
    resultado,
  };
};
// Eliminar experiencia por id
export const eliminarExperiencia = async (id_experiencia) => {
  const sql = `DELETE FROM experiencias WHERE id = ?`;
  const [resultado] = await db.query(sql, [id_experiencia]);

  if (resultado.affectedRows === 0) {
    throw new Error(`No se encontró experiencia con id = ${id_experiencia}`);
  }

  return {
    estado: 1,
    mensaje: "Experiencia eliminada correctamente",
  };
};

// Eliminar educación por id
export const eliminarEducacion = async (id_educacion) => {
  const sql = `DELETE FROM educacion WHERE id = ?`;
  const [resultado] = await db.query(sql, [id_educacion]);

  if (resultado.affectedRows === 0) {
    throw new Error(`No se encontró educación con id = ${id_educacion}`);
  }

  return {
    estado: 1,
    mensaje: "Educación eliminada correctamente",
  };
};
