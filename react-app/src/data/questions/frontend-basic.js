// Preguntas para Frontend Básico (Test ID: 2)
export const frontendBasicQuestions = [
  {
    id: 1,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "HTML",
    points: "5 pts",
    question: "¿Qué etiqueta HTML se usa para crear un enlace?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswer: 1,
  },
  {
    id: 2,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "CSS",
    points: "5 pts",
    question: "¿Qué propiedad CSS se usa para cambiar el color del texto?",
    options: ["font-color", "text-color", "color", "foreground-color"],
    correctAnswer: 2,
  },
  {
    id: 3,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "CSS",
    points: "5 pts",
    question:
      "¿Qué propiedad de CSS se utiliza para crear un layout de cuadrícula?",
    options: [
      "display: flex",
      "display: grid",
      "display: table",
      "display: block",
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "HTML",
    points: "5 pts",
    question: "¿Cuál es la estructura básica correcta de un documento HTML?",
    options: [
      "<html><head></head><body></body></html>",
      "<document><header></header><content></content></document>",
      "<page><title></title><main></main></page>",
      "<html><title></title><content></content></html>",
    ],
    correctAnswer: 0,
  },
  {
    id: 5,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "CSS",
    points: "8 pts",
    question:
      "En CSS Flexbox, ¿qué propiedad se utiliza para alinear elementos en el eje principal?",
    options: ["align-items", "justify-content", "flex-direction", "flex-wrap"],
    correctAnswer: 1,
  },
  {
    id: 6,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "HTML",
    points: "8 pts",
    question:
      "¿Qué atributo HTML se usa para especificar una hoja de estilos externa?",
    options: ["src", "href", "link", "style"],
    correctAnswer: 1,
  },
  {
    id: 7,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "CSS",
    points: "8 pts",
    question: "¿Cuál es la unidad de medida relativa en CSS?",
    options: ["px", "em", "pt", "cm"],
    correctAnswer: 1,
  },
  {
    id: 8,
    type: "coding",
    difficulty: "Básico",
    language: "CSS",
    points: "15 pts",
    question: "Escribe CSS para centrar un div horizontalmente:",
    placeholder: `.contenedor {
  /* Tu código aquí */
}`,
    correctAnswer: `.contenedor {
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
}`,
  },
  {
    id: 9,
    type: "multiple-choice",
    difficulty: "Básico",
    language: "HTML",
    points: "10 pts",
    question: "¿Qué etiqueta HTML5 se usa para contenido principal?",
    options: ["<content>", "<main>", "<primary>", "<section>"],
    correctAnswer: 1,
  },
  {
    id: 10,
    type: "coding",
    difficulty: "Básico",
    language: "HTML",
    points: "20 pts",
    question: "Crea una estructura HTML básica con header, main y footer:",
    placeholder: `<!DOCTYPE html>
<html>
<!-- Tu código aquí -->
</html>`,
    correctAnswer: `<!DOCTYPE html>
<html>
<head>
  <title>Mi Página</title>
</head>
<body>
  <header>
    <h1>Encabezado</h1>
  </header>
  <main>
    <p>Contenido principal</p>
  </main>
  <footer>
    <p>Pie de página</p>
  </footer>
</body>
</html>`,
  },
];
