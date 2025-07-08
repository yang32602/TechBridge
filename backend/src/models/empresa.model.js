const db = require('../config/db')

exports.getEmpresas = async () =>{
    const sql = `SELECT * FROM empresas`;
    try{
    const [empresas] = await db.query(sql);
    return(empresas)
    }catch(error){
        console.log('Erro al obtener las empresas');
    }
    throw(error)
}

exports.insertEmpresas = async (empresaData) =>{
    const {nombre,sector,logo_url, descripcion, correo, telefono, id_usuario} = empresaData
    const sql = `INSERT INTO empresas (nombre,sector,logo_url,descripcion,correo,telefono,id_usuario)
                VALUES(?,?,?,?,?,?,?)`;
    try{
        const [insercionEmpresa] = await db.query(sql, [nombre,sector,logo_url, descripcion, correo, telefono, id_usuario]);
        console.log('insertando');
        if(insercionEmpresa) return true;
    }catch(error){
        console.log('Error insertando la empresa');
    throw(error)
    }
}

exports.reclutarEstudiante = async (id_empresa,id_estudiante) =>{
    
    const sql = `INSERT INTO empresa_estudiante(id_empresa, id_estudiante,fecha_reclutamiento) VALUES (?,?, NOW())`;
    try{
    const [reclutacion] = await db.query(sql,[id_empresa, id_estudiante]);
    console.log('insertado')
    return reclutacion.affectedRows > 0;
    }catch(err){
        console.log('Error al reclutar');
        throw(err);
    }
}