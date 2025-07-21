
import React, { useState } from 'react';
import { Tile } from './Tile';
import type { TileState } from '../types';
import { GRID_SIZE } from '../constants';

interface GameBoardProps {
  tiles: TileState[];
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ tiles, onMove }) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const minSwipeDistance = 50; // 50px

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setTouchStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMove = (xEnd: number, yEnd: number) => {
    if (!touchStart) return;

    const dx = xEnd - touchStart.x;
    const dy = yEnd - touchStart.y;

    if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
      if (Math.abs(dx) > minSwipeDistance) {
        if (dx > 0) {
          onMove('right');
        } else {
          onMove('left');
        }
      }
    } else { // Vertical swipe
      if (Math.abs(dy) > minSwipeDistance) {
        if (dy > 0) {
          onMove('down');
        } else {
          onMove('up');
        }
      }
    }
    
    setTouchStart(null); // Reset after move
  };
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart) return;
    handleMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!touchStart) return;
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setTouchStart(null);
  };

  return (
    <div 
      className="bg-slate-800 p-3 sm:p-4 rounded-lg relative touch-none cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`grid grid-cols-4 gap-3 sm:gap-4`}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div key={i} className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-700/50 rounded-md" />
        ))}
      </div>
      <div className="absolute top-0 left-0 p-3 sm:p-4 w-full h-full">
         <div className="relative w-full h-full">
            {tiles.map((tile) => (
              <Tile
                key={tile.id}
                value={tile.value}
                rowIndex={tile.row}
                colIndex={tile.col}
                isNew={!!tile.isNew}
                isMerged={!!tile.isMerged}
              />
            ))}
         </div>
      </div>
    </div>
  );
};