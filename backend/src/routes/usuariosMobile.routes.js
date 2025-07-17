// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Tu configuración de base de datos MySQL

// Ruta para que la app móvil registre el token de notificación de un usuario
router.post('/registerPushToken', async (req, res) => {
  const { userId, userType, expoPushToken } = req.body; // userType puede ser 'postulante' o 'empresa'

  if (!userId || !userType || !expoPushToken) {
    return res.status(400).json({ message: 'Faltan campos requeridos: userId, userType, expoPushToken' });
  }

  try {
    let tableName;
    if (userType === 'postulante') {
      tableName = 'Postulantes';
    } else if (userType === 'empresa') {
      tableName = 'Empresas';
    } else {
      return res.status(400).json({ message: 'Tipo de usuario inválido. Debe ser "postulante" o "empresa".' });
    }

    // Actualiza el token en la base de datos para el usuario correspondiente
    const query = `UPDATE ${tableName} SET expoPushToken = ? WHERE id = ?`;
    await db.query(query, [expoPushToken, userId]);

    res.status(200).json({ message: 'Token de notificación registrado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar el token de push:', error);
    res.status(500).json({ message: 'Error interno del servidor al registrar el token de push.' });
  }
});

module.exports = router;