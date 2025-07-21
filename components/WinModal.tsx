
import React from 'react';
import { Confetti } from './Confetti';

interface WinModalProps {
  isVisible: boolean;
  onContinue: () => void;
  onNewGame: () => void;
  winStats: {
    duration: number;
    moves: number;
    score: number;
  } | null;
}

const formatDuration = (milliseconds: number): string => {
    if (milliseconds < 0) milliseconds = 0;
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
      return `${minutes}분 ${seconds}초`;
    }
    return `${seconds}초`;
  };

export const WinModal: React.FC<WinModalProps> = ({ isVisible, onContinue, onNewGame, winStats }) => {
  if (!isVisible) return null;

  const confettiPieces = Array.from({ length: 50 }).map((_, i) => <Confetti key={i} />);

  return (
    <div className="absolute inset-0 bg-slate-900 bg-opacity-70 flex flex-col items-center justify-center rounded-lg z-10 transition-opacity duration-500 animate-fade-in p-4">
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        {confettiPieces}
      </div>
      <div className="relative text-center">
        <h2 className="text-6xl font-extrabold mb-2 text-shine animate-text-shine">승리!</h2>
        <p className="text-lg text-slate-300 mb-6">축하합니다! 2048 타일을 만들었습니다!</p>
        
        {winStats && (
          <div className="mb-8 w-full max-w-sm grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-xs sm:text-sm font-semibold text-slate-400">걸린 시간</p>
              <p className="text-lg sm:text-xl font-bold text-white">{formatDuration(winStats.duration)}</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-xs sm:text-sm font-semibold text-slate-400">총 이동</p>
              <p className="text-lg sm:text-xl font-bold text-white">{winStats.moves}</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-xs sm:text-sm font-semibold text-slate-400">최종 점수</p>
              <p className="text-lg sm:text-xl font-bold text-white">{winStats.score}</p>
            </div>
          </div>
        )}

        <div className="flex space-x-4 justify-center">
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-slate-600 text-white font-bold rounded-md hover:bg-slate-700 transition-colors text-lg"
          >
            계속하기
          </button>
          <button
            onClick={onNewGame}
            className="px-6 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors text-lg"
          >
            새 게임
          </button>
        </div>
      </div>
    </div>
  );
};
