// Importación del modelo de usuario usando ES6
import * as usuarioModel from '../models/usuarios.model.js';
import * as empresaModel from '../models/empresas.model.js'
import * as estudiantesModel from '../models/estudiantes.model.js'
 import db from '../config/db.js'

// Obtener estudiantes
export const obtenerEstudiantes = async (req, res) => {
    const {id_empresa} = req.body
    try {
        const usuarios = await usuarioModel.getEstudiantes(id_empresa);
        res.json({ estado: 1, mensaje: 'Estudiantes obtenidos correctamente', data: usuarios });
    } catch (error) {
        res.json({ estado: 0, mensaje: 'Error al obtener los estudiantes' });
    }
};

// Obtener empresas
export const obtenerEmpresas = async(req, res) => {
    try {
        const empresas = await usuarioModel.getEmpresas();
        res.json({ estado: 1, mensaje: 'Empresas obtenidas correctamente', data: empresas });
    } catch (error) {
        res.json({ estado: 0, mensaje: 'Error al obtener las empresas' });
    }
};

// Insertar nuevo usuario
export const insertarUsuarioEstudiante = async (req, res) => {
    const { correo, nombre_completo } = req.body;
    const existe = await usuarioModel.verificarCorreoEstudiante(correo);

    if (existe) {
        return res.status(400).json({ error: 'Correo repetido' });
    }

    try {
        // Insertar usuario y obtener id
        const nuevoUsuario = await usuarioModel.insertUsuarioEstudiante(req.body);
        // Insertar estudiante usando nombre_completo
        const nuevoEstudiante = await estudiantesModel.insertEstudiante({ nombre_completo }, nuevoUsuario);
        const experiencia = await estudiantesModel.crearExperiencia(nuevoEstudiante);

        if (nuevoEstudiante && nuevoUsuario) {
            return res.json({
                estado: 1,
                mensaje: 'Usuario registrado exitosamente',
                data: nuevoUsuario,
                id_estudiante:nuevoEstudiante,
                experiencias: experiencia
            });
        }

        res.status(400).json({ error: 'Error al insertar estudiante' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ estado: 0, mensaje: 'Error al registrar el usuario' });
    }
};


export const insertarUsuarioEmpresa = async (req, res) => {
  const { correo, nombre_empresa } = req.body;

  // Validaciones básicas
  if (!correo || !nombre_empresa) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: correo, nombre y nombre_empresa son requeridos.' });
  }


  // Verificar si el correo ya existe
  const existe = await usuarioModel.verificarCorreoEmpresa(correo);
  if (existe) {
    return res.status(400).json({ error: 'Este correo ya está registrado.' });
  }

  try {
    // Inserta usuario y recupera ID
    const nuevoUsuario = await usuarioModel.insertUsuarioEmpresa(req.body);

    // Usa el ID insertado para insertar empresa
    const nuevaEmpresa = await empresaModel.insertEmpresas(req.body, nuevoUsuario);

    res.json({
      estado: 1,
      mensaje: 'Usuario y empresa registrados exitosamente',
      id_usuario: nuevoUsuario,
      id_empresa: nuevaEmpresa
    });

  } catch (error) {
    console.error('Error al registrar usuario/empresa:', error);
    res.status(500).json({ estado: 0, mensaje: 'Error al registrar: ' + error.message });
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
        const correoExiste = await usuarioModel.verificarCorreoEstudiante(correo);
        if (!correoExiste) {
            return res.json({ estado: 0, mensaje: 'El correo no existe' });
        }

        const autenticacion = await usuarioModel.usuarioContrasena(correo, contrasena);
        const id_estud = await estudiantesModel.obtenerid_estudiante(correoExiste)
        if (autenticacion) {
            return res.json({ estado: 1, mensaje: 'Inicio de sesión exitoso', id:correoExiste, id_estudiante:id_estud });
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
        const correoExiste = await usuarioModel.verificarCorreoEmpresa(correo);
        if (!correoExiste) {
            return res.json({ estado: 0, mensaje: 'El correo no existe' });
        }

        const autenticacion = await usuarioModel.usuarioContrasena(correo, contrasena);
        
        if (!autenticacion) {
            return res.json({ estado: 0, mensaje: 'La contraseña es incorrecta' });
        }

        const id_emp = await usuarioModel.buscarIDEmpresa(autenticacion.id);
        console.log("ID empresa encontrado:", id_emp);

        return res.json({ 
            estado: 1, 
            mensaje: 'Sesión iniciada correctamente', 
            id: correoExiste, 
            id_empresa: id_emp 
        });

    } catch (error) {
        console.error("Error en autenticaciónEmpresa:", error);
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
