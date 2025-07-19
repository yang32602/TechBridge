import db from '../config/db.js';

export const getEstudiantes = async (id_usuario) => {
    const sql = 'SELECT * FROM estudiantes WHERE id_usuario = ?';
    try {
        const [rows] = await db.query(sql,[id_usuario]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
        throw error;
    }
};

export const obtenerid_estudiante= async (id_estudiante) => {
    const sql = 'SELECT id FROM estudiantes WHERE id_usuario = ?';
    try {
        const [rows] = await db.query(sql,[id_estudiante]);
        return rows[0].id;
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
        throw error;
    }
};

export const insertEstudiante = async (estudianteData, id_usuario) => {
    const { nombre_completo } = estudianteData;  // <-- aquí el cambio

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
        'nombre_completo',
        'fecha_nacimiento',
        'cedula',
        'sobremi',
        'github',
        'lenguajes',
        'pais',
        'provincia',
        'telefono',
        'email',
        'contratado'
    ];

    if (!camposPermitidos.includes(campo)) {
        throw new Error(`El campo "${campo}" no está permitido para actualizar.`);
    }

    const sql = `UPDATE estudiantes SET ${campo} = ? WHERE id_usuario = ?`;
    const [resultado] = await db.query(sql, [valor, id_usuario]);

    if (resultado.affectedRows === 0) {
        throw new Error(`No se encontró estudiante con id_usuario = ${id_usuario}.`);
    }

    return {
        estado: 1,
        mensaje: `Campo "${campo}" actualizado correctamente.`,
        resultado
    };
};


//experiencias
export const crearExperiencia = async (id_estudiante) => {
    const sql = `INSERT INTO experiencias(id_estudiante) Values (?)`

    try {
        const row = await db.query(sql,[id_estudiante]);
        return row.insertId ;
    } catch (error) {
        console.log('Error al insertar experiencia');
    }
};

export const obtenerExperienciasPorEstudiante = async (id_estudiante) => {
  const [rows] = await db.query('SELECT * FROM experiencias WHERE id_estudiante = ?', [id_estudiante]);
  return rows;
};

export const actualizarCamposExperiencia = async (id_experiencia, campos) => {
    const camposPermitidos = [
        'titulo',
        'empresa_o_institucion',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'ubicacion'
    ];

    const camposActualizables = Object.keys(campos).filter(campo =>
        camposPermitidos.includes(campo)
    );

    if (camposActualizables.length === 0) {
        throw new Error("No se proporcionaron campos válidos para actualizar.");
    }

    const valores = camposActualizables.map(campo => campos[campo]);
    const setClause = camposActualizables.map(campo => `${campo} = ?`).join(', ');

    const sql = `UPDATE experiencias SET ${setClause} WHERE id = ?`;
    valores.push(id_experiencia);

    const [resultado] = await db.query(sql, valores);

    if (resultado.affectedRows === 0) {
        throw new Error(`No se encontró experiencia con id = ${id_experiencia}.`);
    }

    return {
        estado: 1,
        mensaje: "Experiencia actualizada correctamente.",
        resultado
    };
};


//educacion
export const crearEducacion = async (id_estudiante) => {
    const sql = `INSERT INTO educacion(id_estudiante) Values (?)`;

    try {
        const row = await db.query(sql,[id_estudiante]);
        return { id_educacion: row.insertId };
    } catch (error) {
        console.log('Error al insertar experiencia');
    }
};


export const obtenerEducacionesPorEstudiante = async (id_estudiante) => {
  const [rows] = await db.query('SELECT * FROM educacion WHERE id_estudiante = ?', [id_estudiante]);
  return rows;
};

export const actualizarCamposEducacion = async (id_educacion, campos) => {
    const camposPermitidos = [
        'titulo',
        'institucion',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'ubicacion'
    ];

    const camposActualizables = Object.keys(campos).filter(campo =>
        camposPermitidos.includes(campo)
    );

    if (camposActualizables.length === 0) {
        throw new Error("No se proporcionaron campos válidos para actualizar.");
    }

    const valores = camposActualizables.map(campo => campos[campo]);
    const setClause = camposActualizables.map(campo => `${campo} = ?`).join(', ');

    const sql = `UPDATE educaciones SET ${setClause} WHERE id = ?`;
    valores.push(id_educacion);

    const [resultado] = await db.query(sql, valores);

    if (resultado.affectedRows === 0) {
        throw new Error(`No se encontró educación con id = ${id_educacion}.`);
    }

    return {
        estado: 1,
        mensaje: "Educación actualizada correctamente.",
        resultado
    };
};
