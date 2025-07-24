// backend/src/utils/pushNotifications.js
import admin from 'firebase-admin'; // Ya inicializado en app.js
import db from '../config/db.js'; // Tu conexión a la base de datos
import UsuarioMobileModel from '../models/usuariosMobile.model.js';
/**
 * Envía una notificación push a un token de FCM específico usando Firebase Admin SDK.
 * @param {string} targetFCMToken - El token de registro de FCM del dispositivo.
 * @param {string} title - El título de la notificación.
 * @param {string} body - El cuerpo de la notificación.
 * @param {object} data - Datos personalizados para la notificación (clave-valor, todos string).
 * @returns {Promise<string>} La respuesta del envío de FCM (messageId).
 */
async function sendPushNotification(targetFCMToken, title, body, data = {}) {
    console.log('Util (FCM): Solicitud para enviar notificación.');
    console.log('Token FCM recibido:', targetFCMToken);
    console.log('Título:', title);
    console.log('Cuerpo:', body);
    console.log('Datos:', data);

    // Los datos personalizados para FCM deben ser siempre strings
    const formattedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
    }, {});

    const message = {
        token: targetFCMToken,
        notification: {
            title: title,
            body: body,
        },
        data: formattedData, // Los datos deben ser solo strings
        
    };

    try {
        // Envía el mensaje usando el SDK de Firebase Admin
        const response = await admin.messaging().send(message);
        console.log('Util (FCM): Notificación enviada exitosamente:', response);
        return { success: true, messageId: response };
    } catch (error) {
        console.error('Util (FCM): Error al enviar la notificación push:', error);
        // Puedes manejar errores específicos de Firebase aquí
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered' ||
            error.code === 'messaging/mismatched-credential') {
            console.warn(`Token FCM inválido o no registrado: ${targetFCMToken}. Considera eliminarlo de la DB.`);
            /// Retorna un objeto indicando fallo y que el token debe ser eliminado
            return { success: false, error: error, shouldDeleteToken: true, invalidToken: targetFCMToken };
        }else {
            // Para otros errores no relacionados con el token inválido
            console.error(`Error FCM genérico: ${error.message}`);
            return { success: false, error: error, shouldDeleteToken: false };
        }
    }
}

/**
 * Notifica a un postulante sobre una acción (ej. interés de empresa, estado de vacante).
 * @param {number} applicantId - El ID del postulante (de la tabla 'estudiantes').
 * @param {string} title - Título de la notificación.
 * @param {string} body - Cuerpo de la notificación.
 * @param {object} data - Datos adicionales para la navegación.
 */
async function notifyApplicant(applicantId, title, body, data = {}) {
    try {
        const [rows] = await db.query('SELECT fcmToken FROM estudiantes WHERE id = ?', [applicantId]);
        const applicantToken = rows[0]?.fcmToken;

        if (applicantToken) {
            const sendResult = await sendPushNotification(applicantToken, title, body, data);
            if (!sendResult.success && sendResult.shouldDeleteToken) {
                console.log(`[Notification] Eliminando token FCM inválido de estudiante ID ${applicantId}: ${sendResult.invalidToken}`);
                await UsuarioMobileModel.deleteFCMToken(applicantId, 'estudiante'); // <-- LLAMADA AL MODELO
            }
            return sendResult.success;
        } else {
            console.log(`No se encontró FCM Token para el postulante ID: ${applicantId}. Notificación no enviada.`);
            return false;
        }
    } catch (error) {
        console.error(`Error al notificar al postulante ${applicantId}:`, error);
        return false;
    }
}


/**
 * Notifica a una empresa sobre una acción (ej. nueva postulación, respuesta de postulante).
 * @param {number} companyId - El ID de la empresa (de la tabla 'empresas').
 * @param {string} title - Título de la notificación.
 * @param {string} body - Cuerpo de la notificación.
 * @param {object} data - Datos adicionales para la navegación.
 */
async function notifyCompany(companyId, title, body, data = {}) {
    try {
        const [rows] = await db.query('SELECT fcmToken FROM empresas WHERE id = ?', [companyId]);
        const companyToken = rows[0]?.fcmToken;

        if (companyToken) {
            const sendResult = await sendPushNotification(companyToken, title, body, data);
            if (!sendResult.success && sendResult.shouldDeleteToken) {
                console.log(`[Notification] Eliminando token FCM inválido de empresa ID ${companyId}: ${sendResult.invalidToken}`);
                await UsuarioMobileModel.deleteFCMToken(companyId, 'empresa'); // <-- LLAMADA AL MODELO
            }
            return sendResult.success;
        } else {
            console.log(`No se encontró FCM Token para la empresa ID: ${companyId}. Notificación no enviada.`);
            return false;
        }
    } catch (error) {
        console.error(`Error al notificar a la empresa ${companyId}:`, error);
        return false;
    }
}

/**
 * Envía una notificación para una nueva postulación.
 * @param {string} fcmTokenEmpresa - El token FCM del dispositivo de la empresa.
 * @param {string} idPostulanteReal - El ID real del estudiante de la tabla 'estudiantes'.
 * @param {string} [nombreEstudiante='Un nuevo estudiante'] - Opcional: Nombre del estudiante para el cuerpo de la notificación.
 */
export const sendNewApplicationNotification = async (fcmTokenEmpresa, idPostulanteReal, empresaId, nombreEstudiante = 'Un nuevo estudiante') => {
    const title = '¡Nueva Postulación Recibida!';
    const body = `${nombreEstudiante} se ha postulado a una de tus vacantes.`;
    const data = {
        screen: 'empresa/detalle/postulante',
        postulanteId: String(idPostulanteReal),
    };

    try {
        const sendResult = await sendPushNotification(fcmTokenEmpresa, title, body, data);

        if (sendResult.success) {
            console.log('[Postulacion] Notificación de nueva postulación enviada a la empresa.');
            return true;
        } else if (sendResult.shouldDeleteToken) {
            console.log(`[Postulacion] Eliminando token FCM inválido de empresa ID ${empresaId}: ${sendResult.invalidToken}`);
            await UsuarioMobileModel.deleteFCMToken(empresaId, 'empresa'); // <-- LLAMADA AL MODELO
            return false;
        } else {
            console.error(`Error en sendNewApplicationNotification para token ${fcmTokenEmpresa}:`, sendResult.error.message);
            throw sendResult.error;
        }
    } catch (error) {
        console.error(`Error general en sendNewApplicationNotification para token ${fcmTokenEmpresa}:`, error.message);
        throw error;
    }
};

/**
 * Elimina un FCM token específico de la base de datos,
 * marcándolo como NULL si es inválido o no registrado.
 * Esta función es genérica y buscará el token en las tablas 'empresas' y 'estudiantes'.
 *
 * @param {string} invalidFCMToken - El token de FCM que se debe eliminar.
 */

export const deleteFCMTokenFromUser = async (userId, userType) => {
    console.log(`[FCM Token Cleanup] Intentando eliminar token para ${userType} ID ${userId}.`);
    try {
        let tableName;
        if (userType === 'estudiante') {
            tableName = 'estudiantes';
        } else if (userType === 'empresa') {
            tableName = 'empresas';
        } else {
            console.error(`[FCM Token Cleanup] Tipo de usuario inválido para eliminación: ${userType}`);
            return; // No proceder con la eliminación si el tipo es inválido
        }

        // Actualiza el fcmToken a NULL para el ID de usuario específico
        const query = `UPDATE ${tableName} SET fcmToken = NULL WHERE id = ?`;
        const [result] = await db.query(query, [userId]); // Usar db.query directamente

        if (result.affectedRows > 0) {
            console.log(`[FCM Token Cleanup] Token eliminado de la tabla '${tableName}' para ID ${userId}.`);
        } else {
            console.log(`[FCM Token Cleanup] Token no encontrado para ${userType} ID ${userId} (ya eliminado o nunca existió).`);
        }

    } catch (error) {
        console.error(`[FCM Token Cleanup] Error al eliminar el token para ${userType} ID ${userId} de la DB:`, error);
    }
};

export {
    sendPushNotification,
    notifyApplicant,
    notifyCompany,
};