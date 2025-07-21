import React from 'react';

interface HeaderProps {
  score: number;
  bestScore: number;
}

export const Header: React.FC<HeaderProps> = ({ score, bestScore }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col">
        <h1 className="text-5xl sm:text-6xl font-bold text-white">2048</h1>
        <p className="text-slate-400">숫자를 합쳐 <span className="font-bold text-yellow-400">2048 타일</span>을 만들어보세요!</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex flex-col items-center justify-center bg-slate-800 p-2 rounded-md min-w-[100px]">
          <span className="text-sm font-semibold text-slate-400">점수</span>
          <span key={score} className="text-2xl font-bold text-white animate-score-pop">{score}</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-slate-800 p-2 rounded-md min-w-[100px]">
          <span className="text-sm font-semibold text-slate-400">최고 점수</span>
          <span key={bestScore} className="text-2xl font-bold text-white animate-score-pop">{bestScore}</span>
        </div>
      </div>
    </div>
  );
};