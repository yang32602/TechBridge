import db from '../config/db.js';

export const getUsuarios = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios');
        return rows;
    } catch (error) {
        console.error('Error al obtener los usuarios', error);
        throw error;
    }
};

//registrar usuaroi
export const insertUsuario = async (usuarioData) => {
    const { tipo, correo, contrasena, biografia = null, foto_perfil = null, validado } = usuarioData;

    const sql = `
        INSERT INTO usuarios (tipo, correo, contrasena, biografia, foto_perfil, validado)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await db.query(sql, [tipo, correo, contrasena, biografia, foto_perfil, validado]);
        return result.insertId; // Retorna el ID insertado
    } catch (error) {
        console.error('Error al insertar el usuario:', error);
        throw error;
    }
};

export const getUsuariosInsignia = async (id_estudiante) => {
    const sql = `
        SELECT i.nombre
        FROM usuarios u
        JOIN usuario_insignia ui ON ui.id_usuario = u.id
        JOIN insignias i ON ui.id_insignia = i.id
        WHERE u.id = ?
    `;

    try {
        const [rows] = await db.query(sql, [id_estudiante]);
        return rows;
    } catch (error) {
        console.error('Error al obtener las insignias del estudiante:', error);
        throw error;
    }
};

export const usuarioContrasena = async (correo, contrasena) => {
    const sql = `SELECT id, tipo, contrasena FROM usuarios WHERE correo = ?`;

    try {
        const [rows] = await db.query(sql, [correo]);

        if (rows.length < 1) return false;

        const usuario = rows[0];

        if (usuario.contrasena === contrasena) {
            console.log('Ingreso exitoso');
            return { id: usuario.id, tipo: usuario.tipo };
        }

        return false;
    } catch (error) {
        console.error('Fallo en la autenticación', error);
        throw error;
    }
};

export const usuarioVerificarEstudiante = async (correo) => {
    const sql = `SELECT correo FROM usuarios WHERE correo = ? AND tipo = 'estudiante'`;

    try {
        const [rows] = await db.query(sql, [correo]);
        return rows.length >= 1;
    } catch (error) {
        console.error('Error verificando el usuario:', error);
        throw error;
    }
};

export const usuarioVerificarEmpresa = async (correo) => {
    const sql = `SELECT correo FROM usuarios WHERE correo = ? AND tipo = 'empresa'`;

    try {
        const [rows] = await db.query(sql, [correo]);
        return rows.length >= 1;
    } catch (error) {
        console.error('Error verificando el usuario:', error);
        throw error;
    }
};

export const usuarioCambioContrasena = async (nuevaContrasena, correo) => {
    const sql = `UPDATE usuarios SET contrasena = ? WHERE correo = ?`;

    try {
        const [cambio] = await db.query(sql, [nuevaContrasena, correo]);
        return cambio.affectedRows > 0;
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        throw error;
    }
};

