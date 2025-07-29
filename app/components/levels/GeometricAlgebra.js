'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stage, Layer, Line, Circle, Group, Text } from 'react-konva';

export default function GeometricAlgebra({ step, onStepComplete, onLevelComplete }) {
  const [points, setPoints] = useState([]);
  const [transformedPoints, setTransformedPoints] = useState([]);
  const [matrix, setMatrix] = useState([[1, 0], [0, 1]]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showVectors, setShowVectors] = useState(false);
  const [feedback, setFeedback] = useState('');

  const steps = [
    {
      title: "Vectores y Matrices",
      description: "Representa vectores como matrices y aplica transformaciones",
      points: [[0, 0], [2, 0], [2, 2], [0, 2]],
      matrix: [[1, 0], [0, 1]],
      target: "Cuadrado unitario",
      hint: "Los vectores se representan como matrices columna"
    },
    {
      title: "Rotación de Figuras",
      description: "Rota una figura usando matrices de rotación",
      points: [[0, 0], [3, 0], [3, 2], [0, 2]],
      matrix: [[0, -1], [1, 0]],
      target: "Rotación 90°",
      hint: "La matriz de rotación de 90° es [[0, -1], [1, 0]]"
    },
    {
      title: "Escalado y Reflexión",
      description: "Combina escalado con reflexión",
      points: [[0, 0], [2, 0], [2, 1], [0, 1]],
      matrix: [[-2, 0], [0, 2]],
      target: "Reflexión en Y y escalado 2x",
      hint: "Multiplica por -1 para reflexión, por 2 para escalado"
    },
    {
      title: "Transformación Lineal",
      description: "Aplica una transformación lineal general",
      points: [[0, 0], [1, 0], [1, 1], [0, 1]],
      matrix: [[1, 1], [0, 1]],
      target: "Cizalla en X",
      hint: "La matriz [[1, 1], [0, 1]] aplica cizalla horizontal"
    },
    {
      title: "Composición de Transformaciones",
      description: "Aplica múltiples transformaciones en secuencia",
      points: [[0, 0], [2, 0], [2, 2], [0, 2]],
      matrix: [[0.707, -0.707], [0.707, 0.707]],
      target: "Rotación 45° + escalado",
      hint: "Combina rotación de 45° con escalado de √2"
    }
  ];

  const currentStep = steps[step] || steps[0];

  useEffect(() => {
    if (step >= steps.length) {
      onLevelComplete();
      return;
    }

    const stepData = steps[step];
    setPoints(stepData.points);
    setMatrix(stepData.matrix);
    setIsCorrect(false);
    setShowVectors(false);
    setFeedback('');
    
    // Aplicar transformación inicial
    applyTransformation(stepData.points, stepData.matrix);
  }, [step]);

  const applyTransformation = (inputPoints, transformMatrix) => {
    const transformed = inputPoints.map(point => {
      const [x, y] = point;
      const newX = transformMatrix[0][0] * x + transformMatrix[0][1] * y;
      const newY = transformMatrix[1][0] * x + transformMatrix[1][1] * y;
      return [newX, newY];
    });
    setTransformedPoints(transformed);
  };

  const checkAnswer = () => {
    // Verificar si las transformaciones son correctas
    const tolerance = 0.1;
    let correct = true;
    let correctCount = 0;
    
    transformedPoints.forEach((point, index) => {
      const expected = points[index];
      if (Math.abs(point[0] - expected[0]) < tolerance && 
          Math.abs(point[1] - expected[1]) < tolerance) {
        correctCount++;
      } else {
        correct = false;
      }
    });
    
    if (correct) {
      setIsCorrect(true);
      setFeedback('¡Perfecto! Todas las transformaciones son correctas.');
      setTimeout(() => {
        onStepComplete(125);
      }, 2000);
    } else {
      setIsCorrect(false);
      setFeedback(`${correctCount} de ${transformedPoints.length} puntos están correctamente transformados.`);
    }
  };

  const drawPolygon = (points, color, strokeWidth = 2) => {
    const flatPoints = points.flat();
    return (
      <Line
        points={flatPoints}
        stroke={color}
        strokeWidth={strokeWidth}
        closed={true}
        fill={`${color}20`}
      />
    );
  };

  const drawVectors = (points, color) => {
    return points.map((point, index) => (
      <Group key={index}>
        <Line
          points={[0, 0, point[0] * 50, point[1] * 50]}
          stroke={color}
          strokeWidth={2}
        />
        <Circle
          x={point[0] * 50}
          y={point[1] * 50}
          radius={3}
          fill={color}
        />
        <Text
          text={`v${index + 1}`}
          x={point[0] * 50 + 5}
          y={point[1] * 50 - 10}
          fontSize={12}
          fill={color}
        />
      </Group>
    ));
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
              
              {/* Ejes coordenados */}
              <Line points={[0, 300, 800, 300]} stroke="#ffffff40" strokeWidth={2} />
              <Line points={[400, 0, 400, 600]} stroke="#ffffff40" strokeWidth={2} />
              
              {/* Figura original */}
              <Group x={150} y={150}>
                {drawPolygon(points, '#ff6b6b', 3)}
                <Text
                  text="Original"
                  x={-30}
                  y={-30}
                  fontSize={14}
                  fill="#ff6b6b"
                />
              </Group>
              
              {/* Figura transformada */}
              <Group x={550} y={150}>
                {drawPolygon(transformedPoints, '#4ecdc4', 3)}
                <Text
                  text="Transformada"
                  x={-40}
                  y={-30}
                  fontSize={14}
                  fill="#4ecdc4"
                />
              </Group>
              
              {/* Vectores base */}
              {showVectors && (
                <Group x={150} y={450}>
                  {drawVectors(points, '#ff6b6b')}
                  <Text
                    text="Vectores Base"
                    x={-50}
                    y={-30}
                    fontSize={12}
                    fill="#ff6b6b"
                  />
                </Group>
              )}
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Controles y información */}
      <div className="glass-card p-6">
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => {
              applyTransformation(points, matrix);
              setFeedback('Transformación aplicada. Verifica el resultado.');
            }}
            className="btn-primary"
          >
            Aplicar Transformación
          </button>
          <button
            onClick={() => setShowVectors(!showVectors)}
            className="btn-secondary"
          >
            {showVectors ? 'Ocultar' : 'Mostrar'} Vectores
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
            ¡Correcto! +125 puntos
          </motion.div>
        )}
      </div>

      {/* Información y pistas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-blue-300 mb-3">Matriz de Transformación</h4>
          <div className="bg-black rounded-lg p-4 font-mono text-lg">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="matrix-cell text-lg">{matrix[0][0].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{matrix[0][1].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{matrix[1][0].toFixed(3)}</div>
              <div className="matrix-cell text-lg">{matrix[1][1].toFixed(3)}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-green-300 mb-3">Puntos Originales</h4>
          <div className="bg-black rounded-lg p-4 font-mono text-sm">
            {points.map((point, index) => (
              <div key={index} className="text-green-200 text-xs">
                P{index + 1}: ({point[0]}, {point[1]})
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-purple-300 mb-3">Puntos Transformados</h4>
          <div className="bg-black rounded-lg p-4 font-mono text-sm">
            {transformedPoints.map((point, index) => (
              <div key={index} className="text-purple-200 text-xs">
                P'{index + 1}: ({point[0].toFixed(2)}, {point[1].toFixed(2)})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pista y conceptos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-yellow-300 mb-3">Pista</h4>
          <p className="text-yellow-200">{currentStep.hint}</p>
        </div>
        
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-blue-300 mb-3">Conceptos Clave</h4>
          <ul className="text-blue-200 space-y-1">
            <li>• <strong>Vector:</strong> Punto en el espacio</li>
            <li>• <strong>Matriz:</strong> Transformación lineal</li>
            <li>• <strong>Base:</strong> Vectores generadores</li>
            <li>• <strong>Transformación:</strong> Mapeo de vectores</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 