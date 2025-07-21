import React from 'react';
import { TILE_COLORS } from '../constants';

interface TileProps {
  value: number;
  rowIndex: number;
  colIndex: number;
  isNew: boolean;
  isMerged: boolean;
}

export const Tile: React.FC<TileProps> = ({ value, rowIndex, colIndex, isNew, isMerged }) => {
  const colorClass = TILE_COLORS[value] || TILE_COLORS[8192];
  const positionClasses = `absolute transition-all duration-300 ease-out-expo`;
  
  const animationClass = isNew ? 'animate-spawn-in' : isMerged ? 'animate-merge-enhanced' : '';

  const style = {
    top: `calc(${rowIndex} * (5rem + 0.75rem))`, // h-20 + gap-3
    left: `calc(${colIndex} * (5rem + 0.75rem))`,
  };
  
  // Responsive styles
  const smStyle = {
    top: `calc(${rowIndex} * (6rem + 1rem))`, // h-24 + gap-4
    left: `calc(${colIndex} * (6rem + 1rem))`,
  }

  const textSize = value >= 1024 ? 'text-3xl' : value >= 10000 ? 'text-2xl' : 'text-4xl';

  return (
    <>
      {/* Mobile and smaller */}
      <div
        className={`sm:hidden ${positionClasses} ${animationClass} w-20 h-20 rounded-md flex items-center justify-center font-bold ${textSize} ${colorClass} select-none`}
        style={style}
      >
        {value}
      </div>
      {/* sm and larger */}
      <div
        className={`hidden sm:flex ${positionClasses} ${animationClass} w-24 h-24 rounded-md items-center justify-center font-bold ${textSize} ${colorClass} select-none`}
        style={smStyle}
      >
        {value}
      </div>
    </>
  );
};