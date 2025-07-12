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
      const students = await this.getStudents();
      if (students && Array.isArray(students)) {
        // Match by id_usuario field in estudiantes endpoint
        const student = students.find(
          (student) => student.id_usuario === userId,
        );
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
      const companies = await this.getCompanies();
      if (companies && Array.isArray(companies)) {
        // Match by id_usuario field in empresas endpoint
        const company = companies.find(
          (company) => company.id_usuario === userId,
        );
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
}

export default new ApiService();
