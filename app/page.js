'use client';

import { useState } from 'react';
import GameContainer from './components/GameContainer';
import LevelSelector from './components/LevelSelector';
import './globals.css';

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [score, setScore] = useState(0);

  const levels = [
    {
      id: 1,
      title: "Transformaciones Básicas",
      description: "Aprende rotación, escalado y traslación",
      difficulty: "Fácil"
    },
    {
      id: 2,
      title: "Determinantes y Subespacios",
      description: "Calcula determinantes y explora espacios nulos/columna",
      difficulty: "Intermedio"
    },
    {
      id: 3,
      title: "Sistemas de Ecuaciones",
      description: "Resuelve sistemas usando matrices",
      difficulty: "Difícil"
    },
    {
      id: 4,
      title: "Diagonalización",
      description: "Encuentra valores y vectores propios",
      difficulty: "Avanzado"
    },
    {
      id: 5,
      title: "Quiz General",
      description: "Pon a prueba tus conocimientos de Álgebra Lineal",
      difficulty: "Desafío"
    }
  ];

  const handleLevelComplete = (levelId, points) => {
    setScore(prevScore => prevScore + points);
    setCurrentLevel(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🧮 Álgebra Lineal Interactiva
          </h1>
          <p className="text-xl text-blue-200 mb-4">
            Aprende matrices y transformaciones de forma divertida
          </p>
          {
            <div className="inline-block bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
              Puntuación: {score} puntos
            </div>
          }
        </header>

        {currentLevel ? (
          <GameContainer 
            level={currentLevel} 
            onComplete={handleLevelComplete}
            onBack={() => setCurrentLevel(null)}
            currentGlobalScore={score}
          />
        ) : (
          <LevelSelector 
            levels={levels} 
            onLevelSelect={setCurrentLevel}
            score={score}
          />
        )}
      </div>
    </div>
  );
}
