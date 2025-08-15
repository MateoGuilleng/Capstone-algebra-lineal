'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MatrixEquations({ step, onStepComplete, onLevelComplete, onTotalStepsChange, level }) {
  const [coefficients, setCoefficients] = useState([[2, 1], [1, 3]]);
  const [constants, setConstants] = useState([5, 6]);
  const [solution, setSolution] = useState([0, 0]);
  const [userSolution, setUserSolution] = useState(['', '']);
  const [calculatedSolution, setCalculatedSolution] = useState([0, 0]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [properties, setProperties] = useState({
    linearlyIndependent: false,
    consistent: false,
    hasUniqueSolution: false,
    homogeneous: false,
    symmetric: false
  });
  const [propertiesCorrect, setPropertiesCorrect] = useState(false);
  const [propertiesChecked, setPropertiesChecked] = useState(false);
  const [currentLevelScore, setCurrentLevelScore] = useState(0);

  const steps = [
    {
      title: "Sistema 2x2 Básico",
      description: "Resuelve el sistema usando eliminación gaussiana",
      coefficients: [[2, 1], [1, 3]],
      constants: [5, 6],
      solution: [1, 3],
      hint: "Usa eliminación gaussiana: multiplica la primera ecuación por 1/2",
      properties: {
        linearlyIndependent: true,
        consistent: true,
        hasUniqueSolution: true,
        homogeneous: false,
        symmetric: true
      }
    },
    {
      title: "Sistema con Fracciones",
      description: "Resuelve el sistema. La eliminación gaussiana/Gauss-Jordan puede introducir coeficientes fraccionarios.",
      coefficients: [[1, 2], [3, 1]],
      constants: [4, 5],
      solution: [1, 1.5],
      hint: "Usa eliminación Gauss-Jordan: haz la primera columna cero debajo del pivote, luego la segunda.",
      properties: {
        linearlyIndependent: true,
        consistent: true,
        hasUniqueSolution: true,
        homogeneous: false,
        symmetric: false
      }
    },
    {
      title: "Sistema 3x3 Complejo",
      description: "Resuelve un sistema de tres ecuaciones con tres incógnitas",
      coefficients: [[2, 1, -1], [1, 3, 2], [3, 2, 1]],
      constants: [4, 7, 8],
      solution: [1, 2, 0],
      hint: "Usa eliminación gaussiana paso a paso, empezando por la primera ecuación",
      properties: {
        linearlyIndependent: true,
        consistent: true,
        hasUniqueSolution: true,
        homogeneous: false,
        symmetric: false
      }
    },
    {
      title: "Sistema 4x4 Avanzado",
      description: "Sistema de cuatro ecuaciones con cuatro incógnitas",
      coefficients: [[1, 2, 0, 1], [2, 1, 1, 0], [0, 1, 2, 1], [1, 0, 1, 2]],
      constants: [4, 3, 4, 3],
      solution: [1, 1, 1, 1],
      hint: "Sistema grande, usa eliminación gaussiana sistemáticamente",
      properties: {
        linearlyIndependent: true,
        consistent: true,
        hasUniqueSolution: true,
        homogeneous: false,
        symmetric: true
      }
    },
    {
      title: "Sistema Homogéneo",
      description: "Sistema homogéneo (términos independientes = 0)",
      coefficients: [[1, 2, 1], [2, 4, 2], [1, 2, 1]],
      constants: [0, 0, 0],
      solution: 'INFINITE_SOLUTIONS',
      hint: "Sistema homogéneo con infinitas soluciones. Busca las variables libres.",
      properties: {
        linearlyIndependent: false,
        consistent: true,
        hasUniqueSolution: false,
        homogeneous: true,
        symmetric: false
      }
    },
    {
      title: "Sistema Dependiente",
      description: "Identifica si el sistema tiene solución única",
      coefficients: [[1, 2], [2, 4]],
      constants: [3, 6],
      solution: [3, 0],
      hint: "Las ecuaciones son proporcionales, hay infinitas soluciones",
      properties: {
        linearlyIndependent: false,
        consistent: true,
        hasUniqueSolution: false,
        homogeneous: false,
        symmetric: false
      }
    },
    {
      title: "Sistema Inconsistente",
      description: "Identifica cuando no hay solución",
      coefficients: [[1, 1], [1, 1]],
      constants: [2, 3],
      solution: null,
      hint: "Las ecuaciones son contradictorias, no hay solución",
      properties: {
        linearlyIndependent: false,
        consistent: false,
        hasUniqueSolution: false,
        homogeneous: false,
        symmetric: true
      }
    },
    {
      title: "Sistema Simétrico",
      description: "Matriz de coeficientes simétrica",
      coefficients: [[2, 1, 0], [1, 3, 1], [0, 1, 2]],
      constants: [3, 5, 3],
      solution: [1, 1, 1],
      hint: "Matriz simétrica: A = A^T",
      properties: {
        linearlyIndependent: true,
        consistent: true,
        hasUniqueSolution: true,
        homogeneous: false,
        symmetric: true
      }
    }
  ];

  const currentStep = steps[step] || steps[0];

  useEffect(() => {
    onTotalStepsChange(steps.length);
    
    if (step >= steps.length) {
      onLevelComplete(level.id, currentLevelScore);
      return;
    }

    const stepData = steps[step];
    setCoefficients(stepData.coefficients);
    setConstants(stepData.constants);
    setSolution(stepData.solution);
    setUserSolution(Array(stepData.coefficients.length).fill(''));
    setProperties({
      linearlyIndependent: false,
      consistent: false,
      hasUniqueSolution: false,
      homogeneous: false,
      symmetric: false
    });
    setIsCorrect(false);
    setPropertiesCorrect(false);
    setPropertiesChecked(false);
    setShowHint(false);
    setFeedback('');
    
    try {
      const realSolution = solveSystemWithData(stepData.coefficients, stepData.constants);
      setCalculatedSolution(realSolution);
    } catch (error) {
      setCalculatedSolution(null);
    }
  }, [step, onTotalStepsChange, level]);

  const solveSystemWithData = (coeffs, consts) => {
    const n = coeffs.length;
    
    const augmented = coeffs.map((row, i) => [...row, consts[i]]);
    
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      
      if (Math.abs(augmented[i][i]) < 1e-10) {
        if (Math.abs(augmented[i][n]) > 1e-10) {
          throw new Error('Sistema inconsistente');
        } else {
          return 'INFINITE_SOLUTIONS';
        }
      }
      
      for (let k = i + 1; k < n; k++) {
        const factor = augmented[k][i] / augmented[i][i];
        for (let j = i; j <= n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
    
    const result = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += augmented[i][j] * result[j];
      }
      result[i] = (augmented[i][n] - sum) / augmented[i][i];
    }
    
    return result;
  };

  const solveSystem = () => {
    return solveSystemWithData(coefficients, constants);
  };

  const checkAnswer = () => {
    if (userSolution.every(val => val.toLowerCase().includes('sin solución'))) {
      if (calculatedSolution === null) {
        setIsCorrect(true);
        setFeedback('¡Correcto! Este sistema no tiene solución porque las ecuaciones son contradictorias.');
        setTimeout(() => {
          setCurrentLevelScore(prevScore => prevScore + 100);
          onStepComplete(100);
        }, 2000);
        return;
      } else {
        setIsCorrect(false);
        setFeedback('Incorrecto. Este sistema SÍ tiene solución.');
        return;
      }
    }

    if (userSolution.every(val => val.toLowerCase().includes('infinitas soluciones'))) {
      if (calculatedSolution === 'INFINITE_SOLUTIONS') {
        setIsCorrect(true);
        setFeedback('¡Correcto! Este sistema tiene infinitas soluciones.');
        setTimeout(() => {
          setCurrentLevelScore(prevScore => prevScore + 100);
          onStepComplete(100);
        }, 2000);
        return;
      } else {
        setIsCorrect(false);
        setFeedback('Incorrecto. Este sistema no tiene infinitas soluciones.');
        return;
      }
    }
    
    if (calculatedSolution === null) {
      setIsCorrect(true);
      setFeedback('¡Correcto! Este sistema no tiene solución porque las ecuaciones son contradictorias.');
      setTimeout(() => {
        setCurrentLevelScore(prevScore => prevScore + 100);
        onStepComplete(100);
      }, 2000);
      return;
    }

    const tolerance = 0.1;
    let correct = true;
    let correctCount = 0;
    
    userSolution.forEach((value, index) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && Math.abs(numValue - calculatedSolution[index]) < tolerance) {
        correctCount++;
      } else {
        correct = false;
      }
    });
    
    if (correct) {
      setIsCorrect(true);
      setFeedback('¡Perfecto! Todas las soluciones son correctas.');
      setTimeout(() => {
        setCurrentLevelScore(prevScore => prevScore + 100);
        onStepComplete(100);
      }, 2000);
    } else {
      setIsCorrect(false);
      setFeedback(`${correctCount} de ${calculatedSolution.length} soluciones son correctas. Revisa tus cálculos.`);
    }
  };

  const checkProperties = () => {
    if (propertiesChecked) {
      setFeedback('Ya verificaste las propiedades para esta pregunta. Solo puedes verificar una vez.');
      return;
    }
    
    const expectedProperties = currentStep.properties;
    let allCorrect = true;
    let correctCount = 0;
    
    Object.keys(properties).forEach(key => {
      if (properties[key] === expectedProperties[key]) {
        correctCount++;
      } else {
        allCorrect = false;
      }
    });
    
    setPropertiesChecked(true);
    
    if (allCorrect) {
      setPropertiesCorrect(true);
      setFeedback(`¡Excelente! Todas las propiedades están correctamente identificadas. +${correctCount * 10} puntos extra!`);
      setCurrentLevelScore(prevScore => prevScore + 50);
    } else {
      setPropertiesCorrect(false);
      setFeedback(`${correctCount} de ${Object.keys(properties).length} propiedades son correctas. +${correctCount * 10} puntos extra.`);
    }
  };

  const autoSolveProperties = () => {
    if (propertiesChecked) {
      setFeedback('Ya verificaste las propiedades para esta pregunta. Solo puedes verificar una vez.');
      return;
    }
    
    const expectedProperties = currentStep.properties;
    setProperties(expectedProperties);
    setPropertiesChecked(true);
    setPropertiesCorrect(true);
    setFeedback('Propiedades resueltas automáticamente. +50 puntos extra por identificar todas correctamente.');
    setCurrentLevelScore(prevScore => prevScore + 50);
  };

  const autoSolve = () => {
    try {
      const result = solveSystem();
      if (result === 'INFINITE_SOLUTIONS') {
        setUserSolution(Array(coefficients.length).fill('Infinitas soluciones'));
        setFeedback('Este sistema tiene infinitas soluciones.');
      } else {
        setUserSolution(result.map(x => x.toFixed(2)));
        setFeedback('Sistema resuelto automáticamente usando eliminación gaussiana.');
      }
    } catch (error) {
      if (error.message === 'Sistema inconsistente') {
        setFeedback('Este sistema no tiene solución (sistema inconsistente).');
        setUserSolution(Array(coefficients.length).fill('Sin solución'));
      } else {
        setFeedback('Error al resolver el sistema. Verifica que el sistema sea válido.');
      }
    }
  };

  const renderMatrix = (matrix, constants) => {
    return (
      <div className="bg-black rounded-lg p-6 font-mono text-lg">
        {matrix.map((row, i) => (
          <div key={i} className="flex items-center justify-center gap-3 mb-3">
            {row.map((coeff, j) => (
              <div key={j} className="matrix-cell text-lg">
                {coeff}
              </div>
            ))}
            <span className="text-white mx-3 text-xl">|</span>
            <div className="bg-blue-500 text-blue-300 p-3 rounded w-16 text-center text-lg">
              {constants[i]}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-4">
        <h3 className="text-xl font-bold text-white mb-2">{currentStep.title}</h3>
        <p className="text-blue-200 text-sm">{currentStep.description}</p>
      </div>

      <div className="glass-card p-6">
        <h4 className="text-xl font-semibold text-white mb-4">Sistema de Ecuaciones</h4>
        {renderMatrix(coefficients, constants)}
      </div>

      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Solución</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {userSolution.map((value, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-blue-300 text-lg">x{index + 1} =</span>
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => {
                  const newSolution = [...userSolution];
                  newSolution[index] = e.target.value;
                  setUserSolution(newSolution);
                }}
                className="custom-input w-32 text-lg"
                placeholder={currentStep.solution === 'INFINITE_SOLUTIONS' ? 'Infinitas soluciones' : (currentStep.solution === null ? 'Sin solución' : '0')}
              />
            </div>
          ))}
        </div>
        
        <div className="flex gap-4 mb-4 flex-wrap">
          <button
            onClick={checkAnswer}
            className="btn-success"
          >
            Verificar Solución
          </button>
          <button
            onClick={autoSolve}
            className="btn-primary"
          >
            Resolver Automáticamente
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="btn-secondary"
          >
            {showHint ? 'Ocultar' : 'Mostrar'} Pista
          </button>
        </div>
        
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500 text-yellow-300 rounded-lg p-4 mb-4"
          >
            <strong>Pista:</strong> {currentStep.hint}
          </motion.div>
        )}
        
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-4 mb-4 ${
              isCorrect 
                ? 'bg-green-500 text-green-300' 
                : 'bg-blue-500 text-blue-300'
            }`}
          >
            {feedback}
          </motion.div>
        )}
        
        {isCorrect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500 text-green-300 rounded-lg p-4"
          >
            ¡Correcto! +100 puntos
          </motion.div>
        )}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Propiedades de la Matriz</h4>
          <div className="text-yellow-300 text-sm bg-yellow-500/20 px-3 py-1 rounded">
            ⚠️ Solo puntos extra - No avanza pregunta
          </div>
        </div>
        
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-4">
          <p className="text-blue-200 text-sm">
            <strong>💡 Información:</strong> Esta sección es solo para ganar puntos extra. 
            Cada propiedad correcta suma 10 puntos. Solo puedes verificar una vez por pregunta. 
            Para avanzar al siguiente ejercicio, debes resolver el sistema de ecuaciones correctamente.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={properties.linearlyIndependent}
              onChange={(e) => setProperties({
                ...properties,
                linearlyIndependent: e.target.checked
              })}
              className="w-4 h-4"
            />
            <span className="text-blue-200">Linealmente Independiente</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={properties.consistent}
              onChange={(e) => setProperties({
                ...properties,
                consistent: e.target.checked
              })}
              className="w-4 h-4"
            />
            <span className="text-blue-200">Consistente</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={properties.hasUniqueSolution}
              onChange={(e) => setProperties({
                ...properties,
                hasUniqueSolution: e.target.checked
              })}
              className="w-4 h-4"
            />
            <span className="text-blue-200">Solución Única</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={properties.homogeneous}
              onChange={(e) => setProperties({
                ...properties,
                homogeneous: e.target.checked
              })}
              className="w-4 h-4"
            />
            <span className="text-blue-200">Homogéneo</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={properties.symmetric}
              onChange={(e) => setProperties({
                ...properties,
                symmetric: e.target.checked
              })}
              className="w-4 h-4"
            />
            <span className="text-blue-200">Simétrico</span>
          </label>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={checkProperties}
            className="btn-primary"
            disabled={propertiesChecked}
          >
            {propertiesChecked ? 'Ya Verificado' : 'Verificar Propiedades'}
          </button>
          <button
            onClick={autoSolveProperties}
            className="btn-secondary"
            disabled={propertiesChecked}
          >
            {propertiesChecked ? 'Ya Resuelto' : 'Resolver Propiedades Automáticamente'}
          </button>
        </div>
        
        {propertiesCorrect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500 text-green-300 rounded-lg p-4 mt-4"
          >
            ¡Propiedades correctas! +50 puntos extra (solo una vez por pregunta)
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-blue-300 mb-3">Eliminación Gaussiana</h4>
          <ol className="text-blue-200 text-sm space-y-2">
            <li>1. Formar la matriz aumentada</li>
            <li>2. Usar operaciones elementales</li>
            <li>3. Triangularizar la matriz</li>
            <li>4. Sustitución hacia atrás</li>
          </ol>
        </div>
        
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-green-300 mb-3">Propiedades Clave</h4>
          <ul className="text-green-200 text-sm space-y-1">
            <li>• <strong>Independiente:</strong> det(A) ≠ 0</li>
            <li>• <strong>Consistente:</strong> Sistema tiene solución</li>
            <li>• <strong>Homogéneo:</strong> Todos los términos = 0</li>
            <li>• <strong>Simétrico:</strong> A = A^T</li>
          </ul>
        </div>
        
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-purple-300 mb-3">Tipos de Sistemas</h4>
          <ul className="text-purple-200 text-sm space-y-1">
            <li>• <strong>Consistente:</strong> Tiene solución única</li>
            <li>• <strong>Dependiente:</strong> Infinitas soluciones</li>
            <li>• <strong>Inconsistente:</strong> Sin solución</li>
          </ul>
        </div>
      </div>
    </div>
  );
}