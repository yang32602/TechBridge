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
      body: JSON.stringify({
        correo: userData.email,
        contrasena: userData.password,
        nombre: userData.fullName,
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
}

export default new ApiService();
