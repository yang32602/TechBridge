// backend/src/routes/users.js
import express from 'express';

import db from '../config/db.js'; // Tu configuración de base de datos MySQL

const router = express.Router();

// Ruta para que la app móvil registre el token de notificación de un usuario
router.post('/registerPushToken', async (req, res) => {
  const { userId, userType, expoPushToken } = req.body; // userType puede ser 'postulante' o 'empresa'

  if (!userId || !userType || !expoPushToken) {
    return res.status(400).json({ message: 'Faltan campos requeridos: userId, userType, expoPushToken' });
  }

  try {
    let tableName;
    if (userType === 'postulante') {
      tableName = 'estudiantes';
    } else if (userType === 'empresa') {
      tableName = 'empresas';
    } else {
      return res.status(400).json({ message: 'Tipo de usuario inválido. Debe ser "postulante" o "empresa".' });
    }

    // El cambio clave: Actualizamos el token en la tabla correcta (estudiantes/empresas)
    // usando la columna `id_usuario` que referencia al `id` de la tabla `usuarios`.
    const query = `UPDATE ${tableName} SET expoPushToken = ? WHERE id_usuario = ?`;
    await db.query(query, [expoPushToken, userId]);

    res.status(200).json({ message: 'Token de notificación registrado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar el token de push:', error);
    res.status(500).json({ message: 'Error interno del servidor al registrar el token de push.' });
  }
});

export default router;