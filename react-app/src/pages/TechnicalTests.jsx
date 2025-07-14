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
} from "react-icons/hi";
import "../assets/technical-tests.css";

const TechnicalTests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleTestClick = (testId) => {
    navigate(`/technical-test-quiz/${testId}`);
  };

  const technicalTests = [
    {
      id: 1,
      title: "JavaScript Básico",
      icon: "📗",
      language: "JavaScript",
      score: "0.0",
      date: "13 July, 2021",
      difficulty: "Básico",
      points: "5 pts",
    },
    {
      id: 2,
      title: "Frontend - Básico",
      icon: "🎨",
      language: "Frontend",
      score: "0.0",
      date: "13 July, 2021",
      difficulty: "Básico",
      points: "8 pts",
    },
    {
      id: 3,
      title: "React Avanzado",
      icon: "⚛️",
      language: "React",
      score: "0.0",
      date: "15 July, 2021",
      difficulty: "Avanzado",
      points: "15 pts",
    },
    {
      id: 4,
      title: "Desarrollo API Node.js",
      icon: "🟢",
      language: "Node.js",
      score: "0.0",
      date: "16 July, 2021",
      difficulty: "Intermedio",
      points: "12 pts",
    },
    {
      id: 5,
      title: "Programación Python Básica",
      icon: "🐍",
      language: "Python",
      score: "0.0",
      date: "18 July, 2021",
      difficulty: "Básico",
      points: "6 pts",
    },
    {
      id: 6,
      title: "Diseño de Base de Datos SQL",
      icon: "🗃️",
      language: "SQL",
      score: "0.0",
      date: "20 July, 2021",
      difficulty: "Intermedio",
      points: "10 pts",
    },
    {
      id: 7,
      title: "Algoritmos y Estructuras de Datos",
      icon: "🔢",
      language: "Algoritmos",
      score: "0.0",
      date: "22 July, 2021",
      difficulty: "Avanzado",
      points: "20 pts",
    },
    {
      id: 8,
      title: "Seguridad Web Básica",
      icon: "🔒",
      language: "Seguridad",
      score: "0.0",
      date: "24 July, 2021",
      difficulty: "Intermedio",
      points: "8 pts",
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
              <div className="tests-view-divider"></div>
              <div className="tests-view-tab">
                <span>Vista Pipeline</span>
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
            <div className="pagination-info">
              <span>Ver</span>
              <select className="page-size-select">
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
              <span>elementos por página</span>
            </div>
            <div className="pagination-controls">
              <button className="pagination-btn">
                <HiChevronLeft />
              </button>
              <div className="pagination-numbers">
                <button className="pagination-number active">1</button>
                <button className="pagination-number">2</button>
              </div>
              <button className="pagination-btn">
                <HiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTests;
