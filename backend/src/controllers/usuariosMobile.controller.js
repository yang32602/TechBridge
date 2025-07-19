// backend/src/controllers/usuariosMobile.controller.js
import UsuarioMobileModel from '../models/usuariosMobile.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
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
        if (contrasena !== usuario.contrasena) { // Comparación directa, solo si la contraseña NO está hasheada en DB
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
        res.status(200).json({
            userId: estudianteId,
            userType: usuario.tipo,
            token: token,
            mensaje: 'Inicio de sesión exitoso',
            estado: 1
        });

    } catch (error) {
        console.error('Error en autenticacionEstudianteMobile:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
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

        // 2. Comparar la contraseña hasheada
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contrasenaValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
        }

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
        res.status(200).json({
            userId: empresaId,
            userType: usuario.tipo,
            token: token,
            mensaje: 'Inicio de sesión exitoso',
            estado: 1
        });

    } catch (error) {
        console.error('Error en autenticacionEmpresaMobile:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

// Lógica para registrar el token de notificación (MOVIDA DESDE LAS RUTAS)
export const registerPushToken = async (req, res) => {
    // Cuando el frontend envía userId para esta ruta, se espera que sea el ID
    // de la tabla `estudiantes` o `empresas`, NO el `id` de la tabla `usuarios`.
    const { userId, userType, expoPushToken } = req.user;

    // Aclaración: userType en frontend (index.tsx) es 'estudiante' o 'empresa' (o 'postulante' si no lo cambiaste)
    // Pero en el backend, tu esquema de DB usa 'estudiante' o 'empresa'.
    // Si tu frontend envía 'postulante', asegúrate de que aquí lo mapeas a 'estudiante'
    /*let backendUserType = userType;
    if (userType === 'postulante') { // Si el frontend aún envía 'postulante'
        backendUserType = 'estudiante'; // Mapea a 'estudiante' para tu DB
    }*/

    if (!userId || !backendUserType || !expoPushToken) {
        return res.status(400).json({ message: 'Faltan campos requeridos: userId, userType, expoPushToken' });
    }

    try {
        // Usamos el modelo para actualizar el token en la BD
        // El userId que recibimos aquí es el ID de la tabla `estudiantes` o `empresas`
        const affectedRows = await UsuarioMobileModel.updateExpoPushToken(userId, backendUserType, expoPushToken);

        if (affectedRows === 0) {
            // Esto podría significar que el userId no existe en la tabla correspondiente
            // o que el token ya es el mismo.
            return res.status(404).json({ message: 'Usuario no encontrado o token ya registrado.' });
        }

        res.status(200).json({ message: 'Token de notificación registrado exitosamente.' });
    } catch (error) {
        console.error('Error al registrar el token de push:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar el token de push.' });
    }
};