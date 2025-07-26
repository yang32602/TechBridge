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

// Obtener detalle completo de estudiante por ID
export const obtenerDetalleEstudiante = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Falta el ID del estudiante' });
  }
  try {
    // Obtener datos básicos del estudiante
    const estudiante = await estudiantesModel.getEstudianteById(id);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Obtener experiencia y educación
    const experiencia = await estudiantesModel.obtenerExperienciasPorEstudiante(id);
    const educacion = await estudiantesModel.obtenerEducacionesPorEstudiante(id);

    // Obtener insignias (badges)
    const insignias = await estudiantesModel.obtenerInsigniasPorUsuario(estudiante.id_usuario);

    // Construir respuesta
    const detalle = {
      ...estudiante,
      experiencia,
      educacion,
      insignias,
    };

    return res.status(200).json(detalle);
  } catch (error) {
    console.error('Error en getDetalleEstudiante:', error);
    return res.status(500).json({ error: 'Error al obtener detalle del estudiante' });
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

export const actualizarCampoExperiencia = async (req, res) => {
  const { campo, valor, id_experiencia } = req.body;

  if (!campo || !valor || !id_experiencia) {
    return res.status(400).json({ error: "Faltan datos: 'campo', 'valor' e 'id_experiencia' son obligatorios." });
  }

  try {
    const resultado = await estudiantesModel.actualizarCampoExperiencia(campo, valor, { id_experiencia });
    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al actualizar experiencia:', error);
    return res.status(500).json({ error: error.message });
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

// Actualizar campo específico en educación
export const actualizarCampoEducacion = async (req, res) => {
  const { campo, valor, id_educacion } = req.body;

  if (!campo || valor === undefined || !id_educacion) {
    return res.status(400).json({ estado: 0, mensaje: 'Faltan datos requeridos: campo, valor o id_educacion.' });
  }

  try {
    const resultado = await estudiantesModel.actualizarCampoEducacion(campo, valor, { id_educacion });
    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al actualizar educación:', error);
    return res.status(500).json({ estado: 0, mensaje: error.message });
  }
};




export const eliminarExperienciaController = async (req, res) => {
    const { id_experiencia } = req.body;

    if (!id_experiencia) {
        return res.status(400).json({ error: "Falta el id_experiencia en el cuerpo de la solicitud" });
    }

    try {
        const resultado = await estudiantesModel.eliminarExperiencia(id_experiencia);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarEducacionController = async (req, res) => {
    const { id_educacion } = req.body;

    if (!id_educacion) {
        return res.status(400).json({ error: "Falta el id_educacion en el cuerpo de la solicitud" });
    }

    try {
        const resultado = await estudiantesModel.eliminarEducacion(id_educacion);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

