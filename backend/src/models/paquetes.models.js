import db from '../config/db.js'


export const obtenerPaquetes = async (id_paquete) =>{
    const sql = ` SELECT * FROM techpoints WHERE id = ?`

    try {
        const paquetes = await db.query(sql, [id_paquete])
    } catch (error) {
        console.log('Error al traer los paqutes')   
    }


}