import db from '../config/db.js';

export const getEstudiantes = async (id_empresa) => {
    const sql = `SELECT 
                    u.id AS id_usuario,
                    u.email,
                    u.foto_perfil,
                    u.biografia,
                    u.validado,
                    e.id AS id_estudiante,
                    e.nombre_completo,
                    e.pais,
                    ee.id AS desbloqueado

                FROM usuarios u
                JOIN estudiantes e ON u.id = e.id_usuario
                LEFT JOIN empresa_estudiante ee 
                    ON ee.id_estudiante = e.id
                    AND ee.id_empresa = ?

                WHERE u.tipo = 'estudiante';
                `//i.id AS id_insignia, i.nombre AS nombre_insignia,
                
                // -- 🔗 Relación con usuario_insignia
                // LEFT JOIN usuario_insignia ui ON ui.id_usuario = u.id
                // LEFT JOIN insignias i ON i.id = ui.id_insignia
    try {
        const [rows] = await db.query(sql,id_empresa);
        return rows;
    } catch (error) {
        console.error('Error al obtener los usuarios', error);
        throw error;
    }
};




export const getEmpresas= async () => {
    try {
        const [rows] = await db.query(`SELECT * FROM usuarios WHERE tipo = 'empresa'`);
        return rows;
    } catch (error) {
        console.error('Error al obtener los usuarios', error);
        throw error;
    }
};



export const insertUsuarioEstudiante = async (usuarioData) => {
    const { correo, contrasena, biografia = null, foto_perfil = null, validado } = usuarioData;

    const sql = `
        INSERT INTO usuarios (tipo, correo, contrasena)
        VALUES ('estudiante', ?, ?)
    `;

    try {
        const [result] = await db.query(sql, [correo, contrasena]);
        return result.insertId; // Retorna el ID insertado
    } catch (error) {
        console.error('Error al insertar el usuario:', error);
        throw error;
    }
}; 

//registrar usuaro
export const insertUsuarioEmpresa = async (usuarioData) => {
    const { tipo, correo, contrasena, biografia = null, foto_perfil = null, validado } = usuarioData;

    const sql = `
        INSERT INTO usuarios (tipo, correo, contrasena)
        VALUES ('empresa', ?, ?)
    `;

    try {
        const [result] = await db.query(sql, [correo, contrasena]);
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
    const sql = `SELECT id, tipo, contrasena FROM usuarios WHERE contrasena = ?`;

    try {
        const [rows] = await db.query(sql, [contrasena]);

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

//verifica si exite el correo
export const verificarCorreoEstudiante = async (correo) => {
    const sql = `SELECT id FROM usuarios WHERE correo = ? AND tipo = 'estudiante'`;

    try {
        const [rows] = await db.query(sql, [correo]);
        return rows.length > 0 ? rows[0].id : null;
    } catch (error) {
        console.error('Error verificando el usuario:', error);
        throw error;
    }
};

export const verificarCorreoEmpresa = async (correo) => {
    const sql = `SELECT id FROM usuarios WHERE correo = ? AND tipo = 'empresa'`;

    try {
        const [rows] = await db.query(sql, [correo]);
        return rows.length > 0 ? rows[0].id : null;
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

