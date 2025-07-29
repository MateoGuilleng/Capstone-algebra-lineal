'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import BasicTransformations from './levels/BasicTransformations';
import CompositeTransformations from './levels/CompositeTransformations';
import MatrixEquations from './levels/MatrixEquations';
import GeometricAlgebra from './levels/GeometricAlgebra';

export default function GameContainer({ level, onComplete, onBack }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [totalSteps, setTotalSteps] = useState(5); // Default

  const handleStepComplete = (points) => {
    setScore(score + points);
    setCurrentStep(currentStep + 1);
  };

  const handleLevelComplete = () => {
    const totalPoints = score + (currentStep * 10);
    onComplete(level.id, totalPoints);
  };

  const renderLevel = () => {
    switch (level.id) {
      case 1:
        return (
          <BasicTransformations 
            step={currentStep}
            onStepComplete={handleStepComplete}
            onLevelComplete={handleLevelComplete}
            onTotalStepsChange={setTotalSteps}
          />
        );
      case 2:
        return (
          <CompositeTransformations 
            step={currentStep}
            onStepComplete={handleStepComplete}
            onLevelComplete={handleLevelComplete}
            onTotalStepsChange={setTotalSteps}
          />
        );
      case 3:
        return (
          <MatrixEquations 
            step={currentStep}
            onStepComplete={handleStepComplete}
            onLevelComplete={handleLevelComplete}
            onTotalStepsChange={setTotalSteps}
          />
        );
      case 4:
        return (
          <GeometricAlgebra 
            step={currentStep}
            onStepComplete={handleStepComplete}
            onLevelComplete={handleLevelComplete}
            onTotalStepsChange={setTotalSteps}
          />
        );
      default:
        return <div>Nivel no encontrado</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header del nivel */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
          >
            ← Volver a niveles
          </button>
          <div className="text-right">
            <div className="text-sm text-blue-300">Puntuación actual</div>
            <div className="text-2xl font-bold text-yellow-400">{score}</div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {level.title}
          </h2>
          <p className="text-blue-200">{level.description}</p>
          
          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-blue-300 mb-2">
              <span>Paso {currentStep + 1} de {totalSteps}</span>
              <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contenido del nivel */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderLevel()}
      </motion.div>
    </div>
  );
} 