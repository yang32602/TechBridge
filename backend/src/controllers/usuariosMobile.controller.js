//backend/src/controllers/usuariosMobile.controller.js
import UsuarioMobileModel from '../models/usuariosMobile.model.js';
import jwt from 'jsonwebtoken';
// Importa las funciones de notificación desde el nuevo archivo de utilidades
import { sendPushNotification } from '../utils/pushNotifications.js';

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
    const usuario = await UsuarioMobileModel.buscarUsuarioCorreo(correo);

    if (!usuario || usuario.tipo !== 'estudiante') { // Asegura que sea un usuario de tipo estudiante
      return res.status(401).json({ mensaje: 'Credenciales inválidas para estudiante.' });
    }

    // ---------- INICIO DE LA MODIFICACIÓN TEMPORAL ----------
    // Compara directamente la contraseña si no está hasheada
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
    const estudianteId = await UsuarioMobileModel.obtenerEstudiantePorUsuarioId(usuario.id);

    if (!estudianteId) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado para este usuario.' });
    }

    // 4. Generar el JWT con el ID específico del estudiante y el tipo de usuario de la tabla 'usuarios'
    const userPayload = {
      userId: estudianteId, 
      userType: usuario.tipo 
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
    const usuario = await UsuarioMobileModel.buscarUsuarioCorreo(correo);

    if (!usuario || usuario.tipo !== 'empresa') { // Asegura que sea un usuario de tipo empresa
      return res.status(401).json({ mensaje: 'Credenciales inválidas para empresa.' });
    }

    if (contrasena !== usuario.contrasena) { // Comparación directa, solo if the password is NOT hashed in DB
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    // const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    // if (!contrasenaValida) {
    //   return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    // }
    // 3. Obtener el ID específico de la empresa de la tabla 'empresas'
    const empresaId = await UsuarioMobileModel.obtenerEmpresaPorUsuarioId(usuario.id);

    if (!empresaId) {
      return res.status(404).json({ mensaje: 'Empresa no encontrada para este usuario.' });
    }

    // 4. Generar el JWT con el ID específico de la empresa y el tipo de usuario de la tabla 'usuarios'
    const userPayload = {
      userId: empresaId, 
      userType: usuario.tipo 
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

  } catch (error) {
    console.error('Error en autenticacionEmpresaMobile:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Lógica para registrar el token de notificación (MOVIDA DESDE LAS RUTAS)
export const registrarPushToken = async (req, res) => {
  console.log('--- BACKEND LOG ---');
    console.log('B. Controlador usuariosMobileController.registerPushToken alcanzado.');
    
    console.log('B.1. Datos recibidos en req.user (del JWT):', req.user);
    console.log('B.2. Datos recibidos en req.body (el FCM token):', req.body);

  const { userId, userType } = req.user;

  const { fcmToken } = req.body;

  if (!userId || !userType || !fcmToken) {
    console.log('B.3. ERROR: Faltan campos requeridos en la petición.');
    return res.status(400).json({ message: 'Faltan campos requeridos: userId, userType, fcmToken' });
  }

  try {
    const affectedRows = await UsuarioMobileModel.actualizarFCMToken(userId, userType, fcmToken);
    console.log('B.4. Resultado de updateExpoPushToken (filas afectadas):', affectedRows);

    if (affectedRows === 0) {
      console.log('B.5. ADVERTENCIA: Usuario no encontrado o token ya registrado (0 filas afectadas).');
      return res.status(404).json({ message: 'Usuario no encontrado o token ya registrado.' });
    }

    console.log('B.6. Token de notificación registrado exitosamente.');
    return res.status(200).json({ message: 'Token de notificación registrado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar el token de push:', error);
    return res.status(500).json({ message: 'Error interno del servidor al registrar el token de push.' });
  }
};
