const API_BASE_URL = "http://localhost:3000/api";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  async registerStudent(userData) {
    return this.request("/usuarios/estudianteRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: userData.email,
        contrasena: userData.password,
        nombre_completo: userData.fullName,
      }),
    });
  }

  async registerCompany(userData) {
    return this.request("/usuarios/empresaRegister", {
      method: "POST",
      body: JSON.stringify({
        correo: userData.email,
        contrasena: userData.password,
        nombre: userData.companyName,
        ruc: userData.ruc,
      }),
    });
  }

  async loginStudent(credentials) {
    return this.request("/usuarios/estudianteLogin", {
      method: "POST",
      body: JSON.stringify({
        correo: credentials.email,
        contrasena: credentials.password,
      }),
    });
  }

  async loginCompany(credentials) {
    return this.request("/usuarios/empresaLogin", {
      method: "POST",
      body: JSON.stringify({
        correo: credentials.email,
        contrasena: credentials.password,
      }),
    });
  }

  async getCompanies() {
    try {
      const response = await fetch(`${API_BASE_URL}/empresas`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching companies:", error);
      return [];
    }
  }

  async getStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/estudiantes`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  }

  async getStudentByUserId(userId) {
    try {
      console.log("getStudentByUserId called with userId:", userId);
      const response = await this.request("/estudiantes", {
        method: "POST",
        body: JSON.stringify({ id_usuario: userId }),
      });

      console.log("getStudentByUserId response:", response);

      // TODO: 将来在后端添加更多字段时，在此处同步添加新字段处理
      // 例如: linkedin, telefono, portafolio_url, direccion, habilidades_adicionales 等
      if (response && response.data && Array.isArray(response.data)) {
        const student = response.data.length > 0 ? response.data[0] : null;
        console.log("getStudentByUserId returning:", student);
        return student;
      }
      return null;
    } catch (error) {
      console.error("Error fetching student by user ID:", error);
      return null;
    }
  }

  async getCompanyByUserId(userId) {
    try {
      console.log("getCompanyByUserId called with userId:", userId);
      const response = await this.request("/empresas", {
        method: "POST",
        body: JSON.stringify({ id_usuario: userId }),
      });

      console.log("getCompanyByUserId response:", response);

      // TODO: 将来在后端添加更多字段时，在此处同步添加新字段处理
      // 例如: linkedin, telefono, sitio_web, direccion, tamaño_empresa 等
      if (response && response.data && Array.isArray(response.data)) {
        const company = response.data.length > 0 ? response.data[0] : null;
        console.log("getCompanyByUserId returning:", company);
        return company;
      }
      return null;
    } catch (error) {
      console.error("Error fetching company by user ID:", error);
      return null;
    }
  }

  async getCompanyByEmail() {
    try {
      // For backward compatibility - try to get first company
      const companies = await this.getCompanies();
      if (Array.isArray(companies)) {
        return companies.length > 0 ? companies[0] : null;
      }
      return null;
    } catch (error) {
      console.error("Error fetching company by email:", error);
      return null;
    }
  }

  async getStudentByEmail() {
    try {
      // For backward compatibility - try to get first student
      const students = await this.getStudents();
      if (Array.isArray(students)) {
        return students.length > 0 ? students[0] : null;
      }
      return null;
    } catch (error) {
      console.error("Error fetching student by email:", error);
      return null;
    }
  }

  async getStudentById(usuarioId) {
    try {
      const students = await this.getStudents();
      if (students && Array.isArray(students)) {
        // Match by id_usuario field in estudiantes endpoint
        return students.find((student) => student.id_usuario === usuarioId);
      }
      return null;
    } catch (error) {
      console.error("Error fetching student by ID:", error);
      return null;
    }
  }

  async getCompanyById(usuarioId) {
    try {
      const companies = await this.getCompanies();
      if (companies && Array.isArray(companies)) {
        // Match by id_usuario field in empresas endpoint
        return companies.find((company) => company.id_usuario === usuarioId);
      }
      return null;
    } catch (error) {
      console.error("Error fetching company by ID:", error);
      return null;
    }
  }

  async getCompanyApplicants(companyId) {
    try {
      console.log("getCompanyApplicants called with companyId:", companyId);
      const response = await this.request("/usuarios/estudiantes", {
        method: "POST",
        body: JSON.stringify({ id_empresa: companyId }),
      });

      console.log("getCompanyApplicants response:", response);

      // Handle the response format: {estado: 1, mensaje: '...', data: Array}
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response && Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error("Error fetching company applicants:", error);
      return [];
    }
  }

  async getStudentBadges(studentId) {
    try {
      console.log("getStudentBadges called with studentId:", studentId);
      const response = await this.request(
        `/usuarios/${studentId}/estudianteInsignia`,
        {
          method: "GET",
        },
      );

      console.log("getStudentBadges response:", response);

      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching student badges:", error);
      return [];
    }
  }

  // Método para actualizar campos individuales del estudiante
  // TODO: Para agregar nuevos campos editables en el futuro:
  // 1. Agregar el campo a la lista de campos editables en el componente EditProfileModal
  // 2. Asegurar que el backend maneje el nuevo campo en la ruta PATCH /estudiantes/actualizar
  // 3. No es necesario modificar este método ya que es genérico
  async updateStudentField(userId, field, value) {
    try {
      console.log("updateStudentField called with:", { userId, field, value });
      const response = await this.request("/estudiantes/actualizar", {
        method: "PATCH",
        body: JSON.stringify({
          id_usuario: userId,
          campo: field,
          valor: value,
        }),
      });

      console.log("updateStudentField response:", response);
      return response;
    } catch (error) {
      console.error("Error updating student field:", error);
      throw error;
    }
  }

  // Métodos para manejar experiencias de estudiantes
  async getStudentExperiences(idEstudiante) {
    try {
      console.log(
        "getStudentExperiences called with idEstudiante:",
        idEstudiante,
      );
      const response = await this.request(
        `/estudiantes/experiencias/${idEstudiante}`,
        {
          method: "GET",
        },
      );

      console.log("getStudentExperiences response:", response);
      // Backend returns { estado: 1, experiencias: [...] }
      if (
        response &&
        response.experiencias &&
        Array.isArray(response.experiencias)
      ) {
        return response.experiencias;
      }
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Error fetching student experiences:", error);
      return [];
    }
  }

  async addStudentExperience(idEstudiante) {
    try {
      console.log(
        "addStudentExperience called with idEstudiante:",
        idEstudiante,
      );
      const response = await this.request("/estudiantes/experiencias", {
        method: "POST",
        body: JSON.stringify({
          id_estudiante: idEstudiante,
        }),
      });

      console.log("addStudentExperience response:", response);
      return response;
    } catch (error) {
      console.error("Error adding student experience:", error);
      throw error;
    }
  }

  async updateStudentExperience(idExperiencia, campo, valor) {
    try {
      console.log("updateStudentExperience called with:", {
        idExperiencia,
        campo,
        valor,
      });
      const response = await this.request("/estudiantes/experiencias", {
        method: "PATCH",
        body: JSON.stringify({
          campo: campo,
          valor: valor,
          id_experiencia: idExperiencia,
        }),
      });

      console.log("updateStudentExperience response:", response);
      return response;
    } catch (error) {
      console.error("Error updating student experience:", error);
      throw error;
    }
  }

  async deleteStudentExperience(idExperiencia) {
    try {
      console.log("deleteStudentExperience called with:", idExperiencia);
      const response = await this.request("/estudiantes/experiencia", {
        method: "DELETE",
        body: JSON.stringify({
          id_experiencia: idExperiencia,
        }),
      });

      console.log("deleteStudentExperience response:", response);
      return response;
    } catch (error) {
      console.error("Error deleting student experience:", error);
      throw error;
    }
  }

  // Education API methods
  async getStudentEducation(idEstudiante) {
    try {
      console.log(
        "getStudentEducation called with idEstudiante:",
        idEstudiante,
      );
      const response = await this.request(
        `/estudiantes/educacion/${idEstudiante}`,
        {
          method: "GET",
        },
      );

      console.log("getStudentEducation response:", response);
      // Backend returns { estado: 1, educaciones: [...] }
      if (
        response &&
        response.educaciones &&
        Array.isArray(response.educaciones)
      ) {
        return response.educaciones;
      }
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Error fetching student education:", error);
      return [];
    }
  }

  async addStudentEducation(idEstudiante) {
    try {
      console.log(
        "addStudentEducation called with idEstudiante:",
        idEstudiante,
      );
      const response = await this.request("/estudiantes/educacion", {
        method: "POST",
        body: JSON.stringify({
          id_estudiante: idEstudiante,
        }),
      });

      console.log("addStudentEducation response:", response);
      return response;
    } catch (error) {
      console.error("Error adding student education:", error);
      throw error;
    }
  }

  async updateStudentEducation(idEducacion, campo, valor) {
    try {
      console.log("updateStudentEducation called with:", {
        idEducacion,
        campo,
        valor,
      });
      const response = await this.request("/estudiantes/educacion", {
        method: "PATCH",
        body: JSON.stringify({
          campo: campo,
          valor: valor,
          id_educacion: idEducacion,
        }),
      });

      console.log("updateStudentEducation response:", response);
      return response;
    } catch (error) {
      console.error("Error updating student education:", error);
      throw error;
    }
  }

  async deleteStudentEducation(idEducacion) {
    try {
      console.log("deleteStudentEducation called with:", idEducacion);
      const response = await this.request("/estudiantes/educacion", {
        method: "DELETE",
        body: JSON.stringify({
          id_educacion: idEducacion,
        }),
      });

      console.log("deleteStudentEducation response:", response);
      return response;
    } catch (error) {
      console.error("Error deleting student education:", error);
      throw error;
    }
  }

  // Vacantes API methods
  async getVacantesForStudent(idUsuario) {
    try {
      console.log("getVacantesForStudent called with idUsuario:", idUsuario);
      const response = await this.request("/vacantes/", {
        method: "POST",
        body: JSON.stringify({ id_usuario: idUsuario }),
      });

      console.log("getVacantesForStudent response:", response);
      // Handle different possible response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.vacantes)) {
        return response.vacantes;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error("Error fetching vacantes for student:", error);
      return [];
    }
  }

  async getVacantesForCompany(idEmpresa) {
    try {
      console.log("getVacantesForCompany called with idEmpresa:", idEmpresa);
      const response = await this.request("/vacantes/empresas", {
        method: "POST",
        body: JSON.stringify({ id_empresa: idEmpresa }),
      });

      console.log("getVacantesForCompany response:", response);
      // Handle different possible response formats
      if (Array.isArray(response.vacantes)) {
        return response.vacantes;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error("Error fetching vacantes for company:", error);
      return [];
    }
  }

  async postularVacante(idUsuario, idVacante) {
    try {
      console.log("postularVacante called with:", { idUsuario, idVacante });
      const response = await this.request("/vacantes/postular", {
        method: "POST",
        body: JSON.stringify({
          id_usuario: idUsuario,
          id_vacante: idVacante
        }),
      });

      console.log("postularVacante response:", response);
      return response;
    } catch (error) {
      console.error("Error applying to vacante:", error);
      throw error;
    }
  }

  async createVacante(idEmpresa, titulo, descripcion, ubicacion) {
    try {
      console.log("createVacante called with:", { idEmpresa, titulo, descripcion, ubicacion });
      const response = await this.request("/vacantes/crearVacante", {
        method: "POST",
        body: JSON.stringify({
          id_empresa: idEmpresa,
          titulo: titulo,
          descripcion: descripcion,
          ubicacion: ubicacion,
        }),
      });

      console.log("createVacante response:", response);
      return response;
    } catch (error) {
      console.error("Error creating vacante:", error);
      throw error;
    }
  }

  async updateVacante(idVacante, campo, valor) {
    try {
      console.log("updateVacante called with:", { idVacante, campo, valor });
      const response = await this.request("/vacantes/actualizarVacante", {
        method: "PATCH",
        body: JSON.stringify({
          id_vacante: idVacante,
          campo: campo,
          valor: valor,
        }),
      });

      console.log("updateVacante response:", response);
      return response;
    } catch (error) {
      console.error("Error updating vacante:", error);
      throw error;
    }
  }

  async deleteVacante(idVacante) {
    try {
      console.log("deleteVacante called with:", idVacante);
      const response = await this.request("/vacantes/eliminar", {
        method: "DELETE",
        body: JSON.stringify({
          id_vacante: idVacante,
        }),
      });

      console.log("deleteVacante response:", response);
      return response;
    } catch (error) {
      console.error("Error deleting vacante:", error);
      throw error;
    }
  }
}

export default new ApiService();
