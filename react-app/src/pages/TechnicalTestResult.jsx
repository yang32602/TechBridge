import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StudentSidebar } from "../components";
import { useAuth } from "../hooks/useAuth";
import apiService from "../services/api";
import {
  HiCheckCircle,
  HiXCircle,
  HiClipboardList,
  HiClock,
  HiTrendingUp,
  HiAcademicCap,
  HiBadgeCheck,
} from "react-icons/hi";
import "../assets/technical-result.css";

const TechnicalTestResult = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const {
    answers = {},
    totalQuestions = 4,
    correctAnswers = 0,
    score: passedScore = null,
    isPerfectScore = false
  } = location.state || {};

  const [badgeAwarded, setBadgeAwarded] = useState(false);
  const [badgeName, setBadgeName] = useState("");
  const [isAwardingBadge, setIsAwardingBadge] = useState(false);

  // 测试ID到徽章ID和名称的映射
  const testBadgeMapping = {
    1: { id: 1, name: "JavaScript Básico" },
    2: { id: 2, name: "Frontend Básico" },
    3: { id: 3, name: "React Avanzado" },
    4: { id: 4, name: "Node.js API" },
    5: { id: 5, name: "Python Básico" },
    6: { id: 6, name: "SQL" },
    7: { id: 7, name: "Algoritmos" },
    8: { id: 8, name: "Seguridad Web" },
  };

  // 授予徽章的效果
  useEffect(() => {
    const awardBadge = async () => {
      if (isPerfectScore && user && testBadgeMapping[testId] && !isAwardingBadge) {
        setIsAwardingBadge(true);
        try {
          // 获取学生ID
          const studentData = await apiService.getStudentByUserId(user.id);
          if (!studentData) {
            console.error("No student data found for user:", user.id);
            return;
          }

          const badgeInfo = testBadgeMapping[testId];

          // 授予徽章
          const response = await apiService.assignBadgeToStudent(user.id, badgeInfo.id);

          if (response && response.estado === 1) {
            setBadgeAwarded(true);
            setBadgeName(response.nombre || badgeInfo.name);
          }
        } catch (error) {
          console.error("Error awarding badge:", error);
        } finally {
          setIsAwardingBadge(false);
        }
      }
    };

    awardBadge();
  }, [isPerfectScore, user, testId, isAwardingBadge]);

  const handleReturnToTests = () => {
    navigate("/technical-tests");
  };

  // Usar la puntuación pasada o calcular una por defecto
  const score = passedScore !== null ? passedScore : (() => {
    const answeredQuestions = Object.keys(answers).length;
    const baseScore = (answeredQuestions / totalQuestions) * 70;
    const bonusScore = Math.random() * 30;
    return Math.min(Math.round(baseScore + bonusScore), 100);
  })();
  const answeredQuestions = Object.keys(answers).length;
  const completionRate = Math.round((answeredQuestions / totalQuestions) * 100);

  const getScoreGrade = (score) => {
    if (score >= 90) return { grade: "Excelente", color: "#22c55e" };
    if (score >= 80) return { grade: "Bueno", color: "#3b82f6" };
    if (score >= 70) return { grade: "Regular", color: "#f59e0b" };
    if (score >= 60) return { grade: "Aprobado", color: "#f97316" };
    return { grade: "Reprobado", color: "#ef4444" };
  };

  const scoreGrade = getScoreGrade(score);

  // Datos mock de comparación
  const averageScore = 75;
  const userRanking = "Top 25%";

  return (
    <div className="technical-result-container">
      {/* Sidebar Unificado */}
      <StudentSidebar activeSection="technical-tests" />

      {/* Contenido Principal */}
      <div className="technical-result-main">
        {/* Encabezado */}
        <div className="result-header">
          <div className="result-header-content">
            <h1>Resultado del Examen</h1>
            <button className="return-btn" onClick={handleReturnToTests}>
              Volver a Lista de Pruebas
            </button>
          </div>
        </div>

        {/* Contenido de Resultados */}
        <div className="result-content">
          {/* Notificación de Insignia */}
          {badgeAwarded && (
            <div className="badge-notification">
              <div className="badge-notification-content">
                <div className="badge-icon">
                  <HiBadgeCheck />
                </div>
                <div className="badge-message">
                  <h3>🎉 ¡Felicidades!</h3>
                  <p>Has obtenido la insignia <strong>{badgeName}</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* Tarjeta de Puntuación */}
          <div className="score-card">
            <div className="score-header">
              <div className="score-icon">
                {score >= 70 ? (
                  <HiCheckCircle className="success-icon" />
                ) : (
                  <HiXCircle className="fail-icon" />
                )}
              </div>
              <div className="score-info">
                <h2>¡Examen Completado!</h2>
                <p>Has completado exitosamente la prueba técnica #{testId}</p>
              </div>
            </div>

            <div className="score-display">
              <div className="main-score">
                <div
                  className="score-circle"
                  style={{ "--score": score, "--color": scoreGrade.color }}
                >
                  <div className="score-number">{score}</div>
                  <div className="score-label">pts</div>
                </div>
                <div
                  className="score-grade"
                  style={{ color: scoreGrade.color }}
                >
                  {scoreGrade.grade}
                </div>
              </div>

              <div className="score-details">
                <div className="detail-item">
                  <div className="detail-icon">
                    <HiClipboardList />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Preguntas Completadas</div>
                    <div className="detail-value">
                      {answeredQuestions} / {totalQuestions}
                    </div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <HiClock />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Tasa de Finalización</div>
                    <div className="detail-value">{completionRate}%</div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <HiTrendingUp />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Puntuación Promedio</div>
                    <div className="detail-value">{averageScore} pts</div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <HiAcademicCap />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Ranking</div>
                    <div className="detail-value">{userRanking}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Análisis de Rendimiento */}
          <div className="performance-analysis">
            <h3>Análisis de Rendimiento</h3>
            <div className="analysis-grid">
              <div className="analysis-card">
                <div className="analysis-header">
                  <HiCheckCircle className="analysis-icon success" />
                  <h4>Fortalezas</h4>
                </div>
                <ul>
                  <li>Buen dominio de conceptos básicos</li>
                  <li>Lógica de código clara</li>
                  <li>Velocidad de respuesta adecuada</li>
                </ul>
              </div>

              <div className="analysis-card">
                <div className="analysis-header">
                  <HiTrendingUp className="analysis-icon improvement" />
                  <h4>Sugerencias de Mejora</h4>
                </div>
                <ul>
                  <li>Reforzar el aprendizaje de conceptos avanzados</li>
                  <li>Mejorar las habilidades de optimización de código</li>
                  <li>Practicar más con proyectos reales</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="recommendations">
            <h3>Recursos de Aprendizaje Recomendados</h3>
            <div className="recommendations-grid">
              <div className="recommendation-item">
                <div className="recommendation-icon">📚</div>
                <div className="recommendation-content">
                  <h4>Tutorial Avanzado de JavaScript</h4>
                  <p>
                    Aprende a fondo las características de ES6+ y programación
                    asíncrona
                  </p>
                </div>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-icon">💻</div>
                <div className="recommendation-content">
                  <h4>Práctica con Proyectos Reales</h4>
                  <p>
                    Mejora las habilidades de programación a través de proyectos
                    prácticos
                  </p>
                </div>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-icon">🎯</div>
                <div className="recommendation-content">
                  <h4>Algoritmos y Estructuras de Datos</h4>
                  <p>
                    Refuerza el conocimiento fundamental de ciencias de la
                    computación
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="result-actions">
            <button
              className="action-btn secondary"
              onClick={handleReturnToTests}
            >
              Volver a Lista de Pruebas
            </button>
            <button
              className="action-btn primary"
              onClick={() => navigate("/")}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTestResult;
