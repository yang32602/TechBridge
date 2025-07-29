import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StudentSidebar } from "../components";
import {
  HiFilter,
  HiStar,
  HiDotsHorizontal,
  HiChevronLeft,
  HiChevronRight,
  HiSearch,
  HiX,
  HiClock,
  HiClipboardList,
  HiBadgeCheck,
} from "react-icons/hi";
import "../assets/technical-tests.css";

const TechnicalTests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const handleTestClick = (testId) => {
    const test = technicalTests.find(t => t.id === testId);
    setSelectedTest(test);
    setShowModal(true);
  };

  const handleStartTest = () => {
    setShowModal(false);
    navigate(`/technical-test-quiz/${selectedTest.id}`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTest(null);
  };

  const technicalTests = [
    {
      id: 1,
      title: "JavaScript Básico",
      icon: "📗",
      language: "JavaScript",
      score: "8.0",
      date: "24 July, 2025",
      difficulty: "Básico",
      points: "100 pts",
      duration: "20 minutos",
      questionCount: 10,
      badgeName: "JavaScript Básico",
      description: "Evalúa conocimientos básicos de JavaScript incluyendo variables, funciones y sintaxis fundamental."
    },
    {
      id: 2,
      title: "Frontend - Básico",
      icon: "🎨",
      language: "Frontend",
      score: "8.0",
      date: "24 July, 2025",
      difficulty: "Básico",
      points: "100 pts",
      duration: "20 minutos",
      questionCount: 10,
      badgeName: "Frontend Básico",
      description: "Cubre HTML, CSS y conceptos básicos de desarrollo frontend."
    },
    {
      id: 3,
      title: "React Avanzado",
      icon: "⚛️",
      language: "React",
      score: "8.0", 
      date: "24 July, 2025",
      difficulty: "Avanzado",
      points: "100 pts",
      duration: "20 minutos",
      questionCount: 10,
      badgeName: "React Avanzado",
      description: "Examina conceptos avanzados de React como hooks, context, y optimización."
    },
    {
      id: 4,
      title: "Desarrollo API Node.js",
      icon: "🟢",
      language: "Node.js",
      score: "8.0",
      date: "24 July, 2025",
      difficulty: "Intermedio",
      points: "100 pts",
      duration: "20 minutos",
      questionCount: 10,
      badgeName: "Node.js API",
      description: "Evalúa habilidades en desarrollo de APIs con Node.js y Express."
    },
    {
      id: 5,
      title: "Programación Python Básica",
      icon: "🐍",
      language: "Python",
      score: "8.0",
      date: "24 July, 2025",
      difficulty: "Básico",
      points: "100 pts",
      duration: "20 minutos",
      questionCount: 10,
      badgeName: "Python Básico",
      description: "Fundamentos de programación en Python incluyendo sintaxis y estructuras de datos."
    },
    {
      id: 6,
      title: "Diseño de Base de Datos SQL",
      icon: "🗃️",
      language: "SQL",
      score: "8.0",
      date: "24 July, 2025",
      difficulty: "Intermedio",
      points: "100 pts",
      duration: "20 minutos",
      questionCount: 10,
      badgeName: "SQL",
      description: "Evalúa conocimientos de diseño de bases de datos relacionales y consultas SQL."
    },
    {
      id: 7,
      title: "Algoritmos y Estructuras de Datos",
      icon: "🔢",
      language: "Algoritmos",
      score: "8.0",
      date: "24 July, 2025",
      difficulty: "Avanzado",
      points: "100 pts",
      duration: "20 minutos",
      questionCount: 10,
      badgeName: "Algoritmos",
      description: "Examina comprensión de algoritmos fundamentales y estructuras de datos."
    },
    {
      id: 8,
      title: "Seguridad Web Básica",
      icon: "🔒",
      language: "Seguridad",
      score: "8.0",
      date: "24 July, 2025",
      difficulty: "Intermedio",
      points: "100 pts",
      duration: "20 minutos",
      questionCount: 10,
      badgeName: "Seguridad Web",
      description: "Cubre conceptos básicos de seguridad web y mejores prácticas."
    },
  ];

  const filteredTests = technicalTests.filter(
    (test) =>
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.language.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="technical-tests-container">
      {/* Sidebar Unificado */}
      <StudentSidebar activeSection="technical-tests" />

      {/* Main Content */}
      <div className="technical-tests-main">
        {/* Header */}
        <div className="technical-tests-header">
          <div className="tests-header-content">
            <h1>Pruebas Técnicas</h1>
            <div className="tests-header-controls">
              <div className="tests-search-container">
                <div className="tests-search-input">
                  <HiSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar pruebas"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="tests-filter-btn">
                  <HiFilter />
                  <span>Filtrar</span>
                </button>
              </div>             
            </div>
          </div>
        </div>

        {/* Tests Table */}
        <div className="technical-tests-content">
          <div className="tests-table-container">
            {/* Table Header */}
            <div className="tests-table-header">
              <div className="tests-header-cell tests-title-header">
                <span>Título</span>
                <HiChevronRight className="sort-icon" />
              </div>
              <div className="tests-header-cell tests-score-header">
                <span>Puntuación</span>
                <HiChevronRight className="sort-icon" />
              </div>
              <div className="tests-header-cell tests-language-header">
                <span>Lenguaje</span>
                <HiChevronRight className="sort-icon" />
              </div>
              <div className="tests-header-cell tests-date-header">
                <span>Fecha de Publicación</span>
                <HiChevronRight className="sort-icon" />
              </div>
              <div className="tests-header-cell tests-action-header">
                <span>Acción</span>
                <HiChevronRight className="sort-icon" />
              </div>
            </div>

            {/* Table Body */}
            <div className="tests-table-body">
              {filteredTests.map((test) => (
                <div key={test.id} className="tests-table-row">
                  <div className="tests-cell tests-title-cell">
                    <div className="test-title-content">
                      <div className="test-icon">{test.icon}</div>
                      <span className="test-title">{test.title}</span>
                    </div>
                  </div>
                  <div className="tests-cell tests-score-cell">
                    <div className="score-content">
                      <HiStar className="star-icon" />
                      <span>{test.score}</span>
                    </div>
                  </div>
                  <div className="tests-cell tests-language-cell">
                    <div className="language-badge">
                      <span>{test.language}</span>
                    </div>
                  </div>
                  <div className="tests-cell tests-date-cell">
                    <span>{test.date}</span>
                  </div>
                  <div className="tests-cell tests-action-cell">
                    <button
                      className="test-action-btn"
                      onClick={() => handleTestClick(test.id)}
                    >
                      Hacer Prueba
                    </button>
                    <button className="test-menu-btn">
                      <HiDotsHorizontal />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="tests-pagination">       
            <div className="pagination-controls">
              <button className="pagination-btn">
                <HiChevronLeft />
              </button>
              <div className="pagination-numbers">
                <button className="pagination-number active">1</button>
              </div>
              <button className="pagination-btn">
                <HiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Información del Test */}
      {showModal && selectedTest && (
        <div className="test-modal-overlay">
          <div className="test-modal">
            <div className="modal-header">
              <div className="modal-title">
                <span className="test-icon-large">{selectedTest.icon}</span>
                <h2>{selectedTest.title}</h2>
              </div>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <HiX />
              </button>
            </div>

            <div className="modal-content">
              <p className="test-description">{selectedTest.description}</p>

              <div className="test-info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <HiClock />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Duración</span>
                    <span className="info-value">{selectedTest.duration}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <HiClipboardList />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Preguntas</span>
                    <span className="info-value">{selectedTest.questionCount} preguntas</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <HiBadgeCheck />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Insignia</span>
                    <span className="info-value">{selectedTest.badgeName}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <HiStar />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Puntos</span>
                    <span className="info-value">{selectedTest.points}</span>
                  </div>
                </div>
              </div>

              <div className="modal-note">
                <strong>Nota:</strong> Obtendrás la insignia "{selectedTest.badgeName}" si logras una puntuación perfecta.
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="modal-btn-start" onClick={handleStartTest}>
                Comenzar Prueba
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalTests;
