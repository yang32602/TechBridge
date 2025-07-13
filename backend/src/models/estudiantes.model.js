import db from '../config/db.js';

export const getEstudiantes = async () => {
    const sql = 'SELECT * FROM estudiantes';
    try {
        const [rows] = await db.query(sql);
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
