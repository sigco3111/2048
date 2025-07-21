
import React from 'react';
import { GameBoard } from './components/GameBoard';
import { Header } from './components/Header';
import { GameOverModal } from './components/GameOverModal';
import { WinModal } from './components/WinModal';
import { useGameLogic } from './hooks/useGameLogic';

const App: React.FC = () => {
  const { 
    tiles, 
    score, 
    bestScore, 
    isGameOver, 
    isWinner,
    comboCount,
    winStats,
    resetGame, 
    makeMove,
    continueGame
  } = useGameLogic();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 font-sans text-white bg-slate-900">
      <main className="flex flex-col items-center w-full max-w-md mx-auto">
        <Header score={score} bestScore={bestScore} />
        <div className="relative mt-6">
          <GameBoard tiles={tiles} onMove={makeMove} />
          {comboCount > 1 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div 
                className="text-6xl font-extrabold text-white animate-combo-pop" 
                style={{ textShadow: '0 0 15px rgba(255, 165, 0, 0.8), 0 0 25px rgba(255, 255, 0, 0.6)' }}
              >
                COMBO x{comboCount}
              </div>
            </div>
          )}
          <GameOverModal isVisible={isGameOver} score={score} onRestart={resetGame} />
          <WinModal isVisible={isWinner} onContinue={continueGame} onNewGame={resetGame} winStats={winStats} />
        </div>
        <div className="mt-8 w-full text-slate-400">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">게임 방법:</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors"
              >
                새 게임
              </button>
            </div>
          </div>
          <p>키보드 <span className="font-bold text-slate-300">화살표 키</span> 또는 <span className="font-bold text-slate-300">스와이프</span>를 사용하여 타일을 움직이세요.</p>
          <p>같은 숫자의 타일이 만나면 하나로 합쳐집니다.</p>
          <p>숫자를 더해서 <span className="font-bold text-yellow-400">2048 타일</span>을 만들어보세요!</p>
        </div>
      </main>
      <footer className="absolute bottom-4 text-xs text-slate-500">
        React, TypeScript, Tailwind CSS로 만들었습니다.
      </footer>
    </div>
  );
};

export default App;