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

export const insertEstudiante = async (estudianteData,id_usuario) => {
    const { nombre} = estudianteData;
    const sql = `
        INSERT INTO estudiantes (nombre_completo, id_usuario)
        VALUES (?, ?)
    `;
    try {
        const [result] = await db.query(sql, [nombre, id_usuario]);
        return result.insertId;
    } catch (error) {
        console.error('Error al agregar el estudiante:', error);
        throw error;
    }
};


export const actualizarCampoEstudiante = async (id, campo, valor) => {
    const camposPermitidos = [
        'nombre_completo',
        'fecha_nacimiento',
        'cedula',
        'sobremi',
        'github',
        'lenguajes',
        'pais',
        'contratado'
    ];

    if (!camposPermitidos.includes(campo)) {
        throw new Error(`El campo "${campo}" no está permitido para actualizar.`);
    }

    const sql = `UPDATE estudiantes SET ${campo} = ? WHERE id = ?`;
    const [resultado] = await db.query(sql, [valor, id]);
    return resultado;
};

