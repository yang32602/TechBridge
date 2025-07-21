import admin from 'firebase-admin'; // Ya inicializado en app.js
import db from '../config/db.js'; // Tu conexión a la base de datos

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
        notification: {
            title: title,
            body: body,
        },
        data: formattedData, // Los datos deben ser solo strings
        token: targetFCMToken,
    };

    try {
        // Envía el mensaje usando el SDK de Firebase Admin
        const response = await admin.messaging().send(message);
        console.log('Util (FCM): Notificación enviada exitosamente:', response);
        return response; // Retorna el messageId
    } catch (error) {
        console.error('Util (FCM): Error al enviar la notificación push:', error);
        // Puedes manejar errores específicos de Firebase aquí
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
            console.warn(`Token FCM inválido o no registrado: ${targetFCMToken}. Considera eliminarlo de la DB.`);
            // Opcional: Implementa lógica para eliminar el token de la DB
            // await deleteInvalidFCMToken(targetFCMToken);
        }
        throw error; // Propaga el error
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
        // Asumiendo que el campo en la BD sigue siendo 'expoPushToken' pero ahora guarda FCM tokens
        const [rows] = await db.query('SELECT fcmToken FROM estudiantes WHERE id = ?', [applicantId]);
        const applicantToken = rows[0]?.fcmToken;

        if (applicantToken) {
            await sendPushNotification(applicantToken, title, body, data);
        } else {
            console.log(`No se encontró FCM Token para el postulante ID: ${applicantId}. Notificación no enviada.`);
        }
    } catch (error) {
        console.error(`Error al notificar al postulante ${applicantId}:`, error);
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
        // Asumiendo que el campo en la BD sigue siendo 'expoPushToken' pero ahora guarda FCM tokens
        const [rows] = await db.query('SELECT fcmToken FROM empresas WHERE id = ?', [companyId]);
        const companyToken = rows[0]?.fcmToken;

        if (companyToken) {
            await sendPushNotification(companyToken, title, body, data);
        } else {
            console.log(`No se encontró FCM Token para la empresa ID: ${companyId}. Notificación no enviada.`);
        }
    } catch (error) {
        console.error(`Error al notificar a la empresa ${companyId}:`, error);
    }
}

export {
    sendPushNotification,
    notifyApplicant,
    notifyCompany,
};