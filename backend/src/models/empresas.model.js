import db from '../config/db.js';

export const getEmpresa = async (id_usuario) => {
    const sql = `SELECT * FROM empresas WHERE id_usuario = ?`;
    try {
        const [empresas] = await db.query(sql, [id_usuario]);
        return empresas;
    } catch (error) {
        console.error('Error al obtener las empresas');
        throw error;
    }
};



//sirve para insertar empresa
export const insertEmpresas = async (empresaData, id_usuario) => {
    const { nombre, ruc} = empresaData;
    const sql = `
        INSERT INTO empresas (nombre, ruc,id_usuario)
        VALUES (?, ?, ?)
    `;
    try {
        const [result] = await db.query(sql, [nombre,ruc,id_usuario]);
        console.log('Empresa insertada');
        return result.insertId;
    } catch (error) {
        console.error('Error insertando la empresa');
        throw error;
    }
};

//para reclutar estudiante
export const reclutarEstudiante = async (id_empresa, id_estudiante) => {
    const sql = `
        INSERT INTO empresa_estudiante (id_empresa, id_estudiante, fecha_reclutamiento)
        VALUES (?, ?, NOW())
    `;
    try {
        const [resultado] = await db.query(sql, [id_empresa, id_estudiante]);
        console.log('Estudiante reclutado');
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Error al reclutar');
        throw error;
    }
};
