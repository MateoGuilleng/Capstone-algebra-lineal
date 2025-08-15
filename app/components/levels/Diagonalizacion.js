'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Diagonalizacion({ step, onStepComplete, onLevelComplete, onTotalStepsChange, level }) {
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentLevelScore, setCurrentLevelScore] = useState(0); // New state to track score within this level

  const steps = [
    {
      title: "Valores Propios (Eigenvalues)",
      description: "Encuentra los valores propios de la matriz dada.",
      generalExplanation: "Para encontrar los valores propios (autovalores), resuelve la ecuación característica det(A - \u03bbI) = 0.",
      matrix: [[2, 1], [0, 3]],
      eigenvalues: [2, 3],
      hint: "Para una matriz triangular (superior o inferior), los valores propios son los elementos de la diagonal principal."
    },
    {
      title: "Vectores Propios (Eigenvectors)",
      description: "Encuentra un vector propio asociado a un valor propio dado. (Ejemplo de respuesta: [1,0])",
      generalExplanation: "Para cada valor propio \u03bb, resuelve el sistema homogéneo (A - \u03bbI)v = 0 para encontrar el vector propio v.",
      matrix: [[3, 1], [0, 2]],
      eigenvalue: 3,
      solution: 'CONCEPTUAL_LEVEL: [1,0]',
      hint: "Sustituye el autovalor en (A - \u03bbI) y resuelve el sistema lineal para encontrar el espacio nulo."
    },
    {
      title: "Matriz P (Eigenvector Matrix)",
      description: "Comprende cómo se forma la matriz P de vectores propios. (Ejemplo: P = [[1,0],[0,1]])",
      generalExplanation: "La matriz P (matriz de paso o modal) se forma colocando los vectores propios linealmente independientes de A como sus columnas.",
      matrix: [[1, 1], [0, 2]],
      conceptualType: 'P_MATRIX',
      solution: 'CONCEPTUAL_LEVEL: P = [[1,0],[0,1]]',
      hint: "El orden de los vectores propios en P debe coincidir con el orden de los autovalores en la matriz diagonal D."
    },
    {
      title: "Matriz P Inversa (P^-1)",
      description: "Comprende el papel de la inversa de la matriz P en la diagonalización. (Ejemplo: P^-1 = [[1,0],[0,1]])",
      generalExplanation: "La inversa de P (P^-1) es crucial para la fórmula de diagonalización A = PDP^-1, ya que 'deshace' la transformación aplicada por P.",
      matrix: [[1, 1], [0, 2]],
      conceptualType: 'P_INVERSE',
      solution: 'CONCEPTUAL_LEVEL: P^-1 = [[1,0],[0,1]]',
      hint: "Puedes calcular P^-1 usando el método de la adjunta o la eliminación de Gauss-Jordan con la matriz aumentada [P|I]."
    },
    {
      title: "Matriz Diagonal D",
      description: "Comprende la estructura de la matriz diagonal D. (Ejemplo: D = [[1,0],[0,2]])",
      generalExplanation: "La matriz diagonal D contiene los valores propios de A en su diagonal principal.",
      matrix: [[1, 1], [0, 2]],
      conceptualType: 'D_MATRIX',
      solution: 'CONCEPTUAL_LEVEL: D = [[1,0],[0,2]]',
      hint: "El orden de los autovalores en D debe ser el mismo que el orden correspondiente de los autovectores en P."
    },
    {
      title: "Matriz Diagonalizable",
      description: "Determina si la matriz dada es diagonalizable. (Ejemplo: Sí, es diagonalizable)",
      generalExplanation: "Una matriz es diagonalizable si es similar a una matriz diagonal. Esto ocurre si tiene un conjunto de autovectores linealmente independientes que forman una base.",
      matrix: [[1, 1], [0, 2]],
      diagonalizable: 'CONCEPTUAL_LEVEL',
      solution: 'CONCEPTUAL_LEVEL: Sí, es diagonalizable',
      hint: "Verifica si la multiplicidad algebraica de cada autovalor es igual a su multiplicidad geométrica (dimensión del espacio propio). O, si la suma de las dimensiones de los espacios propios es igual al tamaño de la matriz."
    }
  ];

  const currentStep = steps[step] || steps[0];

  useEffect(() => {
    onTotalStepsChange(steps.length);
    if (step >= steps.length) {
      onLevelComplete(level.id, currentLevelScore); // Pass level.id and accumulated score when level completes
      return;
    }
    setFeedback('');
    setIsCorrect(false);
    setUserAnswer(''); // Reset user answer
    setShowHint(false); // Hide hint
  }, [step, onTotalStepsChange, onLevelComplete]);

  const handleConceptualComplete = () => {
    setIsCorrect(true);
    setFeedback('¡Concepto entendido! +50 puntos.');
    setTimeout(() => {
      setCurrentLevelScore(prevScore => prevScore + 50); // Add points to local score
      onStepComplete(50);
    }, 1500);
  };

  const checkAnswer = () => {
    if (currentStep.eigenvalues) {
      // Check for numerical eigenvalues
      const parsedAnswer = userAnswer.split(',').map(Number).sort((a,b) => a - b);
      const expectedEigenvalues = [...currentStep.eigenvalues].sort((a,b) => a - b);

      if (parsedAnswer.length === expectedEigenvalues.length &&
          parsedAnswer.every((val, index) => val === expectedEigenvalues[index])) {
        setIsCorrect(true);
        setFeedback('¡Correcto! Has encontrado los valores propios.');
        setTimeout(() => {
          setCurrentLevelScore(prevScore => prevScore + 100); // Add points to local score
          onStepComplete(100);
        }, 1500);
      } else {
        setIsCorrect(false);
        setFeedback('Incorrecto. Revisa tus valores propios.');
      }
    } else if (currentStep.solution && currentStep.solution.startsWith('CONCEPTUAL_LEVEL')) {
      // Check for conceptual answers
      const expectedAnswer = currentStep.solution.split(': ')[1];
      if (userAnswer.toLowerCase().trim() === expectedAnswer.toLowerCase().trim()) {
        setIsCorrect(true);
        setFeedback('¡Concepto entendido! +50 puntos.');
        setTimeout(() => {
          setCurrentLevelScore(prevScore => prevScore + 50); // Add points to local score
          onStepComplete(50);
        }, 1500);
      } else {
        setIsCorrect(false);
        setFeedback('Respuesta conceptual incorrecta. Revisa la pista y el ejemplo.');
      }
    } else {
      // Fallback for conceptual steps without a defined 'solution' or 'eigenvalues'
      setIsCorrect(false);
      setFeedback('Respuesta no válida para este tipo de ejercicio.');
    }
  };

  const autoSolve = () => {
    if (currentStep.eigenvalues) {
      // Auto-solve for numerical eigenvalues
      setUserAnswer(currentStep.eigenvalues.join(','));
      setFeedback('Respuesta automática: Valores propios calculados.');
    } else if (currentStep.solution && currentStep.solution.startsWith('CONCEPTUAL_LEVEL')) {
      // Auto-solve for conceptual answers
      const conceptualAnswer = currentStep.solution.split(': ')[1];
      setUserAnswer(conceptualAnswer);
      setFeedback('Respuesta automática: Concepto rellenado.');
    } else {
      // Fallback for conceptual steps without a defined 'solution' or 'eigenvalues'
      setFeedback('No se puede resolver automáticamente este ejercicio.');
    }
  };

  const renderMatrix = (matrix) => (
    <div className="bg-black rounded-lg p-4 font-mono text-lg">
      {matrix.map((row, rIdx) => (
        <div key={rIdx} className="flex justify-center gap-3">
          {row.map((val, cIdx) => (
            <span key={cIdx} className="matrix-cell text-lg">{val}</span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="glass-card p-4">
        <h3 className="text-xl font-bold text-white mb-2">{currentStep.title}</h3>
        <p className="text-blue-200 text-sm mb-4">{currentStep.description}</p>
        <p className="text-blue-300 text-base mb-4"><strong>Cómo se resuelve:</strong> {currentStep.generalExplanation}</p>
        {currentStep.matrix && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white mb-2">Matriz:</h4>
            {renderMatrix(currentStep.matrix)}
          </div>
        )}
        
      </div>

      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Tu Respuesta</h4>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="custom-input w-full text-lg mb-4"
          placeholder="Ingresa tu respuesta"
        />
        <div className="flex gap-4 mb-4 flex-wrap">
          <button onClick={checkAnswer} className="btn-success">Verificar Respuesta</button>
          <button onClick={autoSolve} className="btn-primary">Responder Automáticamente</button>
          <button onClick={() => setShowHint(!showHint)} className="btn-secondary">
            {showHint ? 'Ocultar' : 'Mostrar'} Pista
          </button>
        </div>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500 text-yellow-300 rounded-lg p-4 mt-4"
          >
            <strong>Pista:</strong> {currentStep.hint}
          </motion.div>
        )}

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-4 mt-4 ${isCorrect ? 'bg-green-500 text-green-300' : 'bg-blue-500 text-blue-300'}`}
          >
            {feedback}
          </motion.div>
        )}
      </div>

      
    </div>
  );
}
