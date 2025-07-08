const usuarioModel = require('../models/usuario.model');

exports.obtenerUsuarios = async (req, res)=> {
    try{
        const usuarios = await usuarioModel.getUsuarios();
        res.status(200).json(usuarios);
    }catch(error){
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
}

//controlador para insertar usuarios
exports.insertarUsuario = async (req, res) =>{
    try{
        //le pasamos el body del json
        const nuevoUsuario = await usuarioModel.insertUsuario(req.body);
        console.log('exitosamente registrado');
        res.status(200).json(nuevoUsuario);
    }catch(error){
        res.status(500).json({error: 'Error al obtener el usuario'});
    }
}

exports.insigniaUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const insignias = await usuarioModel.getUsuariosInsignia(id_usuario);
        res.status(200).json(insignias);
        console.log('Insignias del usuario obtenidas correctamente');
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las insignias del usuario' });
    }
}


exports.autenticacionEstudiante = async(req, res) =>{
    const {correo, contrasena} = req.body;

    try{
        const correoExiste = await usuarioModel.usuarioVerificarEstudiante(correo)
        if (!correoExiste){
            return res.status(400).json({mensaje:'El correo no existe'});
        }

        const autenticacion = await usuarioModel.usuarioContrasena(correo, contrasena);

        if(autenticacion){
            return res.status(200).json({mensaje: 'Sesion Iniciada correctamente'})
        }
        else{
            return res.status(400).json({mensaje:'El contrasena incorrecta'});
        }
    }catch(error){  
           return res.status(500).json({error: `Error en la autenticacion`});
    }
}

exports.autenticacionEmpresa = async(req, res) =>{
    const {correo, contrasena} = req.body;

    try{
        const correoExiste = await usuarioModel.usuarioVerificarEmpresa(correo)
        if (!correoExiste){
            return res.status(400).json({mensaje:'El correo no existe'});
        }

        const autenticacion = await usuarioModel.usuarioContrasena(correo, contrasena);

        if(autenticacion){
            return res.status(200).json({mensaje: 'Sesion Iniciada correctamente'})
        }
        else{
            return res.status(400).json({mensaje:'El contrasena incorrecta'});
        }
    }catch(error){  
           return res.status(500).json({error: `Error en la autenticacion`});
    }
}


exports.cambioContrasenaUsuario = async(req, res) =>{
    try{
    const {correo , contrasena} = req.body;
    const correoExiste = await usuarioModel.usuarioVerificarCorreo(correo);
    if(!correoExiste) return res.status(400).json({error:'correo Invalido'});

    const cambioContrasena = await usuarioModel.usuarioCambioContrasena(contrasena, correo);
    if(contrasena.length <= 7) return res.status(400).json({mensaje: 'La contrasena debe tener almenos 8 caracteres'})
    if(cambioContrasena) return res.status(200).json({mensaje: 'cambio realizado correctamente'});

    }catch(error){
        res.status(500).json({error:`Error en el cambio de usuario`})
    }
}