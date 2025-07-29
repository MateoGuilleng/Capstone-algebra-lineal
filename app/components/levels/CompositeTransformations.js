'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stage, Layer, Line, Group, Text } from 'react-konva';

export default function CompositeTransformations({ step, onStepComplete, onLevelComplete }) {
  const [shapes, setShapes] = useState([]);
  const [targets, setTargets] = useState([]);
  const [matrixA, setMatrixA] = useState([[1, 0], [0, 1]]);
  const [matrixB, setMatrixB] = useState([[1, 0], [0, 1]]);
  const [resultMatrix, setResultMatrix] = useState([[1, 0], [0, 1]]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');

  const steps = [
    {
      title: "Multiplicación de Matrices",
      description: "Multiplica dos matrices de transformación",
      matrixA: [[2, 0], [0, 1]],
      matrixB: [[1, 0], [0, 2]],
      result: [[2, 0], [0, 2]],
      hint: "Multiplica A × B para obtener la matriz resultante"
    },
    {
      title: "Rotación + Escalado",
      description: "Combina rotación de 45° con escalado 1.5x",
      matrixA: [[0.707, -0.707], [0.707, 0.707]],
      matrixB: [[1.5, 0], [0, 1.5]],
      result: [[1.06, -1.06], [1.06, 1.06]],
      hint: "Primero rota 45°, luego escala 1.5x"
    },
    {
      title: "Transformación Compuesta",
      description: "Aplica múltiples transformaciones en secuencia",
      matrixA: [[0, -1], [1, 0]],
      matrixB: [[0.5, 0], [0, 0.5]],
      result: [[0, -0.5], [0.5, 0]],
      hint: "Rota 90° y luego escala 0.5x"
    },
    {
      title: "Reflexión + Rotación",
      description: "Combina reflexión con rotación",
      matrixA: [[-1, 0], [0, 1]],
      matrixB: [[0.707, -0.707], [0.707, 0.707]],
      result: [[-0.707, 0.707], [0.707, 0.707]],
      hint: "Refleja en el eje Y y luego rota 45°"
    },
    {
      title: "Transformación Compleja",
      description: "Aplica una transformación compuesta compleja",
      matrixA: [[1, 1], [0, 1]],
      matrixB: [[0.707, -0.707], [0.707, 0.707]],
      result: [[1.414, 0], [0.707, 0.707]],
      hint: "Cizalla en X y luego rota 45°"
    }
  ];

  const currentStep = steps[step] || steps[0];

  useEffect(() => {
    if (step >= steps.length) {
      onLevelComplete();
      return;
    }

    const stepData = steps[step];
    setMatrixA(stepData.matrixA);
    setMatrixB(stepData.matrixB);
    setResultMatrix(stepData.result);
    
    // Crear formas iniciales
    const initialShapes = [
      { id: 1, x: 100, y: 150, points: [0, -20, -15, 15, 15, 15], color: '#ff6b6b' },
      { id: 2, x: 300, y: 150, points: [0, -20, -15, 15, 15, 15], color: '#4ecdc4' },
      { id: 3, x: 500, y: 150, points: [0, -20, -15, 15, 15, 15], color: '#45b7d1' }
    ];
    
    const targetShapes = [
      { id: 1, x: 100, y: 350, points: [0, -20, -15, 15, 15, 15], color: '#00ff00' },
      { id: 2, x: 300, y: 350, points: [0, -20, -15, 15, 15, 15], color: '#00ff00' },
      { id: 3, x: 500, y: 350, points: [0, -20, -15, 15, 15, 15], color: '#00ff00' }
    ];
    
    setShapes(initialShapes);
    setTargets(targetShapes);
    setIsCorrect(false);
    setFeedback('');
  }, [step]);

  const multiplyMatrices = (a, b) => {
    return [
      [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
      [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]]
    ];
  };

  const applyTransformation = (shape, matrix) => {
    // Aplicar transformación matricial a los puntos
    const transformedPoints = [];
    for (let i = 0; i < shape.points.length; i += 2) {
      const x = shape.points[i];
      const y = shape.points[i + 1];
      const newX = matrix[0][0] * x + matrix[0][1] * y;
      const newY = matrix[1][0] * x + matrix[1][1] * y;
      transformedPoints.push(newX, newY);
    }
    
    return {
      ...shape,
      points: transformedPoints
    };
  };

  const applyMatrixA = () => {
    setShapes(shapes.map(shape => applyTransformation(shape, matrixA)));
    setFeedback('Matriz A aplicada a todas las formas.');
  };

  const applyMatrixB = () => {
    setShapes(shapes.map(shape => applyTransformation(shape, matrixB)));
    setFeedback('Matriz B aplicada a todas las formas.');
  };

  const applyComposite = () => {
    const compositeMatrix = multiplyMatrices(matrixA, matrixB);
    setShapes(shapes.map(shape => applyTransformation(shape, compositeMatrix)));
    setFeedback('Transformación compuesta A×B aplicada.');
  };

  const checkAnswer = () => {
    const tolerance = 10;
    let allCorrect = true;
    let correctCount = 0;
    
    shapes.forEach((shape, index) => {
      const target = targets[index];
      if (Math.abs(shape.x - target.x) < tolerance && 
          Math.abs(shape.y - target.y) < tolerance) {
        correctCount++;
      } else {
        allCorrect = false;
      }
    });
    
    if (allCorrect) {
      setIsCorrect(true);
      setFeedback(`¡Perfecto! Todas las formas están en la posición correcta.`);
      setTimeout(() => {
        onStepComplete(75);
      }, 2000);
    } else {
      setIsCorrect(false);
      setFeedback(`${correctCount} de ${shapes.length} formas están en la posición correcta. Sigue intentando.`);
    }
  };

  const resetShapes = () => {
    const initialShapes = [
      { id: 1, x: 100, y: 150, points: [0, -20, -15, 15, 15, 15], color: '#ff6b6b' },
      { id: 2, x: 300, y: 150, points: [0, -20, -15, 15, 15, 15], color: '#4ecdc4' },
      { id: 3, x: 500, y: 150, points: [0, -20, -15, 15, 15, 15], color: '#45b7d1' }
    ];
    setShapes(initialShapes);
    setFeedback('Formas reiniciadas a la posición original.');
  };

  return (
    <div className="space-y-6">
      {/* Header del ejercicio */}
      <div className="glass-card p-4">
        <h3 className="text-xl font-bold text-white mb-2">{currentStep.title}</h3>
        <p className="text-blue-200 text-sm">{currentStep.description}</p>
      </div>

      {/* Área de juego - Toda la pantalla */}
      <div className="glass-card p-6">
        <div className="bg-black rounded-lg p-4">
          <Stage width={800} height={600}>
            <Layer>
              {/* Grid */}
              {Array.from({ length: 16 }, (_, i) => (
                <Line
                  key={`v${i}`}
                  points={[i * 50, 0, i * 50, 600]}
                  stroke="#ffffff20"
                  strokeWidth={1}
                />
              ))}
              {Array.from({ length: 12 }, (_, i) => (
                <Line
                  key={`h${i}`}
                  points={[0, i * 50, 800, i * 50]}
                  stroke="#ffffff20"
                  strokeWidth={1}
                />
              ))}
              
              {/* Formas objetivo */}
              {targets.map((target, index) => (
                <Group key={`target-${index}`} x={target.x} y={target.y}>
                  <Line
                    points={target.points}
                    stroke={target.color}
                    strokeWidth={3}
                    closed={true}
                  />
                  <Text
                    text={`Objetivo ${index + 1}`}
                    x={-30}
                    y={-50}
                    fontSize={12}
                    fill="#00ff00"
                  />
                </Group>
              ))}
              
              {/* Formas transformables */}
              {shapes.map((shape, index) => (
                <Group 
                  key={`shape-${index}`} 
                  x={shape.x} 
                  y={shape.y}
                  draggable
                  onDragEnd={(e) => {
                    const newShapes = [...shapes];
                    newShapes[index] = {
                      ...newShapes[index],
                      x: e.target.x(),
                      y: e.target.y()
                    };
                    setShapes(newShapes);
                  }}
                >
                  <Line
                    points={shape.points}
                    stroke={shape.color}
                    strokeWidth={3}
                    closed={true}
                    fill={`${shape.color}40`}
                  />
                  <Text
                    text={`Forma ${index + 1}`}
                    x={-30}
                    y={-50}
                    fontSize={12}
                    fill={shape.color}
                  />
                </Group>
              ))}
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Controles y información */}
      <div className="glass-card p-6">
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={applyMatrixA}
            className="btn-primary"
          >
            Aplicar Matriz A
          </button>
          <button
            onClick={applyMatrixB}
            className="btn-primary"
          >
            Aplicar Matriz B
          </button>
          <button
            onClick={applyComposite}
            className="btn-primary"
          >
            Aplicar A×B
          </button>
          <button
            onClick={resetShapes}
            className="btn-secondary"
          >
            Reiniciar
          </button>
          <button
            onClick={checkAnswer}
            className="btn-success"
          >
            Verificar
          </button>
        </div>
        
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-4 mb-6 ${
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
            className="bg-green-500 text-green-300 rounded-lg p-4 mb-6"
          >
            ¡Correcto! +75 puntos
          </motion.div>
        )}
      </div>

      {/* Matrices y pistas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-blue-300 mb-3">Matriz A</h4>
          <div className="bg-black rounded-lg p-4 font-mono text-lg">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="matrix-cell text-lg">{matrixA[0][0].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{matrixA[0][1].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{matrixA[1][0].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{matrixA[1][1].toFixed(3)}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-green-300 mb-3">Matriz B</h4>
          <div className="bg-black rounded-lg p-4 font-mono text-lg">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="matrix-cell text-lg">{matrixB[0][0].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{matrixB[0][1].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{matrixB[1][0].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{matrixB[1][1].toFixed(3)}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-purple-300 mb-3">Resultado A×B</h4>
          <div className="bg-black rounded-lg p-4 font-mono text-lg">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="matrix-cell text-lg">{resultMatrix[0][0].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{resultMatrix[0][1].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{resultMatrix[1][0].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{resultMatrix[1][1].toFixed(3)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pista e instrucciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-yellow-300 mb-3">Pista</h4>
          <p className="text-yellow-200">{currentStep.hint}</p>
        </div>
        
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-blue-300 mb-3">Instrucciones</h4>
          <ul className="text-blue-200 space-y-1">
            <li>• Aplica las transformaciones matriciales</li>
            <li>• Usa la multiplicación de matrices</li>
            <li>• Mueve las formas a los objetivos</li>
            <li>• Experimenta con combinaciones</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 