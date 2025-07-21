// backend/src/models/usuariosMobile.model.js
import db from '../config/db.js'; // Importa tu conexión a la base de datos

class UsuarioMobileModel {
    // Nueva función para encontrar un usuario por correo en la tabla 'usuarios'
    static async findUsuarioByCorreo(correo) {
        try {
            const [rows] = await db.execute('SELECT id, tipo, contrasena FROM usuarios WHERE correo = ?', [correo]);
            return rows.length > 0 ? rows[0] : null; // Retorna el usuario o null
        } catch (error) {
            console.error('Error en findUsuarioByCorreo:', error);
            throw error;
        }
    }

    // Nueva función para obtener el ID de estudiante dado el ID de usuario
    static async getEstudianteIdByUsuarioId(idUsuario) {
        try {
            const [rows] = await db.execute('SELECT id FROM estudiantes WHERE id_usuario = ?', [idUsuario]);
            return rows.length > 0 ? rows[0].id : null; // Retorna el id de estudiante o null
        } catch (error) {
            console.error('Error en getEstudianteIdByUsuarioId:', error);
            throw error;
        }
    }

    // Nueva función para obtener el ID de empresa dado el ID de usuario
    static async getEmpresaIdByUsuarioId(idUsuario) {
        try {
            const [rows] = await db.execute('SELECT id FROM empresas WHERE id_usuario = ?', [idUsuario]);
            return rows.length > 0 ? rows[0].id : null; // Retorna el id de empresa o null
        } catch (error) {
            console.error('Error en getEmpresaIdByUsuarioId:', error);
            throw error;
        }
    }

    // Mantener la función de actualización de Expo Push Token (ahora buscará en estudiantes/empresas)
    static async updateExpoPushToken(specificUserId, userType, expoPushToken) {
        try {
            let tableName;
            if (userType === 'estudiante') {
                tableName = 'estudiantes';
            } else if (userType === 'empresa') {
                tableName = 'empresas';
            } else {
                throw new Error('Tipo de usuario inválido para actualizar Expo Push Token.');
            }

            // Aquí el WHERE debe ser por el 'id' de la tabla 'estudiantes' o 'empresas',
            // no por 'id_usuario'. specificUserId es el id de la tabla estudiante/empresa.
            const query = `UPDATE ${tableName} SET fcmToken = ? WHERE id = ?`;
            const [result] = await db.execute(query, [expoPushToken, specificUserId]);
            return result.affectedRows; // Retorna el número de filas afectadas
        } catch (error) {
            console.error('Error en updateExpoPushToken:', error);
            throw error;
        }
    }
}

export default UsuarioMobileModel;