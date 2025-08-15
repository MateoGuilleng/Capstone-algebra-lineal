'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DeterminantesYSubespacios({ step, onStepComplete, onLevelComplete, onTotalStepsChange, level }) {
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentLevelScore, setCurrentLevelScore] = useState(0); // New state to track score within this level

  const steps = [
    {
      title: "Determinante de una matriz 2x2",
      description: "Calcula el determinante de la matriz 2x2 dada.",
      generalExplanation: "Para una matriz 2x2 [[a,b],[c,d]], el determinante es ad - bc.",
      matrix: [[2, 1], [3, 4]],
      determinant: 5,
      hint: "Multiplica los elementos de la diagonal principal y resta el producto de los elementos de la diagonal secundaria."
    },
    {
      title: "Determinante de una matriz 3x3",
      description: "Calcula el determinante de la matriz 3x3 dada. Usa la regla de Sarrus o cofactores.",
      generalExplanation: "Para el determinante de una matriz 3x3, puedes usar la regla de Sarrus (sumar productos de diagonales) o la expansión por cofactores.",
      matrix: [[1, 2, 1], [0, 1, 4], [5, 6, 0]],
      determinant: -19,
      hint: "Aplica la regla de Sarrus: (1*1*0 + 2*4*5 + 1*0*6) - (5*1*1 + 6*4*1 + 0*2*0)."
    },
    {
      title: "Espacio Nulo de una Matriz",
      description: "Encuentra la dimensión y una base para el espacio nulo de la matriz dada. (Formato: dimension=X, base=[v1,v2,...])",
      generalExplanation: "El espacio nulo (kernel) de una matriz A consiste en todos los vectores x para los cuales Ax = 0. Se encuentra resolviendo el sistema homogéneo Ax=0.",
      matrix: [[1, 1, 2], [2, 2, 4], [3, 3, 6]],
      solution: 'CONCEPTUAL_LEVEL: dimension=1, base=[[-1,1,0]]',
      hint: "Reduce la matriz a su forma escalonada por filas para identificar las variables libres y expresar el espacio nulo en términos de ellas."
    },
    {
      title: "Espacio Columna de una Matriz",
      description: "Encuentra la dimensión y una base para el espacio columna de la matriz dada. (Formato: dimension=X, base=[v1,v2,...])",
      generalExplanation: "El espacio columna (imagen) de una matriz A es el espacio generado por sus columnas. Una base se encuentra a partir de las columnas pivote de la matriz en su forma escalonada.",
      matrix: [[1, 1, 2], [2, 2, 4], [3, 3, 6]],
      solution: 'CONCEPTUAL_LEVEL: dimension=1, base=[[1,2,3]]',
      hint: "Las columnas de la matriz original que corresponden a las columnas pivote en la forma escalonada por filas forman una base para el espacio columna."
    },
    {
      title: "Rango de una Matriz",
      description: "Calcula el rango de la matriz dada (dimensión del espacio columna o fila).",
      generalExplanation: "El rango de una matriz es la dimensión de su espacio columna (o espacio fila), que es igual al número de pivotes en su forma escalonada por filas.",
      matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      rank: 2,
      hint: "Reduce la matriz a su forma escalonada por filas y cuenta el número de filas no nulas (o columnas pivote)."
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
      onStepComplete(50);
    }, 1500);
  };

  const checkAnswer = () => {
    if (currentStep.determinant !== undefined && currentStep.determinant !== 'CONCEPTUAL_LEVEL') {
      if (parseFloat(userAnswer) === currentStep.determinant) {
        setIsCorrect(true);
        setFeedback('¡Correcto! Has calculado el determinante.');
        setTimeout(() => {
          setCurrentLevelScore(prevScore => prevScore + 100); // Add points to local score
          onStepComplete(100);
        }, 1500);
      } else {
        setIsCorrect(false);
        setFeedback('Incorrecto. Revisa tu cálculo del determinante.');
      }
    } else if (currentStep.rank !== undefined && currentStep.rank !== 'CONCEPTUAL_LEVEL') {
      if (parseInt(userAnswer) === currentStep.rank) {
        setIsCorrect(true);
        setFeedback('¡Correcto! Has calculado el rango.');
        setTimeout(() => {
          setCurrentLevelScore(prevScore => prevScore + 100); // Add points to local score
          onStepComplete(100);
        }, 1500);
      } else {
        setIsCorrect(false);
        setFeedback('Incorrecto. Revisa tu cálculo del rango.');
      }
    } else if (currentStep.solution && currentStep.solution.startsWith('CONCEPTUAL_LEVEL')) {
      const expectedAnswer = currentStep.solution.split(': ')[1];
      
      // Simple parsing and validation for conceptual answers (dimension and simplified base)
      const expectedDimMatch = expectedAnswer.match(/dimension=(\d+)/);
      const expectedBaseMatch = expectedAnswer.match(/base=\[\[(.*)\]\]/);
      
      const userDimMatch = userAnswer.match(/dimension=(\d+)/);
      const userBaseMatch = userAnswer.match(/base=\[\[(.*)\]\]/);

      let isConceptualCorrect = true;

      if (expectedDimMatch && userDimMatch && parseInt(expectedDimMatch[1]) === parseInt(userDimMatch[1])) {
        setFeedback('Dimensión correcta.');
      } else if (expectedDimMatch) {
        isConceptualCorrect = false;
        setFeedback('Dimensión incorrecta.');
      }

      if (isConceptualCorrect && expectedBaseMatch && userBaseMatch) {
        const expectedBaseStr = expectedBaseMatch[1].replace(/\s/g, ''); // Remove all whitespace
        const userBaseStr = userBaseMatch[1].replace(/\s/g, ''); // Remove all whitespace

        if (expectedBaseStr === userBaseStr) {
          setFeedback(prev => prev + ' Base correcta.');
        } else {
          isConceptualCorrect = false;
          setFeedback(prev => prev + ' Base incorrecta.');
        }
      } else if (isConceptualCorrect && expectedBaseMatch) {
        isConceptualCorrect = false;
        setFeedback(prev => prev + ' Formato de base incorrecto o ausente.');
      }

      if (isConceptualCorrect) {
        setIsCorrect(true);
        setFeedback(prev => (prev ? prev + ' ¡Concepto entendido! +50 puntos.' : '¡Concepto entendido! +50 puntos.'));
        setTimeout(() => {
          setCurrentLevelScore(prevScore => prevScore + 50); // Add points to local score
          onStepComplete(50);
        }, 1500);
      } else {
        setIsCorrect(false);
      }
    }
  };

  const autoSolve = () => {
    if (currentStep.determinant !== undefined && currentStep.determinant !== 'CONCEPTUAL_LEVEL') {
      setUserAnswer(currentStep.determinant.toString());
      setFeedback('Respuesta automática: Determinante calculado.');
    } else if (currentStep.rank !== undefined && currentStep.rank !== 'CONCEPTUAL_LEVEL') {
      setUserAnswer(currentStep.rank.toString());
      setFeedback('Respuesta automática: Rango calculado.');
    } else if (currentStep.solution && currentStep.solution.startsWith('CONCEPTUAL_LEVEL')) {
      const conceptualAnswer = currentStep.solution.split(': ')[1];
      setUserAnswer(conceptualAnswer);
      setFeedback('Respuesta automática: Concepto rellenado.');
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

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Tu Respuesta</h4>
          <input
            type="text" // Changed to text to allow conceptual answers
            step="0.01"
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
    </div>
  );
}
