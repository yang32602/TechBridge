import * as empresaEstudianteModel from '../models/empresaEstudiante.model.js';

export const insertEmpresaEstudiante = async(req,res) =>{
    const {id_empresa, id_estudiante} = req.body;
    try {
        const response = await empresaEstudianteModel.insertEmpresaEstudiante(id_empresa,id_estudiante);

        if(response){
            return res.status(200).json({estado:1, mensaje: 'insertado correctamente', data: response });
        }
        return res.status(400).json({estado:0, mensaje: 'insertado incorrectamente', data: null });
    } catch (error) {
        res.status(500).json( {error:'error al insertar'} );
    }
}