'use client';

import { motion } from 'framer-motion';

export default function LevelSelector({ levels, onLevelSelect, score }) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {levels.map((level, index) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card p-6 cursor-pointer hover-lift"
            onClick={() => onLevelSelect(level)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">
                {level.id === 1 && '🔄'}
                {level.id === 2 && '⚡'}
                {level.id === 3 && '🔢'}
                {level.id === 4 && '📐'}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                level.difficulty === 'Fácil' ? 'bg-green-500 text-green-300' :
                level.difficulty === 'Intermedio' ? 'bg-yellow-500 text-yellow-300' :
                level.difficulty === 'Difícil' ? 'bg-orange-500 text-orange-300' :
                'bg-red-500 text-red-300'
              }`}>
                {level.difficulty}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              Nivel {level.id}: {level.title}
            </h3>
            
            <p className="text-blue-200 text-sm">
              {level.description}
            </p>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-300">
                Puntos máximos: {level.id * 100}
              </div>
              <div className="text-xs text-blue-300">
                → Comenzar
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {score > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold text-lg">
            🏆 Puntuación Total: {score} puntos
          </div>
        </motion.div>
      )}
    </div>
  );
} 