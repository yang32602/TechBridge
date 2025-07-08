estudiantesModel = require('../models/estudiantes.model');

exports.getEstudiantes = async (req, res) => {
    try{

        const estudiantes = await estudiantesModel.getEstudiantes();
        res.status(200).json(estudiantes);
        
    }catch (error) {
        res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
}

exports.insertEstudiante = async(req, res)=>{
    try{
        
        const insertar = await estudiantesModel.insertEstudiante(req.body)
        res.status(200).json(insertar)

    }catch(error){
        res.status(500).json({ error: 'Error al insertar al estudiantes' });
    }

}
