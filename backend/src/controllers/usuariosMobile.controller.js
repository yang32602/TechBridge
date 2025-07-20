import UsuarioMobileModel from '../models/usuariosMobile.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Expo } from 'expo-server-sdk';
import admin from 'firebase-admin'; // Keep this import as it might be used elsewhere for Firebase Admin SDK features.


const expo = new Expo();

const JWT_SECRET = process.env.JWT_SECRET;

// Verificar que la clave secreta esté presente
if (!JWT_SECRET) {
  console.error("ERROR: JWT_SECRET no está definido en las variables de entorno.");
  process.exit(1);
}

// Lógica de autenticación general para estudiantes (desde app móvil)
export const autenticacionEstudianteMobile = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // 1. Buscar el usuario en la tabla 'usuarios' por correo
    const usuario = await UsuarioMobileModel.findUsuarioByCorreo(correo);

    if (!usuario || usuario.tipo !== 'estudiante') { // Asegura que sea un usuario de tipo estudiante
      return res.status(401).json({ mensaje: 'Credenciales inválidas para estudiante.' });
    }

    // ---------- INICIO DE LA MODIFICACIÓN TEMPORAL (MUY INSEGURO) ----------
    // Compara directamente la contraseña si no está hasheada
    // ¡QUITAR ESTO EN PRODUCCIÓN!
    if (contrasena !== usuario.contrasena) { // Comparación directa, solo if the password is NOT hashed in DB
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }
    // ---------- FIN DE LA MODIFICACIÓN TEMPORAL ----------


    /*
    // 2. Comparar la contraseña hasheada (comentario temporal)
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }
    */

    // 3. Obtener el ID específico del estudiante de la tabla 'estudiantes'
    const estudianteId = await UsuarioMobileModel.getEstudianteIdByUsuarioId(usuario.id);

    if (!estudianteId) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado para este usuario.' });
    }

    // 4. Generar el JWT con el ID específico del estudiante y el tipo de usuario de la tabla 'usuarios'
    const userPayload = {
      userId: estudianteId, // Usamos el ID de la tabla 'estudiantes'
      userType: usuario.tipo // Usamos 'estudiante' de la tabla 'usuarios'
    };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });

    // 5. Enviar la respuesta
    return res.status(200).json({
      userId: estudianteId,
      userType: usuario.tipo,
      token: token,
      mensaje: 'Inicio de sesión exitoso',
      estado: 1
    });

    /*const responseData = {
      userId: estudianteId,
      userType: usuario.tipo,
      token: token,
      mensaje: 'Inicio de sesión exitoso',
      estado: 1
    };
    console.log('BACKEND DEBUG: Enviando respuesta JSON al frontend:', responseData); // <-- ¡AÑADE ESTA LÍNEA!
    res.status(200).json(responseData); */

  } catch (error) {
    console.error('Error en autenticacionEstudianteMobile:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Lógica de autenticación general para empresas (desde app móvil)
export const autenticacionEmpresaMobile = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // 1. Buscar el usuario en la tabla 'usuarios' por correo
    const usuario = await UsuarioMobileModel.findUsuarioByCorreo(correo);

    if (!usuario || usuario.tipo !== 'empresa') { // Asegura que sea un usuario de tipo empresa
      return res.status(401).json({ mensaje: 'Credenciales inválidas para empresa.' });
    }

    if (contrasena !== usuario.contrasena) { // Comparación directa, solo if the password is NOT hashed in DB
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    // ***** ADVERTENCIA DE SEGURIDAD: ESTO ES TEMPORAL Y DEBE SER CAMBIADO A BCRYPT *****
    // If passwords are NOT HASHED in DB, use this line.
    if (contrasena !== usuario.contrasena) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }
    // ***** FIN DE ADVERTENCIA *****

    // If you DO have hashed passwords in DB, activate this and delete the above:
    // const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    // if (!contrasenaValida) {
    //   return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    // }
    // 3. Obtener el ID específico de la empresa de la tabla 'empresas'
    const empresaId = await UsuarioMobileModel.getEmpresaIdByUsuarioId(usuario.id);

    if (!empresaId) {
      return res.status(404).json({ mensaje: 'Empresa no encontrada para este usuario.' });
    }

    // 4. Generar el JWT con el ID específico de la empresa y el tipo de usuario de la tabla 'usuarios'
    const userPayload = {
      userId: empresaId, // Usamos el ID de la tabla 'empresas'
      userType: usuario.tipo // Usamos 'empresa' de la tabla 'usuarios'
    };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });

    // 5. Enviar la respuesta
    return res.status(200).json({
      userId: empresaId,
      userType: usuario.tipo,
      token: token,
      mensaje: 'Inicio de sesión exitoso',
      estado: 1
    });

    /*const responseData = {
      userId: empresaId,
      userType: usuario.tipo,
      token: token,
      mensaje: 'Inicio de sesión exitoso',
      estado: 1
    };
    console.log('BACKEND DEBUG: Enviando respuesta JSON al frontend:', responseData); // <-- ¡AÑADE ESTA LÍNEA!
    res.status(200).json(responseData); */

  } catch (error) {
    console.error('Error en autenticacionEmpresaMobile:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Lógica para registrar el token de notificación (MOVIDA DESDE LAS RUTAS)
export const registerPushToken = async (req, res) => {
  // Cuando el frontend envía userId para esta ruta, se espera que sea el ID
  // de la tabla `estudiantes` o `empresas`, NO el `id` de la tabla `usuarios`.
  const { userId, userType } = req.user;

  /// expoPushToken siempre vendrá en el body (o deberías enviarlo así desde el frontend)
  const { expoPushToken } = req.body;

  if (!userId || !userType || !expoPushToken) {
    return res.status(400).json({ message: 'Faltan campos requeridos: userId, userType, expoPushToken' });
  }

  try {
    // Usamos el modelo para actualizar el token en la BD
    // El userId que recibimos aquí es el ID de la tabla `estudiantes` o `empresas`
    const affectedRows = await UsuarioMobileModel.updateExpoPushToken(userId, userType, expoPushToken);

    if (affectedRows === 0) {
      // Esto podría significar que el userId no existe en la tabla correspondiente
      // o que el token ya es el mismo.
      return res.status(404).json({ message: 'Usuario no encontrado o token ya registrado.' });
    }

    return res.status(200).json({ message: 'Token de notificación registrado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar el token de push:', error);
    return res.status(500).json({ message: 'Error interno del servidor al registrar el token de push.' });
  }
};

export const sendTestPushNotification = async (req, res) => {
  const { pushToken, title, body, data } = req.body;

  console.log('Backend: Solicitud para enviar notificación de prueba.');
  console.log('Token recibido:', pushToken);
  console.log('Título:', title);
  console.log('Cuerpo:', body);
  console.log('Datos:', data);

  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Token ${pushToken} no es un Expo Push Token válido.`);
    return res.status(400).json({ mensaje: `Token ${pushToken} no es un Expo Push Token válido.` });
  }

  let messages = [];
  messages.push({
    to: pushToken,
    sound: 'default',
    title: title || 'Notificación de Prueba',
    body: body || '¡Hola! Esta es una notificación de prueba desde tu backend.',
    data: data || { someData: 'goes here' },
  });

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];

  try {
    // Revertimos la creación de Expo a como debería ser normalmente
    const currentExpo = new Expo(); // <-- ¡Así es como debería ser! Sin accessToken aquí.

    for (let chunk of chunks) {
      let ticketChunk = await currentExpo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    console.log('Backend: Notificaciones enviadas. Tickets:', tickets);

    return res.status(200).json({ mensaje: 'Notificación de prueba enviada exitosamente.', tickets });

  } catch (error) {
    console.error('Backend: Error al enviar la notificación de prueba:', error);
    console.error('DETALLE DEL MENSAJE DE ERROR:', error.message);
    if (error.stack) {
      console.error('STACK TRACE COMPLETO:', error.stack);
    }
    return res.status(500).json({ mensaje: 'Error interno del servidor al enviar la notificación.', error: error.message });
  }
};