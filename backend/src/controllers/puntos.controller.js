import * as puntosModel from '../models/puntos.model.js';

export const cantidadPuntos = async (req,res) =>{
    const {id_empresa} = req.body
    try {
        if(!id_empresa){
            return res.status(400).json({mensaje:"id_empresa Vacio"})
        }
        const cantPuntos = await puntosModel.cantidadPuntos(id_empresa);
        if(cantPuntos){
            return res.status(200).json({cantidad:cantPuntos})
        }
    } catch (error) {
        
    }
}