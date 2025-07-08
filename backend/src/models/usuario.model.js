const db = require('../config/db');

exports.getUsuarios = async () => {
    try{
    //consulta
    const [rows] = await db.query('SELECT * FROM usuarios');
    //retornamos los usuarios
    return rows;
    } catch (error) {
        console.error('error al obtener los usuarios', error);
        throw error;
    }
}

//esto registra a los usuarios
exports.insertUsuario = async (usuarioData) => {
    //esto es el contenido del Usuario data, lo hacemos asi para facilitar la insercion
    const{ 
        tipo,
        correo,
        contrasena,
        biografia = null, 
        foto_perfil = null, 
        validado
        } = usuarioData;
    //consulta, los valores ? significan que despues se pueden agregar
    const sql = `INSERT INTO usuarios(tipo, correo, contrasena, biografia, foto_perfil, validado)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    try {
        //ejecutamos la consulta
        const [result] = await db.query(sql, [tipo, correo, contrasena, biografia, foto_perfil, validado]);
        //devolvemos el id del estudiante insertado
        return result.insertId; // Retorna el ID 

    }catch (error) {
        console.error('Error al insertar el usuario:', error);
        throw error;
    }
}

exports.getUsuariosInsignia = async (id_estudiante) => {
    //consulta para tener el id del usuario
    const sql = `SELECT i.nombre
                FROM usuarios u 
                JOIN usuario_insignia ui ON ui.id_usuario = u.id
                JOIN insignias i ON ui.id_insignia = i.id
                WHERE u.id = ?;`

    try {
        //la ejecutamos
        const[rows] = await db.query(sql, [id_estudiante]);
        //retornamos lo que nos dio, en este caso las insignias
        return rows;
    }catch(error){
        console.error('Error al obtener las insignias del estudiante:', error);
        throw error;
    }
}

//verifica si la contrasena es correcta
exports.usuarioContrasena = async (correo, contrasena) => {
    //consulta sql
    const sql = `SELECT id, tipo, contrasena FROM usuarios where correo = ?`;//aqui trae la contrasena donde ese correo esta
    try{

        //ejecuta la consulta al usuario
        const [rows] = await db.query(sql, [correo]);

        //verifiamos si existe
        if(rows.length < 1) return false;

        //anadimos al usuario en una variable para un manejo mas faci;
        const usuario = rows[0];

        //compara la contrasena del usuario
        if(usuario.contrasena == contrasena){
            console.log('ingresado');
            //retornamos el id del usuario y el tipo
            return {id: usuario.id, tipo: usuario.tipo }
        }

        return false;

    }catch(error){
        console.log('Fallo en la autenticacion');
        throw error;
    }
}

exports.usuarioVerificarEstudiante = async (correo) => {
    const sql = `SELECT correo FROM usuarios WHERE correo = ? AND tipo = 'estudiante'`;
    
    try {        
        const [rows] = await db.query(sql, [correo]); // directamente el string
        return rows.length >= 1; // true si existe
    } catch(error) {
        console.log('Error verificando el usuario:', error);
        throw error;
    }
}

exports.usuarioVerificarEmpresa = async (correo) => {
    const sql = `SELECT correo FROM usuarios WHERE correo = ? AND tipo = 'empresa'`;
    
    try {        
        const [rows] = await db.query(sql, [correo]); // directamente el string
        return rows.length >= 1; // true si existe
    } catch(error) {
        console.log('Error verificando el usuario:', error);
        throw error;
    }
}

exports.usuarioCambioContrasena = async (nuevaContrasena, correo) =>{
    const sql = `UPDATE usuarios
                 SET contrasena = ? WHERE correo = ?`

    try{
        const [cambio] = await db.query(sql,[nuevaContrasena, correo])
        return cambio.affectedRows > 0; // true si se cambió
    }catch(error){
        console.log('error al cambiar la contrasena');
        throw error;
    }
}