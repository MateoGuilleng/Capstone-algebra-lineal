'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stage, Layer, Line, Circle, Group } from 'react-konva';

export default function BasicTransformations({ step, onStepComplete, onLevelComplete, onTotalStepsChange, level }) {
  const [shape, setShape] = useState({ x: 200, y: 200, rotation: 0, scale: 1 });
  const [target, setTarget] = useState({ x: 400, y: 200, rotation: 0, scale: 1 });
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentLevelScore, setCurrentLevelScore] = useState(0); // New state to track score within this level

  const steps = [
    {
      title: "Rotación de 90°",
      description: "Arrastra el triángulo para que coincida con el objetivo. Aplica una rotación de 90 grados en sentido horario",
      targetRotation: 90,
      targetScale: 1,
      hint: "La matriz de rotación de 90° es [[0, -1], [1, 0]]. Esto transforma (x,y) en (-y,x)."
    },
    {
      title: "Escalado 2x",
      description: "Arrastra el triángulo para que coincida con el objetivo. Aplica un escalado de 2 en ambas direcciones",
      targetRotation: 0,
      targetScale: 2,
      hint: "La matriz de escalado 2x es [[2, 0], [0, 2]]. Esto multiplica tanto x como y por 2."
    },
    {
      title: "Rotación de 180°",
      description: "Arrastra el triángulo para que coincida con el objetivo. Aplica una rotación de 180 grados",
      targetRotation: 180,
      targetScale: 1,
      hint: "La matriz de rotación de 180° es [[-1, 0], [0, -1]]. Esto transforma (x,y) en (-x,-y)."
    },
    {
      title: "Escalado 0.5x",
      description: "Arrastra el triángulo para que coincida con el objetivo. Aplica un escalado de 0.5 (reducción a la mitad)",
      targetRotation: 0,
      targetScale: 0.5,
      hint: "La matriz de escalado 0.5x es [[0.5, 0], [0, 0.5]]. Esto multiplica tanto x como y por 0.5."
    },
    {
      title: "Rotación de 45°",
      description: "Arrastra el triángulo para que coincida con el objetivo. Aplica una rotación de 45 grados",
      targetRotation: 45,
      targetScale: 1,
      hint: "La matriz de rotación de 45° es [[0.707, -0.707], [0.707, 0.707]]. Usa cos(45°) y sin(45°)."
    },
    {
      title: "Escalado No Uniforme",
      description: "Arrastra el triángulo para que coincida con el objetivo. Aplica escalado 2 en X y 1.5 en Y",
      targetRotation: 0,
      targetScale: 1.5,
      hint: "La matriz de escalado no uniforme es [[2, 0], [0, 1.5]]. Diferente escala en cada dirección."
    },
    {
      title: "Rotación de 270°",
      description: "Arrastra el triángulo para que coincida con el objetivo. Aplica una rotación de 270 grados",
      targetRotation: 270,
      targetScale: 1,
      hint: "La matriz de rotación de 270° es [[0, 1], [-1, 0]]. Esto transforma (x,y) en (y,-x)."
    },
    {
      title: "Combinación Final",
      description: "Arrastra el triángulo para que coincida con el objetivo. Combina rotación y escalado",
      targetRotation: 45,
      targetScale: 1.5,
      hint: "Combina rotación de 45° con escalado de 1.5. La matriz resultante es [[1.06, -1.06], [1.06, 1.06]]."
    }
  ];

  const currentStep = steps[step] || steps[0];

  useEffect(() => {
    // Informar el número total de pasos
    onTotalStepsChange(steps.length);
    
    if (step >= steps.length) {
      onLevelComplete(level.id, currentLevelScore); // Pass level.id and accumulated score when level completes
      return;
    }

    const stepData = steps[step];
    setTarget({
      x: 400,
      y: 200,
      rotation: stepData.targetRotation || 0,
      scale: stepData.targetScale || 1
    });
    setShape({ x: 200, y: 200, rotation: 0, scale: 1 });
    setIsCorrect(false);
    setFeedback('');
    setShowHint(false);
  }, [step, onTotalStepsChange]);

  const checkAnswer = () => {
    const tolerance = 5;
    const rotationTolerance = 10;
    const scaleTolerance = 0.1;
    
    const positionMatch = Math.abs(shape.x - target.x) < tolerance && 
                         Math.abs(shape.y - target.y) < tolerance;
    const rotationMatch = Math.abs(shape.rotation - target.rotation) < rotationTolerance;
    const scaleMatch = Math.abs(shape.scale - target.scale) < scaleTolerance;
    
    if (positionMatch && rotationMatch && scaleMatch) {
      setIsCorrect(true);
      setFeedback('¡Perfecto! Has aplicado correctamente la transformación.');
      setTimeout(() => {
        setCurrentLevelScore(prevScore => prevScore + 100); // Add points to local score
        onStepComplete(100); // Signal step completion (for progress bar, GameContainer adds to currentLevelPoints)
      }, 2000);
    } else {
      setIsCorrect(false);
      let feedbackText = 'Necesitas ajustar: ';
      if (!positionMatch) feedbackText += 'posición, ';
      if (!rotationMatch) feedbackText += 'rotación, ';
      if (!scaleMatch) feedbackText += 'escala, ';
      feedbackText = feedbackText.slice(0, -2) + '.';
      setFeedback(feedbackText);
    }
  };

  const resetShape = () => {
    setShape({ x: 200, y: 200, rotation: 0, scale: 1 });
    setFeedback('Forma reiniciada a la posición original.');
  };

  const applyRotation = (degrees) => {
    setShape({
      ...shape,
      rotation: (shape.rotation + degrees) % 360
    });
    setFeedback(`Rotación aplicada: ${degrees}°`);
  };

  const applyScale = (factor) => {
    setShape({
      ...shape,
      scale: shape.scale * factor
    });
    setFeedback(`Escalado aplicado: ${factor}x`);
  };

  const applyReflection = (axis) => {
    if (axis === 'x') {
      setShape({
        ...shape,
        scale: shape.scale * -1
      });
      setFeedback('Reflexión aplicada sobre eje X');
    } else if (axis === 'y') {
      setShape({
        ...shape,
        scale: shape.scale * -1
      });
      setFeedback('Reflexión aplicada sobre eje Y');
    }
  };

  // Calcular la matriz de transformación resultante
  const calculateTransformationMatrix = () => {
    const angle = (shape.rotation * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Matriz de rotación
    const rotationMatrix = [
      [cos, -sin],
      [sin, cos]
    ];
    
    // Matriz de escalado
    const scaleMatrix = [
      [shape.scale, 0],
      [0, shape.scale]
    ];
    
    // Multiplicación de matrices (rotación * escalado)
    const result = [
      [
        rotationMatrix[0][0] * scaleMatrix[0][0] + rotationMatrix[0][1] * scaleMatrix[1][0],
        rotationMatrix[0][0] * scaleMatrix[0][1] + rotationMatrix[0][1] * scaleMatrix[1][1]
      ],
      [
        rotationMatrix[1][0] * scaleMatrix[0][0] + rotationMatrix[1][1] * scaleMatrix[1][0],
        rotationMatrix[1][0] * scaleMatrix[0][1] + rotationMatrix[1][1] * scaleMatrix[1][1]
      ]
    ];
    
    return result;
  };

  const drawTriangle = (x, y, rotation, scale) => {
    return (
      <Group
        x={x}
        y={y}
        rotation={rotation}
        scaleX={scale}
        scaleY={scale}
        draggable
        onDragEnd={(e) => {
          setShape({
            ...shape,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
      >
        <Line
          points={[-25, -35, 25, 35, 0, -35]}
          closed={true}
          fill="rgba(59, 130, 246, 0.8)"
          stroke="white"
          strokeWidth={3}
        />
      </Group>
    );
  };

  const renderMatrix = (matrix) => {
    return (
      <div className="bg-black rounded-lg p-4 font-mono text-lg">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="matrix-cell text-lg">{matrix[0][0].toFixed(3)}</div>
          <div className="matrix-cell text-lg">{matrix[0][1].toFixed(3)}</div>
          <div className="matrix-cell text-lg">{matrix[1][0].toFixed(3)}</div>
          <div className="matrix-cell text-lg">{matrix[1][1].toFixed(3)}</div>
        </div>
      </div>
    );
  };

  const transformationMatrix = calculateTransformationMatrix();

  return (
    <div className="space-y-6">
      {/* Header del ejercicio */}
      <div className="glass-card p-4">
        <h3 className="text-xl font-bold text-white mb-2">{currentStep.title}</h3>
        <p className="text-blue-200 text-sm">{currentStep.description}</p>
      </div>

      {/* Área principal - Canvas grande */}
      <div className="glass-card p-6">
        <h4 className="text-xl font-semibold text-white mb-4">Área de Transformación</h4>
        <Stage width={800} height={600} className="mx-auto">
          <Layer>
            {/* Grid */}
            {Array.from({ length: 16 }, (_, i) => (
              <Line
                key={`v${i}`}
                points={[i * 50, 0, i * 50, 600]}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: 12 }, (_, i) => (
              <Line
                key={`h${i}`}
                points={[0, i * 50, 800, i * 50]}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={1}
              />
            ))}
            
            {/* Ejes coordenados */}
            <Line
              points={[0, 300, 800, 300]}
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth={2}
            />
            <Line
              points={[400, 0, 400, 600]}
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth={2}
            />
            
            {/* Forma objetivo */}
            <Group x={target.x} y={target.y} rotation={target.rotation} scaleX={target.scale} scaleY={target.scale}>
              <Line
                points={[-25, -35, 25, 35, 0, -35]}
                stroke="rgba(34, 197, 94, 0.8)"
                strokeWidth={3}
                closed={true}
                fill="rgba(34, 197, 94, 0.3)"
              />
            </Group>
            
            {/* Forma arrastrable */}
            {drawTriangle(shape.x, shape.y, shape.rotation, shape.scale)}
          </Layer>
        </Stage>
      </div>

      {/* Controles */}
      <div className="glass-card p-6 ">
        <h4 className="text-lg font-semibold text-white mb-4">Controles de Transformación</h4>
        
        {/* Rotaciones */}
        <div className="mb-6">
          <h5 className="text-md font-semibold text-blue-300 mb-3">Rotaciones</h5>
          <div className="flex gap-3 items-center justify-between flex-wrap items-end">
            <div>
              <button onClick={() => applyRotation(90)} className="btn-primary">Rotar 90°</button>
              <div className="mt-1 text-xs text-blue-200 font-mono text-center">[[0, -1], [1, 0]]</div>
            </div>
            <div>
              <button onClick={() => applyRotation(180)} className="btn-primary">Rotar 180°</button>
              <div className="mt-1 text-xs text-blue-200 font-mono text-center">[[-1, 0], [0, -1]]</div>
            </div>
            <div>
              <button onClick={() => applyRotation(270)} className="btn-primary">Rotar 270°</button>
              <div className="mt-1 text-xs text-blue-200 font-mono text-center">[[0, 1], [-1, 0]]</div>
            </div>
            <div className='flex flex-col items-center justify-center'>
              <button onClick={() => applyRotation(45)} className="btn-primary">Rotar 45°</button>
              <div className="mt-1 text-xs text-blue-200 font-mono text-center">[[0.707, -0.707], [0.707, 0.707]]</div>
            </div>
          </div>
        </div>

        {/* Escalados */}
        <div className="mb-6">
          <h5 className="text-md font-semibold text-green-300 mb-3">Escalados</h5>
          <div className="flex gap-10 items-center flex-wrap items-end">
            <div>
              <button onClick={() => applyScale(2)} className="btn-secondary">Escalar 2x</button>
              <div className="mt-1 text-xs text-green-200 font-mono text-center">[[2, 0], [0, 2]]</div>
            </div>
            <div>
              <button onClick={() => applyScale(0.5)} className="btn-secondary">Escalar 0.5x</button>
              <div className="mt-1 text-xs text-green-200 font-mono text-center">[[0.5, 0], [0, 0.5]]</div>
            </div>
            <div>
              <button onClick={() => applyScale(1.5)} className="btn-secondary">Escalar 1.5x</button>
              <div className="mt-1 text-xs text-green-200 font-mono text-center">[[1.5, 0], [0, 1.5]]</div>
            </div>
          </div>
        </div>

        {/* Reflexiones */}
        <div className="mb-6">
          <h5 className="text-md font-semibold text-purple-300 mb-3">Reflexiones</h5>
          <div className="flex gap-3 items-center flex-wrap items-end">
            <div>
              <button onClick={() => applyReflection('x')} className="btn-secondary">Reflexión Eje X</button>
              <div className="mt-1 text-xs text-purple-200 font-mono text-center">[[1, 0], [0, -1]]</div>
            </div>
            <div>
              <button onClick={() => applyReflection('y')} className="btn-secondary">Reflexión Eje Y</button>
              <div className="mt-1 text-xs text-purple-200 font-mono text-center">[[-1, 0], [0, 1]]</div>
            </div>
          </div>
        </div>

        {/* Controles principales */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <button
            onClick={checkAnswer}
            className="btn-success"
          >
            Verificar Respuesta
          </button>
          <button
            onClick={resetShape}
            className="btn-secondary"
          >
            Reiniciar Forma
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="btn-primary"
          >
            {showHint ? 'Ocultar' : 'Mostrar'} Pista
          </button>
        </div>
        
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mb-4"
          >
            <h5 className="text-lg font-semibold text-yellow-300 mb-2">Pista Matemática</h5>
            <p className="text-yellow-200 text-sm">{currentStep.hint}</p>
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

      {/* Matriz de Transformación Resultante */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Matriz de Transformación Resultante</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-md font-semibold text-blue-300 mb-3">Matriz Actual</h5>
            {renderMatrix(transformationMatrix)}
            <p className="text-blue-200 text-sm mt-3">
              Esta matriz representa la transformación combinada de rotación y escalado aplicada al triángulo.
            </p>
          </div>
          
          <div>
            <h5 className="text-md font-semibold text-green-300 mb-3">Estado Actual</h5>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span className="text-green-200">Rotación:</span>
                <span className="text-white">{Math.round(shape.rotation)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">Escala:</span>
                <span className="text-white">{shape.scale.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">Posición:</span>
                <span className="text-white">({Math.round(shape.x)}, {Math.round(shape.y)})</span>
              </div>
            </div>
            <p className="text-green-200 text-sm mt-3">
              Arrastra el triángulo para cambiar su posición, rotación y escala.
            </p>
          </div>
        </div>
      </div>

      {/* Información educativa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-blue-300 mb-3">Matrices de Rotación</h4>
          <ul className="text-blue-200 text-sm space-y-2">
            <li>• <strong>90°:</strong> [[0, -1], [1, 0]]</li>
            <li>• <strong>180°:</strong> [[-1, 0], [0, -1]]</li>
            <li>• <strong>270°:</strong> [[0, 1], [-1, 0]]</li>
            <li>• <strong>45°:</strong> [[0.707, -0.707], [0.707, 0.707]]</li>
          </ul>
        </div>
        
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-green-300 mb-3">Matrices de Escalado</h4>
          <ul className="text-green-200 text-sm space-y-2">
            <li>• <strong>Uniforme 2x:</strong> [[2, 0], [0, 2]]</li>
            <li>• <strong>Reducción 0.5x:</strong> [[0.5, 0], [0, 0.5]]</li>
            <li>• <strong>1.5x:</strong> [[1.5, 0], [0, 1.5]]</li>
            <li>• <strong>Identidad:</strong> [[1, 0], [0, 1]]</li>
          </ul>
        </div>
        
        <div className="glass-card p-4">
          <h4 className="text-lg font-semibold text-purple-300 mb-3">Matrices de Reflexión</h4>
          <ul className="text-purple-200 text-sm space-y-2">
            <li>• <strong>Eje X:</strong> [[1, 0], [0, -1]]</li>
            <li>• <strong>Eje Y:</strong> [[-1, 0], [0, 1]]</li>
            <li>• <strong>Origen:</strong> [[-1, 0], [0, -1]]</li>
            <li>• <strong>Diagonal:</strong> [[0, 1], [1, 0]]</li>
          </ul>
        </div>
        
        
      </div>

      {/* Explicación final sobre el triángulo */}
      <div className="glass-card p-6 mt-6">
        <h4 className="text-lg font-semibold text-white mb-3">¿Cómo se construye el triángulo?</h4>
        <p className="text-blue-200 text-base mb-2">
          El triángulo que ves en la escena se define a partir de tres puntos en el plano cartesiano, centrados en el origen (0,0) y escalados para mayor visibilidad:
        </p>
        <div className="bg-black rounded-lg p-4 font-mono text-lg inline-block mb-2">
          A = (-25, -35), B = (25, 35), C = (0, -35)
        </div>
        <p className="text-blue-200 text-base mb-2">
          Estos puntos se agrupan en una matriz de coordenadas columna:
        </p>
        <div className="bg-black rounded-lg p-4 font-mono text-lg inline-block mb-2">
          <span className="block">Matriz de vértices:</span>
          <span className="block">[[-25, 25, 0], [-35, 35, -35]]</span>
        </div>
        <p className="text-blue-200 text-base mb-2">
          Cuando aplicas una matriz de transformación (rotación, escalado, reflexión), esta se multiplica por la matriz de vértices para obtener la nueva posición de cada punto del triángulo. Por ejemplo, para una rotación de 90°:
        </p>
        <div className="bg-black rounded-lg p-4 font-mono text-lg inline-block mb-2">
          <span className="block">Matriz de rotación 90°:</span>
          <span className="block">[[0, -1], [1, 0]]</span>
        </div>
        <p className="text-blue-200 text-base">
          <strong>Resultado:</strong> Cada vértice (x, y) se transforma en (-y, x). Así, el triángulo rota en el plano. Todas las transformaciones que aplicas en el juego funcionan de esta manera: multiplicando la matriz de transformación por la matriz de vértices del triángulo.
        </p>
      </div>
    </div>
  );
} 