import db from '../config/db.js'

export const insertEmpresaEstudiante = async (id_empresa, id_estudiante) =>{
    const sql = `INSERT INTO empresa_estudiante (id_empresa, id_estudiante, fecha_reclutamiento, estado)
        VALUES	(?,?,CURDATE(), 'desbloqueado');`

    try {
        
        const [row] = await db.query(sql,[id_empresa,id_estudiante])
        return {
            insertId: row.insertId,
            id_empresa,
            id_estudiante,
            estado: 'desbloqueado',
            fecha_reclutamiento: new Date().toISOString().slice(0, 10) 
        };
    } catch (error) {
        console.log(`error al insertar en empresEstudiante ${error}`)
    }
}