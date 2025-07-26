// backend/src/utils/pushNotifications.js
import admin from 'firebase-admin'; 
import db from '../config/db.js';
import UsuarioMobileModel from '../models/usuariosMobile.model.js';

async function enviarPushNotificacion(targetFCMToken, title, body, data = {}) {
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
        // Manejo de errores específicos de Firebase aquí
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


async function notificacionesEstudiante(applicantId, title, body, data = {}) {
    try {
        const [rows] = await db.query('SELECT fcmToken FROM estudiantes WHERE id = ?', [applicantId]);
        const applicantToken = rows[0]?.fcmToken;

        if (applicantToken) {
            const sendResult = await enviarPushNotificacion(applicantToken, title, body, data);
            if (!sendResult.success && sendResult.shouldDeleteToken) {
                console.log(`[Notification] Eliminando token FCM inválido de estudiante ID ${applicantId}: ${sendResult.invalidToken}`);
                await UsuarioMobileModel.eliminarFCMToken(applicantId, 'estudiante'); // <-- LLAMADA AL MODELO
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


async function notificacionesEmpresa(companyId, title, body, data = {}) {
    try {
        const [rows] = await db.query('SELECT fcmToken FROM empresas WHERE id = ?', [companyId]);
        const companyToken = rows[0]?.fcmToken;

        if (companyToken) {
            const sendResult = await enviarPushNotificacion(companyToken, title, body, data);
            if (!sendResult.success && sendResult.shouldDeleteToken) {
                console.log(`[Notification] Eliminando token FCM inválido de empresa ID ${companyId}: ${sendResult.invalidToken}`);
                await UsuarioMobileModel.eliminarFCMToken(companyId, 'empresa'); // <-- LLAMADA AL MODELO
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

export const enviarNewAppNotificacion = async (fcmTokenEmpresa, idPostulanteReal, empresaId, nombreEstudiante = 'Un nuevo estudiante') => {
    const title = '¡Nueva Postulación Recibida!';
    const body = `${nombreEstudiante} se ha postulado a una de tus vacantes.`;
    const data = {
        screen: 'empresa/detalle/postulante',
        postulanteId: String(idPostulanteReal),
    };

    try {
        const sendResult = await enviarPushNotificacion(fcmTokenEmpresa, title, body, data);

        if (sendResult.success) {
            console.log('[Postulacion] Notificación de nueva postulación enviada a la empresa.');
            return true;
        } else if (sendResult.shouldDeleteToken) {
            console.log(`[Postulacion] Eliminando token FCM inválido de empresa ID ${empresaId}: ${sendResult.invalidToken}`);
            await UsuarioMobileModel.eliminarFCMToken(empresaId, 'empresa'); // <-- LLAMADA AL MODELO
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

export const eliminarFCMTokenDeUser = async (userId, userType) => {
    console.log(`[FCM Token Cleanup] Intentando eliminar token para ${userType} ID ${userId}.`);
    try {
        let tableName;
        if (userType === 'estudiante') {
            tableName = 'estudiantes';
        } else if (userType === 'empresa') {
            tableName = 'empresas';
        } else {
            console.error(`[FCM Token Cleanup] Tipo de usuario inválido para eliminación: ${userType}`);
            return; 
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
    enviarPushNotificacion as sendPushNotification,
    notificacionesEstudiante as notifyApplicant,
    notificacionesEmpresa as notifyCompany,
};