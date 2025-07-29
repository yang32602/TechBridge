import db from '../config/db.js'


export const insigniasEstudiante = async (id_usuario, id_insignia) => {
    const sql = `INSERT INTO usuario_insignia(id_usuario,id_insignia, fecha_asignacion)
                 VALUES (?,?,CURDATE())`;

    try {
        const [result] = await db.query(sql, [id_usuario, id_insignia]);
        if(result.affeaffectedRows > 0){
            return true;
        }
    } catch (error) {
        console.error('Fallo en insertar la insignia', error);
        throw error;
    }
};