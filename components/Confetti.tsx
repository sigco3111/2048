
import React from 'react';

const COLORS = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', 
  '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
];

export const Confetti: React.FC = () => {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: '8px',
    height: '16px',
    top: '-20px',
    left: `${Math.random() * 100}%`,
    backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: Math.random() + 0.5,
    transform: `rotate(${Math.random() * 360}deg)`,
    animationName: 'fall',
    animationDuration: `${Math.random() * 3 + 3}s`, // 3-6 seconds
    animationDelay: `${Math.random() * 5}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  };
  
  return <div style={style}></div>;
};
