import * as vacanteModel from '../models/vacantes.model.js'

//obtener vacantes
export const obtenerVacantesPorUsuario = async (req, res) => {
  const { id_empresa } = req.body;

  if (!id_empresa) {
    return res.status(400).json({ estado: 0, mensaje: 'Falta id_empresa' });
  }

  try {
    const resultado = await vacanteModel.obtenerVacantesPorIDEmpesa(id_empresa);
    
    const nombre_empresa = resultado.length > 0 ? resultado[0].nombre_empresa : null;

    return res.status(200).json({ estado: 1, empresa: nombre_empresa, vacantes: resultado });
  } catch (error) {
    return res.status(500).json({ estado: 0, mensaje: error.message });
  }
};


//obtiene las vacantes y verifica que el estudiante este postulado o no
export const obtenerVacantesConEstadoDePostulacion = async (req, res) => {
  try {
    const { id_usuario } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: 'El campo id_usuario es obligatorio' });
    }

    const vacantes = await vacanteModel.obtenerVacantesConPostulacion(id_usuario);
    res.json(vacantes);
  } catch (error) {
    console.error('Error al obtener vacantes:', error);
    res.status(500).json({ error: 'Error del servidor al obtener vacantes' });
  }
};

export const postulacionVacante = async (req, res) => {
  const { id_usuario, id_vacante } = req.body;

  if (!id_usuario || !id_vacante) {
    return res.status(400).json({ estado: 0, mensaje: 'Falta id_usuario o id_vacante' });
  }

  try {
    const idPostulacion = await vacanteModel.postulacionVacante(id_usuario, id_vacante);
    return res.status(200).json({
      estado: 1,
      mensaje: 'Postulación exitosa',
      id: idPostulacion
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ estado: 0, mensaje: 'Error al postular' });
  }
};

//Controlador para crear una nueva vacante
export const crearVacante = async (req, res) => {
    const { id_empresa, titulo, descripcion, ubicacion } = req.body;

    if (!id_empresa || !titulo || !descripcion || !ubicacion) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios para crear la vacante.' });
    }

    try {
        const nuevaVacanteId = await vacanteModel.insertVacante(
            { titulo, descripcion, ubicacion },
            id_empresa
        );

        res.status(201).json({
            mensaje: 'Vacante creada exitosamente.',
            id_vacante: nuevaVacanteId
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la vacante.', error: error.message });
    }
};

export const actualizarCampoVacante = async (req, res) => {
  const { id_vacante, campo, valor } = req.body;

  if (!id_vacante || !campo || valor === undefined) {
    return res.status(400).json({
      estado: 0,
      mensaje: 'Faltan datos requeridos: id_vacante, campo o valor.'
    });
  }

  try {
    const resultado = await vacanteModel.actualizarCampoVacante(id_vacante, campo, valor);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al actualizar vacante:', error);
    return res.status(500).json({
      estado: 0,
      mensaje: error.message || 'Error al actualizar vacante'
    });
  }
};

//controller de eliminar vacante
export const eliminarVacanteController = async (req, res) => {
  const { id_vacante } = req.body;

  if (!id_vacante) {
    return res.status(400).json({ estado: 0, mensaje: 'Falta id_vacante en la solicitud' });
  }

  try {
    const resultado = await vacanteModel.eliminarVacante(id_vacante);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ estado: 0, mensaje: error.message });
  }
};

export const obtenerVacantePorID = async (req, res) => {
  const { id_vacante } = req.body;

  try {
    const data = await vacanteModel.vacantePorID(id_vacante);

    if (data) {
      res.json({
        estado: 1,
        mensaje: "Vacante obtenida correctamente",
        data
      });
    } else {
      res.json({
        estado: 0,
        mensaje: "No se encontró ninguna vacante con ese ID"
      });
    }

  } catch (error) {
    res.status(500).json({
      estado: 0,
      mensaje: "Error al obtener la vacante",
      error: error.message
    });
  }
};

export const obtenerVacantePorEmpresa = async (req, res) => {
  const { id_usuario } = req.body;

  try {
    const data = await vacanteModel.vacantePorEmpresa(id_usuario);

    if (data) {
      res.json({
        estado: 1,
        mensaje: "Vacante obtenida correctamente",
        data
      });
    } else {
      res.json({
        estado: 0,
        mensaje: "No se encontró ninguna vacante con ese ID"
      });
    }

  } catch (error) {
    res.status(500).json({
      estado: 0,
      mensaje: "Error al obtener la vacante",
      error: error.message
    });
  }
};

export const mostrarPostuladosPorVacante = async (req, res) => {
  try {
    const { id_vacante } = req.body;

    if (!id_vacante) {
      return res.status(400).json({ mensaje: 'El id_vacante es requerido' });
    }

    const postulados = await vacanteModel.obtenerPostuladosPorVacante(id_vacante);

    res.json(postulados);
  } catch (error) {
    console.error('Error al obtener los postulados:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export const getVacantesPostuladas = async (req, res) => {
  try {
    const { id_estudiante } = req.body;

    if (!id_estudiante) {
      return res.status(400).json({ mensaje: "Falta el id_estudiante en el body" });
    }

    const vacantes = await vacanteModel.obtenerVacantesPostuladasPorEstudiante(id_estudiante);

    res.status(200).json(vacantes);
  } catch (error) {
    console.error("Error al obtener vacantes postuladas:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

