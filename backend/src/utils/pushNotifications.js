import { Expo } from 'expo-server-sdk';
import db from '../config/db.js'; // Ajusta la ruta a tu configuración de base de datos

let expo = new Expo(); // No necesitas accessToken a menos que quieras usar características avanzadas de Expo Push (raro)

/**
 * Envía una notificación push a un token específico.
 * @param {string} targetExpoPushToken - El token de Expo Push del dispositivo.
 * @param {string} title - El título de la notificación.
 * @param {string} body - El cuerpo de la notificación.
 * @param {object} data - Datos personalizados para la notificación (ej. { screen: 'VacancyDetails', vacancyId: 123 }).
 */
async function sendPushNotification(targetExpoPushToken, title, body, data = {}) {
  if (!Expo.isExpoPushToken(targetExpoPushToken)) {
    console.error(`Error: Push token "${targetExpoPushToken}" is not a valid Expo push token.`);
    return;
  }

  const message = {
    to: targetExpoPushToken,
    sound: 'default', // Sonido predeterminado
    title: title,
    body: body,
    data: data, // Aquí van tus datos personalizados para la navegación en la app
  };

  try {
    // Expo puede enviar múltiples mensajes a la vez, aquí enviamos uno solo
    let ticketChunk = await expo.sendPushNotificationsAsync([message]);
    console.log('Push notification sent:', ticketChunk);
    // Puedes guardar los tickets si necesitas verificar el estado de entrega (ej. si hubo errores)
  } catch (error) {
    console.error(`Error sending push notification to ${targetExpoPushToken}:`, error);
  }
}

/**
 * Notifica a un postulante sobre una acción (ej. interés de empresa, estado de vacante).
 * @param {number} applicantId - El ID del postulante.
 * @param {string} title - Título de la notificación.
 * @param {string} body - Cuerpo de la notificación.
 * @param {object} data - Datos adicionales para la navegación.
 */
async function notifyApplicant(applicantId, title, body, data = {}) {
  try {
    const [rows] = await db.query('SELECT expoPushToken FROM estudiantes WHERE id = ?', [applicantId]);
    const applicantToken = rows[0]?.expoPushToken;

    if (applicantToken) {
      await sendPushNotification(applicantToken, title, body, data);
    } else {
      console.log(`No Expo Push Token found for applicant ID: ${applicantId}. Notification not sent.`);
    }
  } catch (error) {
    console.error(`Error notifying applicant ${applicantId}:`, error);
  }
}

/**
 * Notifica a una empresa sobre una acción (ej. nueva postulación, respuesta de postulante).
 * @param {number} companyId - El ID de la empresa.
 * @param {string} title - Título de la notificación.
 * @param {string} body - Cuerpo de la notificación.
 * @param {object} data - Datos adicionales para la navegación.
 */
async function notifyCompany(companyId, title, body, data = {}) {
  try {
    const [rows] = await db.query('SELECT expoPushToken FROM empresas WHERE id = ?', [companyId]);
    const companyToken = rows[0]?.expoPushToken;

    if (companyToken) {
      await sendPushNotification(companyToken, title, body, data);
    } else {
      console.log(`No Expo Push Token found for company ID: ${companyId}. Notification not sent.`);
    }
  } catch (error) {
    console.error(`Error notifying company ${companyId}:`, error);
  }
}

export {
  sendPushNotification,
  notifyApplicant,
  notifyCompany,
};