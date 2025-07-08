const { json } = require('sequelize');
const empresaModel = require('../models/empresa.model');

exports.getEmpresas = async (req, res) =>{
    try{
        const empresas = await empresaModel.getEmpresas();
        if(empresas) return res.status(200).json(empresas);
    }catch(error){
        return res.status(500).json({mensjae: 'error al traer las empresas'});
    }
}

exports.insertEmpresa = async(req, res) =>{
    try{
        const insertEmpresa = await empresaModel.insertEmpresas(req.body);
        res.status(200).json(insertEmpresa)
    }catch(error){
        res.status(500).json('error al insertar la empresa');
    }
}

exports.reclutarEstudiante = async (req, res)=>{
    try {
        const {id_empresa, id_estudiante} = req.body
        
        if (!id_empresa || !id_estudiante) {
            return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        }
        
        const reclutamiento = empresaModel.reclutarEstudiante(id_empresa, id_estudiante);

        if (reclutamiento) {
            return res.status(200).json({ mensaje: 'Reclutamiento exitoso' });
        } else {
            return res.status(400).json({ mensaje: 'No se pudo reclutar al estudiante' });
        }
    } catch (error) {
        res.status(500).json({error: 'Hubo un error al reclutar'});
    }
}