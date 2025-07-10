// Importación del modelo de usuario usando ES6
import * as usuarioModel from '../models/usuario.model.js';

// Obtener estudiantes
export const obtenerEstudiantes = async (req, res) => {
    try {
        const usuarios = await usuarioModel.getUsuariosEstudiantes();
        res.json({ estado: 1, mensaje: 'Estudiantes obtenidos correctamente', data: usuarios });
    } catch (error) {
        res.json({ estado: 0, mensaje: 'Error al obtener los estudiantes' });
    }
}; 

// Obtener empresas
export const obtenerEmpresas = async(req, res) => {
    try {
        const empresas = await usuarioModel.getUsuariosEmpresas();
        res.json({ estado: 1, mensaje: 'Empresas obtenidas correctamente', data: empresas });
    } catch (error) {
        res.json({ estado: 0, mensaje: 'Error al obtener las empresas' });
    }
};

// Insertar nuevo usuario
export const insertarUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await usuarioModel.insertUsuario(req.body);
        res.json({ estado: 1, mensaje: 'Usuario registrado exitosamente', data: nuevoUsuario });
    } catch (error) {
        res.json({ estado: 0, mensaje: 'Error al registrar el usuario' });
    }
};

// Obtener insignias de usuario
export const insigniaUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const insignias = await usuarioModel.getUsuariosInsignia(id_usuario);
        res.json({ estado: 1, mensaje: 'Insignias del usuario obtenidas correctamente', data: insignias });
    } catch (error) {
        res.json({ estado: 0, mensaje: 'Error al obtener las insignias del usuario' });
    }
};

// Autenticación de estudiante
export const autenticacionEstudiante = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const correoExiste = await usuarioModel.usuarioVerificarEstudiante(correo);
        if (!correoExiste) {
            return res.json({ estado: 0, mensaje: 'El correo no existe' });
        }

        const autenticacion = await usuarioModel.usuarioContrasena(correo, contrasena);

        if (autenticacion) {
            return res.json({ estado: 1, mensaje: 'Inicio de sesión exitoso' });
        } else {
            return res.json({ estado: 0, mensaje: 'La contraseña es incorrecta' });
        }
    } catch (error) {
        return res.json({ estado: 0, mensaje: 'Error en la autenticación del estudiante' });
    }
};

// Autenticación de empresa
export const autenticacionEmpresa = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const correoExiste = await usuarioModel.usuarioVerificarEmpresa(correo);
        if (!correoExiste) {
            return res.json({ estado: 0, mensaje: 'El correo no existe' });
        }

        const autenticacion = await usuarioModel.usuarioContrasena(correo, contrasena);

        if (autenticacion) {
            return res.json({ estado: 1, mensaje: 'Sesión iniciada correctamente' });
        } else {
            return res.json({ estado: 0, mensaje: 'La contraseña es incorrecta' });
        }
    } catch (error) {
        return res.json({ estado: 0, mensaje: 'Error en la autenticación de empresa' });
    }
};

// Cambio de contraseña de usuario
export const cambioContrasenaUsuario = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (contrasena.length <= 7) {
            return res.json({ estado: 0, mensaje: 'La contraseña debe tener al menos 8 caracteres' });
        }

        const correoExiste = await usuarioModel.usuarioVerificarCorreo(correo);
        if (!correoExiste) {
            return res.json({ estado: 0, mensaje: 'Correo inválido' });
        }

        const cambioContrasena = await usuarioModel.usuarioCambioContrasena(contrasena, correo);
        if (cambioContrasena) {
            return res.json({ estado: 1, mensaje: 'Cambio de contraseña realizado correctamente' });
        }

        return res.json({ estado: 0, mensaje: 'No se pudo actualizar la contraseña' });

    } catch (error) {
        res.json({ estado: 0, mensaje: 'Error en el cambio de contraseña' });
    }
};
