// Preguntas para JavaScript Básico (Test ID: 1)
export const javascriptBasicQuestions = [
  {
    id: 1,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "JavaScript",
    points: "5 pts",
    question:
      "¿Qué palabra clave se usa para declarar una variable en JavaScript?",
    options: ["var", "let", "const", "Todas las anteriores"],
    correctAnswer: 3,
  },
  {
    id: 2,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "JavaScript",
    points: "5 pts",
    question: "¿Cuál es el resultado de '3' + 2 en JavaScript?",
    options: ["5", "'32'", "NaN", "Error"],
    correctAnswer: 1,
  },
  {
    id: 3,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "JavaScript",
    points: "5 pts",
    question:
      "¿Qué método se usa para agregar un elemento al final de un array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correctAnswer: 0,
  },
  {
    id: 4,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "JavaScript",
    points: "5 pts",
    question: "¿Cómo se escribe un comentario de una línea en JavaScript?",
    options: [
      "<!-- comentario -->",
      "/* comentario */",
      "// comentario",
      "# comentario",
    ],
    correctAnswer: 2,
  },
  {
    id: 5,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "JavaScript",
    points: "5 pts",
    question: "¿Qué tipo de dato devuelve typeof null?",
    options: ["null", "undefined", "object", "boolean"],
    correctAnswer: 2,
  },
  {
    id: 6,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "JavaScript",
    points: "8 pts",
    question:
      "¿Cuál es la forma correcta de escribir una función en JavaScript?",
    options: [
      "function myFunction() {}",
      "function = myFunction() {}",
      "create myFunction() {}",
      "def myFunction() {}",
    ],
    correctAnswer: 0,
  },
  {
    id: 7,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "JavaScript",
    points: "8 pts",
    question: "¿Qué operador se usa para comparar valor y tipo?",
    options: ["==", "===", "!=", "="],
    correctAnswer: 1,
  },
  {
    id: 8,
    type: "coding",
    difficulty: "Básico",
    language: "JavaScript",
    points: "15 pts",
    question: "Escribe una función que determine si un número es par:",
    placeholder: `function esPar(numero) {
  // Tu código aquí
}`,
    correctAnswer: `function esPar(numero) {
  return numero % 2 === 0;
}`,
  },
  {
    id: 9,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "JavaScript",
    points: "10 pts",
    question: "¿Cuál es el método correcto para convertir un string a número?",
    options: ["Number()", "parseInt()", "parseFloat()", "Todas las anteriores"],
    correctAnswer: 3,
  },
  {
    id: 10,
    type: "coding",
    difficulty: "Básico",
    language: "JavaScript",
    points: "20 pts",
    question: "Escribe una función que invierta un string:",
    placeholder: `function invertirString(str) {
  // Tu código aquí
}`,
    correctAnswer: `function invertirString(str) {
  return str.split('').reverse().join('');
}`,
  },
];
