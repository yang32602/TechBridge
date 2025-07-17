// Preguntas para React Avanzado (Test ID: 3)
export const reactAdvancedQuestions = [
  {
    id: 1,
    type: "multiple-choice",
    difficulty: "Avanzado",
    language: "React",
    points: "10 pts",
    question: "¿Qué hook se usa para manejar efectos secundarios en React?",
    options: ["useState", "useEffect", "useContext", "useCallback"],
    correctAnswer: 1,
  },
  {
    id: 2,
    type: "multiple-choice",
    difficulty: "Avanzado",
    language: "React",
    points: "10 pts",
    question: "¿Cuál es la forma correcta de actualizar el estado en React?",
    options: [
      "state.count = 1",
      "setState({count: 1})",
      "setCount(1)",
      "updateState(count, 1)",
    ],
    correctAnswer: 2,
  },
  {
    id: 3,
    type: "multiple-choice",
    difficulty: "Avanzado",
    language: "React",
    points: "15 pts",
    question: "¿Qué es el Virtual DOM en React?",
    options: [
      "Una copia del DOM real",
      "Una representación en memoria del DOM",
      "Un servidor virtual",
      "Una base de datos virtual",
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    type: "coding",
    difficulty: "Avanzado",
    language: "React",
    points: "20 pts",
    question: "Crea un hook personalizado para manejar localStorage:",
    placeholder: `function useLocalStorage(key, initialValue) {
  // Tu código aquí
}`,
    correctAnswer: `function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}`,
  },
  {
    id: 5,
    type: "multiple-choice",
    difficulty: "Avanzado",
    language: "React",
    points: "15 pts",
    question:
      "¿Qué patrón se usa para pasar datos a través de múltiples componentes?",
    options: [
      "Props drilling",
      "Context API",
      "State lifting",
      "Component composition",
    ],
    correctAnswer: 1,
  },
  {
    id: 6,
    type: "multiple-choice",
    difficulty: "Avanzado",
    language: "React",
    points: "15 pts",
    question: "¿Cuándo se ejecuta useEffect sin dependencias?",
    options: [
      "Solo una vez al montar",
      "En cada renderizado",
      "Solo al desmontar",
      "Nunca",
    ],
    correctAnswer: 1,
  },
  {
    id: 7,
    type: "coding",
    difficulty: "Avanzado",
    language: "React",
    points: "25 pts",
    question: "Implementa un componente que use useReducer para contador:",
    placeholder: `function Counter() {
  // Tu código aquí
}`,
    correctAnswer: `function Counter() {
  const initialState = { count: 0 };

  function reducer(state, action) {
    switch (action.type) {
      case 'increment':
        return { count: state.count + 1 };
      case 'decrement':
        return { count: state.count - 1 };
      case 'reset':
        return initialState;
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}`,
  },
  {
    id: 8,
    type: "multiple-choice",
    difficulty: "Avanzado",
    language: "React",
    points: "15 pts",
    question: "¿Qué es React.memo?",
    options: [
      "Un hook para memorización",
      "Un HOC para optimización de renderizado",
      "Un método para guardar estado",
      "Una función para crear contexto",
    ],
    correctAnswer: 1,
  },
  {
    id: 9,
    type: "multiple-choice",
    difficulty: "Avanzado",
    language: "React",
    points: "20 pts",
    question: "¿Cuál es la diferencia entre useCallback y useMemo?",
    options: [
      "No hay diferencia",
      "useCallback memoriza funciones, useMemo memoriza valores",
      "useMemo memoriza funciones, useCallback memoriza valores",
      "Ambos hacen lo mismo pero con sintaxis diferente",
    ],
    correctAnswer: 1,
  },
  {
    id: 10,
    type: "coding",
    difficulty: "Avanzado",
    language: "React",
    points: "30 pts",
    question: "Crea un contexto de autenticación con provider:",
    placeholder: `const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Tu código aquí
}`,
    correctAnswer: `const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simular login
      const userData = { email, name: 'Usuario' };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}`,
  },
];
