// Importación del modelo de usuario usando ES6
import * as usuarioModel from '../models/usuario.model.js';

// Obtener usuarios
export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.getUsuariosEstudiantes();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
}; 

export const obtenerEmpresas = async(req, res) =>{
    try {
        const empresas = await usuarioModel.getUsuariosEmpresas();
        res.status(200).json(empresas)
    } catch (error) {
        res.status(500).json({mensaje:'Error al obtener las empresas'})
    }
}

// Insertar nuevo usuario
export const insertarUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await usuarioModel.insertUsuario(req.body);
        console.log('Usuario registrado exitosamente');
        res.status(200).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// Obtener insignias de usuario
export const insigniaUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const insignias = await usuarioModel.getUsuariosInsignia(id_usuario);
        console.log('Insignias del usuario obtenidas correctamente');
        res.status(200).json(insignias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las insignias del usuario' });
    }
};

// Autenticación de estudiante
export const autenticacionEstudiante = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const correoExiste = await usuarioModel.usuarioVerificarEstudiante(correo);
        if (!correoExiste) {
            return res.status(400).json({ mensaje: 'El correo no existe' });
        }

        const autenticacion = await usuarioModel.usuarioContrasena(correo, contrasena);

        if (autenticacion) {
            return res.status(200).json({ mensaje: 'Sesión iniciada correctamente' });
        } else {
            return res.status(400).json({ mensaje: 'La contraseña es incorrecta' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la autenticación' });
    }
};

// Autenticación de empresa
export const autenticacionEmpresa = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const correoExiste = await usuarioModel.usuarioVerificarEmpresa(correo);
        if (!correoExiste) {
            return res.status(400).json({ mensaje: 'El correo no existe' });
        }

        const autenticacion = await usuarioModel.usuarioContrasena(correo, contrasena);

        if (autenticacion) {
            return res.status(200).json({ mensaje: 'Sesión iniciada correctamente' });
        } else {
            return res.status(400).json({ mensaje: 'La contraseña es incorrecta' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error en la autenticación' });
    }
};

// Cambio de contraseña de usuario
export const cambioContrasenaUsuario = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (contrasena.length <= 7) {
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres' });
        }

        const correoExiste = await usuarioModel.usuarioVerificarCorreo(correo);
        if (!correoExiste) {
            return res.status(400).json({ error: 'Correo inválido' });
        }

        const cambioContrasena = await usuarioModel.usuarioCambioContrasena(contrasena, correo);
        if (cambioContrasena) {
            return res.status(200).json({ mensaje: 'Cambio realizado correctamente' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error en el cambio de contraseña' });
    }
};


