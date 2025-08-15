'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BasicTransformations from './levels/BasicTransformations';
import DeterminantesYSubespacios from './levels/DeterminantesYSubespacios';
import MatrixEquations from './levels/MatrixEquations';
import Diagonalizacion from './levels/Diagonalizacion';
import QuizGeneral from './levels/QuizGeneral';

export default function GameContainer({ level, onComplete, onBack, currentGlobalScore }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentLevelPoints, setCurrentLevelPoints] = useState(0);
  const [totalSteps, setTotalSteps] = useState(5);

  useEffect(() => {
    setCurrentLevelPoints(0);
  }, [level]);

  const handleStepComplete = (points) => {
    setCurrentLevelPoints(prevPoints => prevPoints + points);
    setCurrentStep(currentStep + 1);
  };

  const handleLevelComplete = (levelId, pointsFromLevel) => {
    onComplete(levelId, currentLevelPoints);
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
            level={level} 
          />
        );
      case 2:
        return (
          <DeterminantesYSubespacios 
            step={currentStep}
            onStepComplete={handleStepComplete}
            onLevelComplete={handleLevelComplete}
            onTotalStepsChange={setTotalSteps}
            level={level} 
          />
        );
      case 3:
        return (
          <MatrixEquations 
            step={currentStep}
            onStepComplete={handleStepComplete}
            onLevelComplete={handleLevelComplete}
            onTotalStepsChange={setTotalSteps}
            level={level} 
          />
        );
      case 4:
        return (
          <Diagonalizacion 
            step={currentStep}
            onStepComplete={handleStepComplete}
            onLevelComplete={handleLevelComplete}
            onTotalStepsChange={setTotalSteps}
            level={level} 
          />
        );
      case 5:
        return (
          <QuizGeneral 
            level={level}
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
            <div className="text-2xl font-bold text-yellow-400">{currentLevelPoints}</div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {level.title}
          </h2>
          <p className="text-blue-200">{level.description}</p>
          
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