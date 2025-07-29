import db from '../config/db.js'

export const insigniasEstudiante = async (id_usuario, id_insignia) => {
    const insertSQL = `
        INSERT INTO usuario_insignia(id_usuario, id_insignia, fecha_asignacion)
        VALUES (?, ?, CURDATE())
    `;

    const nombreSQL = `
        SELECT nombre FROM insignias WHERE id = ?
    `;

    try {
        // Obtener el nombre de la insignia
        const [nombreInsigRows] = await db.query(nombreSQL, [id_insignia]);
        const nombreInsignia = nombreInsigRows[0]?.nombre;

        // Insertar la relación
        const [result] = await db.query(insertSQL, [id_usuario, id_insignia]);

        if (result.affectedRows > 0) {
            return nombreInsignia;
        } else {
            throw new Error("No se pudo asignar la insignia.");
        }
    } catch (error) {
        console.error('Fallo en insertar la insignia', error);
        throw error;
    }
};
