// Importación del modelo de estudiantes usando ES6
import * as estudiantesModel from '../models/estudiantes.model.js';

// Obtener todos los estudiantes
export const getEstudiantes = async (req, res) => {
    const{id_usuario} = req.body;
    try {
        const estudiantes = await estudiantesModel.getEstudiantes(id_usuario);
        res.status(200).json({data:estudiantes});
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
};

// Insertar un nuevo estudiante
export const insertEstudiante = async (req, res) => {
    try {
        const nuevoEstudiante = await estudiantesModel.insertEstudiante(req.body);
        res.status(200).json(nuevoEstudiante);
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar al estudiante' });
    }
};

// Actualizar un campo del estudiante
export const updateCampoEstudiante = async (req, res) => {
    const { id_usuario, campo, valor } = req.body;

    if (!id_usuario || !campo) {
        return res.status(400).json({ error: 'ID y campo son requeridos' });
    }

    try {
        const resultado = await estudiantesModel.actualizarCampoEstudiante(id_usuario, campo, valor);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado o sin cambios' });
        }

        res.status(200).json({ mensaje: `Campo "${campo}" actualizado con éxito.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// EXPERIENCIAS

export const crearExperiencia = async (req, res) => {
  const { id_estudiante } = req.body;
    
  if (!id_estudiante) {
    return res.status(400).json({ estado: 0, mensaje: 'Falta id_estudiante' });
  }

  try {
    const idExperiencia = await estudiantesModel.crearExperiencia(id_estudiante);
    return res.status(201).json({
      estado: 1,
      mensaje: 'Experiencia creada exitosamente',
      idExperiencia
    });
  } catch (error) {
    console.error('Error al crear experiencia:', error);
    return res.status(500).json({ estado: 0, mensaje: 'Error al crear experiencia', error: error.message });
  }
};

export const obtenerExperienciasPorEstudiante = async (req, res) => {
  const { id_estudiante } = req.params;
  if (!id_estudiante) {
    return res.status(400).json({ estado: 0, mensaje: 'Falta id_estudiante' });
  }

  try {
    const experiencias = await estudiantesModel.obtenerExperienciasPorEstudiante(id_estudiante);
    return res.status(200).json({ estado: 1, experiencias });
  } catch (error) {
    console.error('Error al obtener experiencias:', error);
    return res.status(500).json({ estado: 0, mensaje: 'Error al obtener experiencias', error: error.message });
  }
};

export const actualizarCamposExperiencia = async (req, res) => {
  const { id_experiencia, ...campos } = req.body;

  if (!id_experiencia) {
    return res.status(400).json({
      estado: 0,
      mensaje: 'Falta el campo id_experiencia en el cuerpo de la solicitud.'
    });
  }

  try {
    const resultado = await estudiantesModel.actualizarCamposExperiencia(id_experiencia, campos);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al actualizar experiencia:', error);
    return res.status(500).json({
      estado: 0,
      mensaje: 'Error interno al actualizar experiencia.',
      error: error.message
    });
  }
};


// EDUCACION

export const crearEducacion = async (req, res) => {
  const { id_estudiante } = req.body;
  if (!id_estudiante) {
    return res.status(400).json({ estado: 0, mensaje: 'Falta id_estudiante' });
  }

  try {
    const idEducacion = await estudiantesModel.crearEducacion(id_estudiante);
    return res.status(201).json({
      estado: 1,
      mensaje: 'Educación creada exitosamente',
      idEducacion
    });
  } catch (error) {
    console.error('Error al crear educación:', error);
    return res.status(500).json({ estado: 0, mensaje: 'Error al crear educación', error: error.message });
  }
};

export const obtenerEducacionesPorEstudiante = async (req, res) => {
  const { id_estudiante } = req.params;
  if (!id_estudiante) {
    return res.status(400).json({ estado: 0, mensaje: 'Falta id_estudiante' });
  }

  try {
    const educaciones = await estudiantesModel.obtenerEducacionesPorEstudiante(id_estudiante);
    return res.status(200).json({ estado: 1, educaciones });
  } catch (error) {
    console.error('Error al obtener educación:', error);
    return res.status(500).json({ estado: 0, mensaje: 'Error al obtener educación', error: error.message });
  }
};

export const actualizarCamposEducacion = async (req, res) => {
  const { idEducacion } = req.params;
  const campos = req.body;

  if (!idEducacion) {
    return res.status(400).json({ estado: 0, mensaje: 'Falta idEducacion' });
  }

  try {
    const resultado = await estudiantesModel.actualizarCamposEducacion(idEducacion, campos);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al actualizar educación:', error);
    return res.status(500).json({ estado: 0, mensaje: 'Error al actualizar educación', error: error.message });
  }
};
