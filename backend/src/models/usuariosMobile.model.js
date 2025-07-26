// backend/src/models/usuariosMobile.model.js
import db from '../config/db.js'; // Importa tu conexión a la base de datos

class UsuarioMobileModel {
    // Nueva función para encontrar un usuario por correo en la tabla 'usuarios'
    static async buscarUsuarioCorreo(correo) {
        try {
            const [rows] = await db.execute('SELECT id, tipo, contrasena FROM usuarios WHERE correo = ?', [correo]);
            return rows.length > 0 ? rows[0] : null; // Retorna el usuario o null
        } catch (error) {
            console.error('Error en findUsuarioByCorreo:', error);
            throw error;
        }
    }

    // Nueva función para obtener el ID de estudiante dado el ID de usuario
    static async obtenerEstudiantePorUsuarioId(idUsuario) {
        try {
            const [rows] = await db.execute('SELECT id FROM estudiantes WHERE id_usuario = ?', [idUsuario]);
            return rows.length > 0 ? rows[0].id : null; // Retorna el id de estudiante o null
        } catch (error) {
            console.error('Error en getEstudianteIdByUsuarioId:', error);
            throw error;
        }
    }

    // Nueva función para obtener el ID de empresa dado el ID de usuario
    static async obtenerEmpresaPorUsuarioId(idUsuario) {
        try {
            const [rows] = await db.execute('SELECT id FROM empresas WHERE id_usuario = ?', [idUsuario]);
            return rows.length > 0 ? rows[0].id : null; // Retorna el id de empresa o null
        } catch (error) {
            console.error('Error en getEmpresaIdByUsuarioId:', error);
            throw error;
        }
    }

    // Mantener la función de actualización de FcmToken (ahora buscará en estudiantes/empresas)
    static async actualizarFCMToken(specificUserId, userType, fcmToken) {
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
            const [result] = await db.execute(query, [fcmToken, specificUserId]);
            return result.affectedRows; 
        } catch (error) {
            console.error('Error en updateExpoPushToken:', error);
            throw error;
        }
    }
    // Nueva función para eliminar (poner a NULL) el token FCM
    static async eliminarFCMToken(specificUserId, userType) { 
        try {
            let tableName;
            if (userType === 'estudiante') {
                tableName = 'estudiantes';
            } else if (userType === 'empresa') {
                tableName = 'empresas';
            } else {
                console.warn(`[DB Delete FCM] Tipo de usuario inválido: ${userType}`);
                throw new Error('Tipo de usuario inválido para eliminar FCM Token.');
            }

            const query = `UPDATE ${tableName} SET fcmToken = NULL WHERE id = ?`;
            const [result] = await db.execute(query, [specificUserId]);

            console.log(`DB: Token FCM puesto a NULL para ${userType} ID ${specificUserId}. Filas afectadas: ${result.affectedRows}`);
            return result.affectedRows;
        } catch (error) {
            console.error('Error en deleteFCMToken (modelo):', error); // Añadido (modelo) para distinguir logs
            throw error;
        }
    }
}

export default UsuarioMobileModel;