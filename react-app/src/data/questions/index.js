// Índice centralizado de todas las preguntas del quiz
import { javascriptBasicQuestions } from "./javascript-basic";
import { frontendBasicQuestions } from "./frontend-basic";
import { reactAdvancedQuestions } from "./react-advanced";
import { pythonBasicQuestions } from "./python-basic";
import { apiNodeJSQuestions } from "./node-Js";
import { sqlQuestions } from "./sql";
import { webSecurityQuestions } from "./web-security";
import { algorithmQuestions } from "./algorithm";

// Preguntas por defecto para tests que no tienen preguntas específicas
const defaultQuestions = [
  {
    id: 1,
    type: "multiple-choice",
    difficulty: "Intermedio",
    language: "Programación",
    points: "10 pts",
    question:
      "¿Cuál es un principio fundamental de la programación orientada a objetos?",
    options: ["Encapsulación", "Concatenación", "Iteración", "Declaración"],
    correctAnswer: 0,
  },
  {
    id: 2,
    type: "multiple-choice",
    difficulty: "Intermedio",
    language: "Programación",
    points: "10 pts",
    question: "¿Qué es la complejidad algorítmica Big O?",
    options: [
      "Una medida de velocidad",
      "Una medida de eficiencia en tiempo y espacio",
      "Un tipo de algoritmo",
      "Una estructura de datos",
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    type: "coding",
    difficulty: "Intermedio",
    language: "Programación",
    points: "20 pts",
    question: "Implementa una función de búsqueda binaria:",
    placeholder: `function busquedaBinaria(arr, target) {
  // Tu código aquí
}`,
    correctAnswer: `function busquedaBinaria(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}`,
  },
  {
    id: 4,
    type: "multiple-choice",
    difficulty: "Intermedio",
    language: "Programación",
    points: "15 pts",
    question: "¿Qué estructura de datos sigue el principio LIFO?",
    options: ["Queue", "Stack", "Array", "LinkedList"],
    correctAnswer: 1,
  },
  {
    id: 5,
    type: "multiple-choice",
    difficulty: "Intermedio",
    language: "Programación",
    points: "15 pts",
    question: "¿Cuál es la diferencia entre recursión e iteración?",
    options: [
      "No hay diferencia",
      "Recursión llama a sí misma, iteración usa bucles",
      "Iteración es más rápida siempre",
      "Recursión solo funciona con números",
    ],
    correctAnswer: 1,
  },
];

// Banco de preguntas organizado por ID de test
export const questionsBanks = {
  1: javascriptBasicQuestions, // JavaScript Básico
  2: frontendBasicQuestions, // Frontend Básico
  3: reactAdvancedQuestions, // React Avanzado
  4: apiNodeJSQuestions, // Node.js API (placeholder)
  5: pythonBasicQuestions, // Python Básico (placeholder)
  6: sqlQuestions, // Base de Datos SQL (placeholder)
  7: algorithmQuestions, // Algoritmos (placeholder)
  8: webSecurityQuestions, // Seguridad Web (placeholder)
  default: defaultQuestions, // Fallback
};

// Función para obtener preguntas por test ID
export const getQuestionsByTestId = (testId) => {
  return questionsBanks[testId] || questionsBanks.default;
};
