'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function QuizGeneral({ step, onStepComplete, onLevelComplete, onTotalStepsChange, level }) {
  const [userSelection, setUserSelection] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [questionAnswered, setQuestionAnswered] = useState(false);

  const questions = [
    {
      question: "¿Qué tipo de transformación lineal representa la matriz [[0, -1], [1, 0]]?",
      options: [
        "Reflexión sobre el eje X",
        "Escalado no uniforme",
        "Rotación de 90° en sentido horario",
        "Cizalla horizontal"
      ],
      correctAnswerIndex: 2,
      explanation: "La matriz [[0, -1], [1, 0]] rota un vector (x, y) a (-y, x), lo que corresponde a una rotación de 90° en sentido horario."
    },
    {
      question: "Si det(A) = 0, ¿qué puedes decir sobre la matriz A?",
      options: [
        "Es invertible",
        "Es simétrica",
        "Sus columnas son linealmente dependientes",
        "Es una matriz identidad"
      ],
      correctAnswerIndex: 2,
      explanation: "Un determinante de cero indica que las columnas (y filas) de la matriz son linealmente dependientes, lo que también significa que la matriz no es invertible."
    },
    {
      question: "¿Cuál es la dimensión del espacio nulo de una matriz A si tiene 3 filas, 5 columnas y un rango de 2?",
      options: [
        "1",
        "2",
        "3",
        "5"
      ],
      correctAnswerIndex: 2,
      explanation: "Según el Teorema del Rango-Nulidad, dim(Espacio Nulo) + Rango(A) = número de columnas. Así, dim(Espacio Nulo) + 2 = 5, lo que implica dim(Espacio Nulo) = 3."
    },
    {
      question: "Una matriz A es diagonalizable si...",
      options: [
        "Es simétrica",
        "Tiene valores propios reales",
        "Tiene n vectores propios linealmente independientes",
        "Su determinante es diferente de cero"
      ],
      correctAnswerIndex: 2,
      explanation: "Una matriz es diagonalizable si y solo si posee un conjunto de n vectores propios linealmente independientes, donde n es el tamaño de la matriz."
    },
    {
      question: "Si A = PDP^-1, ¿cómo se calcula A^3?",
      options: [
        "P^3 D P^-3",
        "P D^3 P^-1",
        "A * A * A",
        "P D P^-1 D P^-1 D P^-1"
      ],
      correctAnswerIndex: 1,
      explanation: "La propiedad fundamental de la diagonalización para potencias es A^k = PD^kP^-1. Por lo tanto, A^3 = PD^3P^-1."
    },
    {
      question: "¿Cuál es la matriz de identidad 2x2?",
      options: [
        "[[0,1],[1,0]]",
        "[[1,1],[1,1]]",
        "[[1,0],[0,1]]",
        "[[0,0],[0,0]]"
      ],
      correctAnswerIndex: 2,
      explanation: "La matriz de identidad es una matriz cuadrada donde todos los elementos de la diagonal principal son 1 y todos los demás son 0."
    },
    {
      question: "¿Qué operación elemental de fila no cambia el determinante de una matriz?",
      options: [
        "Multiplicar una fila por un escalar c ≠ 0",
        "Intercambiar dos filas",
        "Sumar un múltiplo de una fila a otra fila",
        "Todas las anteriores"
      ],
      correctAnswerIndex: 2,
      explanation: "Sumar un múltiplo de una fila a otra fila no altera el valor del determinante. Multiplicar una fila por c multiplica el determinante por c, e intercambiar filas cambia el signo del determinante."
    },
    {
      question: "Si un sistema de ecuaciones lineales tiene infinitas soluciones, ¿qué indica esto sobre las ecuaciones?",
      options: [
        "Son inconsistentes",
        "Son linealmente independientes",
        "Son linealmente dependientes",
        "Tienen una única solución"
      ],
      correctAnswerIndex: 2,
      explanation: "Un sistema con infinitas soluciones es consistente pero sus ecuaciones son linealmente dependientes, lo que significa que al menos una ecuación es una combinación lineal de las otras."
    },
    {
      question: "¿Qué significa que un conjunto de vectores sea linealmente independiente?",
      options: [
        "Uno de los vectores es el vector cero",
        "Ningún vector puede ser expresado como una combinación lineal de los otros",
        "La combinación lineal de los vectores siempre es cero",
        "Los vectores son ortogonales entre sí"
      ],
      correctAnswerIndex: 1,
      explanation: "Un conjunto de vectores es linealmente independiente si el único modo de combinarlos linealmente para obtener el vector cero es que todos los escalares sean cero. Esto implica que ningún vector puede ser escrito como combinación lineal de los otros."
    },
    {
      question: "¿Cuál es el valor propio (autovalor) de la matriz [[5,0],[0,5]]?",
      options: [
        "0 y 5",
        "Solo 5",
        "-5 y 5",
        "No tiene valores propios"
      ],
      correctAnswerIndex: 1,
      explanation: "Para una matriz diagonal, los valores propios son los elementos de la diagonal principal. En este caso, ambos son 5, por lo que el único valor propio es 5."
    }
  ];

  const currentQuestion = questions[step];

  useEffect(() => {
    onTotalStepsChange(questions.length);
    setFeedback('');
    setIsCorrect(false);
    setUserSelection(null);
    setShowAnswer(false);
    setQuestionAnswered(false);
  }, [step, onTotalStepsChange]);

  const handleOptionSelect = (index) => {
    if (questionAnswered) return;
    setUserSelection(index);
    setFeedback('');
    setIsCorrect(false);
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    if (userSelection === null) {
      setFeedback('Por favor, selecciona una opción antes de verificar.');
      setIsCorrect(false);
      return;
    }
    
    setQuestionAnswered(true);

    if (userSelection === currentQuestion.correctAnswerIndex) {
      setIsCorrect(true);
      setFeedback('¡Correcto! +10 puntos.');
      setQuizScore(prevScore => prevScore + 10);
      onStepComplete(10);
    } else {
      setIsCorrect(false);
      setFeedback('Incorrecto. La respuesta correcta es:');
      setShowAnswer(true);
    }
  };

  const handleNextQuestion = () => {
    if (step < questions.length - 1) {
      onStepComplete(0);
    } else {
      onLevelComplete(level.id, quizScore);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setIsCorrect(false);
    setFeedback('La respuesta correcta es:');
    setQuestionAnswered(true);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-4">
        <h3 className="text-xl font-bold text-white mb-2">Quiz General de Álgebra Lineal</h3>
        <p className="text-blue-200 text-sm">Pon a prueba tus conocimientos en todos los temas.</p>
        
      </div>

      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-white mb-4">{currentQuestion.question}</h4>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${userSelection === index ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} ${questionAnswered ? 'pointer-events-none opacity-60' : ''}`}
              onClick={() => handleOptionSelect(index)}
            >
              <span className="text-white">{option}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex gap-4 mb-4 flex-wrap">
          <button onClick={checkAnswer} className="btn-success" disabled={questionAnswered}>Verificar Respuesta</button>
          <button onClick={handleShowAnswer} className="btn-primary" disabled={questionAnswered}>Mostrar Respuesta</button>
          {isCorrect || showAnswer || questionAnswered ? (
            <button onClick={handleNextQuestion} className="btn-secondary">Siguiente Pregunta</button>
          ) : null}
        </div>

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-4 mt-4 ${isCorrect ? 'bg-green-500 text-green-300' : 'bg-blue-500 text-blue-300'}`}
          >
            {feedback}
          </motion.div>
        )}

        {showAnswer && !isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mt-4"
          >
            <h5 className="text-lg font-semibold text-yellow-300 mb-2">Respuesta Correcta:</h5>
            <p className="text-yellow-200 mb-2">{currentQuestion.options[currentQuestion.correctAnswerIndex]}</p>
            <h5 className="text-lg font-semibold text-yellow-300 mb-2">Explicación:</h5>
            <p className="text-yellow-200">{currentQuestion.explanation}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
