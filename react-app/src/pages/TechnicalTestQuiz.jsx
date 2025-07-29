import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StudentSidebar } from "../components";
import { HiClock, HiShieldCheck, HiEye, HiCode } from "react-icons/hi";
import { getQuestionsByTestId } from "../data/questions";
import Swal from "sweetalert2";
import "../assets/technical-quiz.css";

// Configuración del quiz
const QUIZ_CONFIG = {
  INITIAL_TIME: 1200, // 20min
  TIMER_INTERVAL: 1000,
  DETECTED_CHANGES_INITIAL: 0,
};

const TechnicalTestQuiz = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  // Obtener preguntas específicas para el test
  const questions = getQuestionsByTestId(testId);

  const [timeLeft, setTimeLeft] = useState(QUIZ_CONFIG.INITIAL_TIME);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [detectedChanges, setDetectedChanges] = useState(QUIZ_CONFIG.DETECTED_CHANGES_INITIAL);

  // Formatear tiempo en minutos y segundos
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Finalizar examen y redirigir
  const handleFinishExam = useCallback(() => {
    // Calcular puntuación
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);

    navigate(`/technical-test-result/${testId}`, {
      state: {
        answers,
        totalQuestions: questions.length,
        correctAnswers,
        score,
        isPerfectScore: score === 100
      },
    });
  }, [navigate, testId, answers, questions]);

  // Temporizador de cuenta regresiva
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, QUIZ_CONFIG.TIMER_INTERVAL);

    return () => clearInterval(timer);
  }, [handleFinishExam]);


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setDetectedChanges((prev) => prev + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (detectedChanges > 0 && detectedChanges < 3) {
      Swal.fire({
        icon: "warning",
        title: "¡Cuidado!",
        text: `Se detectó un cambio de pestaña. Cambios detectados: ${detectedChanges}`,
        confirmButtonText: "Entendido",
        timer: 3000,
      });
    }

    if (detectedChanges >= 3) {
      Swal.fire({
        icon: "error",
        title: "Demasiados cambios de pestaña",
        text: "Has cambiado de pestaña demasiadas veces. El quiz será finalizado.",
        confirmButtonText: "Finalizar",
      }).then(() => {
        handleFinishExam();
      });
    }
  }, [detectedChanges]);


  // Guardar respuesta seleccionada
  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  // Navegación entre preguntas
  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQuestionData = questions[currentQuestion];

  if (!currentQuestionData) {
    return (
      <div className="technical-quiz-container">
        <StudentSidebar activeSection="technical-tests" />
        <div className="quiz-main-wrapper">
          <div className="quiz-error">
            <h2>Error cargando preguntas</h2>
            <p>No se pudieron cargar las preguntas para este test.</p>
            <button onClick={() => navigate("/technical-tests")}>
              Volver a Pruebas Técnicas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="technical-quiz-container">
      {/* Sidebar de Navegación */}
      <StudentSidebar activeSection="technical-tests" />

      {/* Contenido Principal del Quiz */}
      <div className="quiz-main-wrapper">
        {/* Barra de Estado */}
        <div className="quiz-status-bar">
          <div className="status-item time-remaining">
            <div className="status-icon time-icon">
              <HiClock />
            </div>
            <div className="status-content">
              <div className="status-label">Tiempo Restante</div>
              <div className="status-value time-value">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <div className="status-item security-status">
            <div className="status-icon security-icon">
              <HiShieldCheck />
            </div>
            <div className="status-content">
              <div className="status-label">Estado de Seguridad</div>
              <div className="status-value security-value">Activo</div>
            </div>
          </div>

          <div className="status-item changes-detected">
            <div className="status-icon changes-icon">
              <HiEye />
            </div>
            <div className="status-content">
              <div className="status-label">Cambios Detectados</div>
              <div className="status-value changes-value">
                {detectedChanges}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal del Quiz */}
        <div className="quiz-main-content">
          <div className="question-card">
            {/* Etiquetas de la Pregunta */}
            <div className="question-tags">
              <div className="question-tag difficulty-tag">
                {currentQuestionData.difficulty}
              </div>
              <div className="question-tag language-tag">
                {currentQuestionData.language}
              </div>
              <div className="question-tag points-tag">
                {currentQuestionData.points}
              </div>
            </div>

            {/* Título de la Pregunta */}
            <div className="question-title">
              <h2>{currentQuestionData.question}</h2>
            </div>

            {/* Contenido de la Pregunta */}
            <div className="question-content">
              {currentQuestionData.type === "multiple-choice" ? (
                <div className="multiple-choice-options">
                  {currentQuestionData.options.map((option, index) => (
                    <div
                      key={index}
                      className={`option-item ${answers[currentQuestion] === index ? "selected" : ""
                        }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        id={`option-${index}`}
                        checked={answers[currentQuestion] === index}
                        onChange={() =>
                          handleAnswerChange(currentQuestion, index)
                        }
                      />
                      <label htmlFor={`option-${index}`}>{option}</label>
                    </div>
                  ))}
                </div>
              ) : currentQuestionData.type === "true-false" ? (
                <div className="true-false-options">
                  {["Verdadero", "Falso"].map((option, index) => (
                    <div
                      key={option}
                      className={`option-item ${answers[currentQuestion] === index ? "selected" : ""
                        }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        id={`option-${index}`}
                        checked={answers[currentQuestion] === index}
                        onChange={() =>
                          handleAnswerChange(currentQuestion, index)
                        }
                      />
                      <label htmlFor={`option-${index}`}>{option}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="coding-question">
                  <div className="code-editor-header">
                    <div className="editor-icon">
                      <HiCode />
                    </div>
                    <span>Editor de Código {currentQuestionData.language}</span>
                  </div>
                  <div className="code-editor">
                    <textarea
                      value={answers[currentQuestion] || ""}
                      onChange={(e) =>
                        handleAnswerChange(currentQuestion, e.target.value)
                      }
                      placeholder={currentQuestionData.placeholder}
                      className="code-textarea"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navegación de Preguntas */}
            <div className="question-navigation">
              <div className="question-progress">
                <span>
                  Pregunta {currentQuestion + 1} de {questions.length}
                </span>
              </div>
              <div className="navigation-buttons">
                {currentQuestion > 0 && (
                  <button
                    className="nav-btn prev-btn"
                    onClick={goToPreviousQuestion}
                  >
                    Anterior
                  </button>
                )}
                {currentQuestion < questions.length - 1 ? (
                  <button
                    className="nav-btn next-btn"
                    onClick={goToNextQuestion}
                  >
                    Siguiente
                  </button>
                ) : (
                  <button className="finish-btn" onClick={handleFinishExam}>
                    Finalizar Examen
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Finalizar (Siempre Visible) */}
        <div className="quiz-footer">
          <button className="finish-exam-btn" onClick={handleFinishExam}>
            Finalizar Examen
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTestQuiz;
