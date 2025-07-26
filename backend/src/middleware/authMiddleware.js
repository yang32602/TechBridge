// backend/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    console.log('--- BACKEND LOG ---');
    console.log('A. Middleware authMiddleware.js - verifyToken alcanzado.');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Espera "Bearer TOKEN"

    if (!token) {
        console.log('A.1. ERROR: Token de autenticación JWT no proporcionado en los headers.');
        return res.status(403).json({ mensaje: 'Se requiere un token para la autenticación.' });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user; // Adjunta el payload del token (userId, userType) a req.user
        console.log('A.2. Token JWT verificado exitosamente. req.user populado con:', req.user);
        next(); // Pasa el control a la siguiente función de la ruta
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
};