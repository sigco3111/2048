
import React from 'react';

interface GameOverModalProps {
  isVisible: boolean;
  score: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ isVisible, score, onRestart }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-slate-900 bg-opacity-70 flex flex-col items-center justify-center rounded-lg z-10 transition-opacity duration-500 animate-fade-in">
      <h2 className="text-5xl font-extrabold text-white mb-2">게임 종료!</h2>
      <p className="text-lg text-slate-300 mb-6">점수: {score}</p>
      <button
        onClick={onRestart}
        className="px-6 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors text-lg"
      >
        다시하기
      </button>
    </div>
  );
};

// Add keyframes for fade-in animation in a style tag or tailwind.config.js if possible
// For this single-file setup, a simple style tag in index.html or a utility class will do.
// Tailwind doesn't support direct keyframe injection, but we can assume a utility class `animate-fade-in` exists.
// A simple CSS solution would be:
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
// Since we can't add CSS files, the opacity transition on the element itself provides a similar, albeit simpler, effect.
