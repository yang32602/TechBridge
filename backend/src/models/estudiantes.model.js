const db = require('../config/db');

exports.getEstudiantes = async () =>{
    const sql = 'SELECT * FROM estudiantes';
    try{
    const [rows] = await db.query(sql);
    return rows;
    }catch(error){
        console.error('Error al obtener los estudiantes:', error);
        throw error;
    }
}

exports.insertEstudiante = async (estudianteData) => {
    const {nombre,apellido,fecha_nacimiento,cedula,id_usuario } = estudianteData;

    //sql pa insertar
    const sql = `INSERT INTO estudiantes(nombre,apellido,fecha_nacimiento,cedula,id_usuario)    
                 VALUES (?, ?, ?, ?, ?)`;
    try{
        const [result] = await db.query(sql, [nombre,apellido,fecha_nacimiento,cedula,id_usuario]);
        if(result) return true; // Retorna true si se logra
    }catch(error){
        console.error('Error al agregar el estudiante:', error);
        throw error;
    }
}
