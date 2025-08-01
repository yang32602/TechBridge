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
        correo: userData.correo || userData.email,
        contrasena: userData.contrasena || userData.password,
        nombre_empresa: userData.nombre_empresa || userData.companyName,
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

  // Updated to use id_empresa for consistency
  async getCompanyByUserId(userId) {
    try {
      console.log("getCompanyByUserId called with userId (now using id_empresa):", userId);
      const response = await this.request("/empresas", {
        method: "POST",
        body: JSON.stringify({ id_empresa: userId }),
      });

      console.log("getCompanyByUserId response:", response);

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

  // Get company by ID (for read-only view) - using id_empresa consistently
  async getCompanyById(companyId) {
    try {
      console.log("getCompanyById called with companyId:", companyId);
      console.log("getCompanyById request URL:", `${API_BASE_URL}/empresas`);
      console.log("getCompanyById request body:", { id_empresa: companyId });

      const url = `${API_BASE_URL}/empresas`;
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_empresa: companyId }),
      };

      console.log("getCompanyById making fetch request with config:", config);
      const fetchResponse = await fetch(url, config);
      console.log("getCompanyById fetch response status:", fetchResponse.status);
      console.log("getCompanyById fetch response headers:", Object.fromEntries(fetchResponse.headers.entries()));

      if (!fetchResponse.ok) {
        console.error(`getCompanyById HTTP error! status: ${fetchResponse.status}`);
        const errorText = await fetchResponse.text();
        console.error("getCompanyById error response text:", errorText);
        return null;
      }

      const response = await fetchResponse.json();
      console.log("getCompanyById parsed JSON response:", response);

      if (response && response.data && Array.isArray(response.data)) {
        const company = response.data.length > 0 ? response.data[0] : null;
        console.log("getCompanyById returning company:", company);
        return company;
      } else if (response && response.mensaje) {
        console.error("getCompanyById server message:", response.mensaje);
      }
      return null;
    } catch (error) {
      console.error("getCompanyById Error details:", {
        message: error.message,
        stack: error.stack,
        companyId: companyId,
        name: error.name
      });
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

  // Removed duplicate method - using the more specific implementation above

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

  // M��todo para actualizar campos individuales del estudiante
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

  async getVacanteById(idVacante) {
    try {
      console.log("getVacanteById called with:", idVacante);
      const response = await this.request("/vacantes/porID", {
        method: "POST",
        body: JSON.stringify({
          id_vacante: idVacante,
        }),
      });

      console.log("getVacanteById response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching vacante by ID:", error);
      throw error;
    }
  }

  // New methods for company postulaciones and student applied vacantes
  async getStudentsAppliedToVacante(idVacante) {
    try {
      console.log("getStudentsAppliedToVacante called with idVacante:", idVacante);
      const response = await this.request("/vacantes/estudiantes-postulados", {
        method: "POST",
        body: JSON.stringify({ id_vacante: idVacante }),
      });

      console.log("getStudentsAppliedToVacante response:", response);
      // Handle different possible response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.estudiantes)) {
        return response.estudiantes;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error("Error fetching students applied to vacante:", error);
      return [];
    }
  }

  async getStudentAppliedVacantes(idEstudiante) {
    try {
      console.log("getStudentAppliedVacantes called with idEstudiante:", idEstudiante);
      const response = await this.request("/vacantes/vacantes-postuladas", {
        method: "POST",
        body: JSON.stringify({ id_estudiante: idEstudiante }),
      });

      console.log("getStudentAppliedVacantes response:", response);
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
      console.error("Error fetching student applied vacantes:", error);
      return [];
    }
  }

  // TechPoints API methods
  async getTechPoints() {
    try {
      console.log("getTechPoints called");
      const response = await this.request("/techpoint", {
        method: "GET",
      });

      console.log("getTechPoints response:", response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Error fetching techpoints:", error);
      return [];
    }
  }

  // Puntos API methods
  async getCompanyTechPoints(idEmpresa) {
    try {
      console.log("getCompanyTechPoints called with idEmpresa:", idEmpresa);
      const response = await this.request("/puntos/puntosCantidad", {
        method: "POST",
        body: JSON.stringify({ id_empresa: idEmpresa }),
      });

      console.log("getCompanyTechPoints response:", response);
      return response.cantidad || 0;
    } catch (error) {
      console.error("Error fetching company techpoints:", error);
      return 0;
    }
  }

  // Payment API methods
  async createPaymentOrder(idEmpresa, idTechpoints) {
    try {
      console.log("createPaymentOrder called with:", { idEmpresa, idTechpoints });
      const response = await this.request("/payment/create-order", {
        method: "POST",
        body: JSON.stringify({
          id_empresa: idEmpresa,
          id_techpoints: idTechpoints,
        }),
      });

      console.log("createPaymentOrder response:", response);
      return response;
    } catch (error) {
      console.error("Error creating payment order:", error);
      throw error;
    }
  }

  // Company profile API methods - updated to use id_usuario (as per backend controller)
  async updateCompanyField(empresaId, field, value) {
    try {
      console.log("updateCompanyField called with:", { empresaId, field, value });
      const response = await this.request("/empresas/actualizar", {
        method: "PATCH",
        body: JSON.stringify({
          id_empresa: empresaId, 
          campo: field,
          valor: value,
        }),
      });

      console.log("updateCompanyField response:", response);
      return response;
    } catch (error) {
      console.error("Error updating company field:", error);
      throw error;
    }
  }

  // Badges API methods
  async getStudentBadges(userId) {
    try {
      console.log("getStudentBadges called with userId:", userId);
      const response = await this.request(`/usuarios/${userId}/estudianteInsignia`, {
        method: "GET",
      });

      console.log("getStudentBadges response:", response);
      return response.data || response || [];
    } catch (error) {
      console.error("Error fetching student badges:", error);
      return [];
    }
  }

  // Unlock applicants API methods
  async unlockStudent(idEmpresa, idEstudiante) {
    try {
      console.log("unlockStudent called with:", { idEmpresa, idEstudiante });
      const response = await this.request("/empresa-estudiante/desbloquearEstudiante", {
        method: "POST",
        body: JSON.stringify({
          id_empresa: idEmpresa,
          id_estudiante: idEstudiante,
        }),
      });

      console.log("unlockStudent response:", response);
      return response;
    } catch (error) {
      console.error("Error unlocking student:", error);
      throw error;
    }
  }

  async spendPoints(idEmpresa, puntos) {
    try {
      console.log("spendPoints called with:", { idEmpresa, puntos });
      const response = await this.request("/puntos/puntosGastos", {
        method: "POST",
        body: JSON.stringify({
          id_empresa: idEmpresa,
          puntos: puntos,
        }),
      });

      console.log("spendPoints response:", response);
      return response;
    } catch (error) {
      console.error("Error spending points:", error);
      throw error;
    }
  }

  // Badge/Insignia API methods
  async assignBadgeToStudent(idUsuario, idInsignia) {
    try {
      console.log("assignBadgeToStudent called with:", { idUsuario, idInsignia });
      const response = await this.request("/insignias/insignias-estudiante", {
        method: "POST",
        body: JSON.stringify({
          id_usuario: idUsuario,
          id_insignia: idInsignia,
        }),
      });

      console.log("assignBadgeToStudent response:", response);
      return response;
    } catch (error) {
      console.error("Error assigning badge to student:", error);
      throw error;
    }
  }
}

export default new ApiService();
