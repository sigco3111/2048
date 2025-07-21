
import { useState, useEffect, useCallback, useRef } from 'react';
import type { TileState, Coords } from '../types';
import { GRID_SIZE, WINNING_VALUE } from '../constants';

const GAME_STATE_KEY = 'gameState2048';

const isWithinBounds = (coords: Coords) =>
  coords.row >= 0 && coords.row < GRID_SIZE && coords.col >= 0 && coords.col < GRID_SIZE;

export const useGameLogic = () => {
  const [tiles, setTiles] = useState<TileState[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('bestScore2048') || '0', 10);
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  
  const [moves, setMoves] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [winStats, setWinStats] = useState<{ duration: number; moves: number; score: number; } | null>(null);

  const nextId = useRef(1);

  const getEmptyCells = useCallback((currentTiles: TileState[]): Coords[] => {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
    currentTiles.forEach(tile => {
      if (isWithinBounds(tile)) {
        grid[tile.row][tile.col] = true;
      }
    });

    const emptyCells: Coords[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!grid[row][col]) {
          emptyCells.push({ row, col });
        }
      }
    }
    return emptyCells;
  }, []);

  const addNewTile = useCallback((currentTiles: TileState[]): TileState[] => {
    const emptyCells = getEmptyCells(currentTiles);
    if (emptyCells.length === 0) {
      return currentTiles;
    }

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    const newTile: TileState = {
      id: nextId.current++,
      value,
      row: randomCell.row,
      col: randomCell.col,
      isNew: true,
    };
    return [...currentTiles, newTile];
  }, [getEmptyCells]);

  const isMovePossible = useCallback((currentTiles: TileState[]): boolean => {
    if (getEmptyCells(currentTiles).length > 0) return true;

    const grid: Record<string, number> = {};
    currentTiles.forEach(tile => {
      grid[`${tile.row},${tile.col}`] = tile.value;
    });

    for (const tile of currentTiles) {
      const { row, col, value } = tile;
      if ((grid[`${row},${col + 1}`] === value) || (grid[`${row + 1},${col}`] === value)) {
        return true;
      }
    }
    return false;
  }, [getEmptyCells]);

  const makeMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (isGameOver || isWinner) return;

    const vectors = { up: { r: -1, c: 0 }, down: { r: 1, c: 0 }, left: { r: 0, c: -1 }, right: { r: 0, c: 1 } };
    const vector = vectors[direction];

    const sortedTiles = [...tiles].sort((a, b) => {
        if (vector.r === 1) return b.row - a.row;
        if (vector.r === -1) return a.row - b.row;
        if (vector.c === 1) return b.col - a.col;
        if (vector.c === -1) return a.col - b.col;
        return 0;
    });

    const tileState = new Map<number, TileState>();
    const occupied = new Map<string, TileState>();
    let scoreToAdd = 0;
    let moved = false;
    let mergeCount = 0;

    for (const tile of tiles) {
        const cleanTile = { ...tile, isNew: false, isMerged: false };
        tileState.set(tile.id, cleanTile);
        occupied.set(`${tile.row},${tile.col}`, cleanTile);
    }
    
    for (const tile of sortedTiles) {
        const currentTile = tileState.get(tile.id);
        if (!currentTile) continue;

        occupied.delete(`${currentTile.row},${currentTile.col}`);

        let farthestPos = { row: currentTile.row, col: currentTile.col };
        while (true) {
            const nextPos = { row: farthestPos.row + vector.r, col: farthestPos.col + vector.c };
            if (!isWithinBounds(nextPos) || occupied.has(`${nextPos.row},${nextPos.col}`)) break;
            farthestPos = nextPos;
        }

        if (currentTile.row !== farthestPos.row || currentTile.col !== farthestPos.col) {
            moved = true;
        }
        
        currentTile.row = farthestPos.row;
        currentTile.col = farthestPos.col;

        const nextPos = { row: currentTile.row + vector.r, col: currentTile.col + vector.c };
        const nextTile = occupied.get(`${nextPos.row},${nextPos.col}`);

        if (nextTile && nextTile.value === currentTile.value && !nextTile.isMerged) {
            nextTile.value *= 2;
            nextTile.isMerged = true;
            scoreToAdd += nextTile.value;
            tileState.delete(currentTile.id);
            moved = true;
            mergeCount++;

            if (!hasWon && nextTile.value === WINNING_VALUE) {
              setHasWon(true);
              setIsWinner(true);
              const endTime = Date.now();
              setWinStats({
                  duration: endTime - (gameStartTime || endTime),
                  moves: moves + 1,
                  score: score + scoreToAdd
              });
            }

        } else {
            occupied.set(`${currentTile.row},${currentTile.col}`, currentTile);
        }
    }

    if (moved) {
        let finalTiles = Array.from(tileState.values());
        finalTiles = addNewTile(finalTiles);
        setTiles(finalTiles);
        setScore(prev => prev + scoreToAdd);
        setComboCount(mergeCount);
        setMoves(prev => prev + 1);

        if (!isMovePossible(finalTiles)) {
            setIsGameOver(true);
        }
    }
  }, [tiles, isGameOver, isWinner, hasWon, addNewTile, isMovePossible, score, moves, gameStartTime]);

  useEffect(() => {
    if (comboCount > 0) {
      const timer = setTimeout(() => setComboCount(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [comboCount]);

  const resetGame = useCallback(() => {
    setIsGameOver(false);
    setHasWon(false);
    setIsWinner(false);
    setScore(0);
    setComboCount(0);
    setMoves(0);
    setGameStartTime(Date.now());
    setWinStats(null);
    nextId.current = 1;
    let initialTiles = addNewTile([]);
    initialTiles = addNewTile(initialTiles);
    setTiles(initialTiles);
  }, [addNewTile]);

  useEffect(() => {
    const savedStateJSON = localStorage.getItem(GAME_STATE_KEY);
    if (savedStateJSON) {
      try {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState && typeof savedState.score !== 'undefined' && Array.isArray(savedState.tiles)) {
          setTiles(savedState.tiles);
          setScore(savedState.score);
          setMoves(savedState.moves || 0);
          setGameStartTime(savedState.gameStartTime || Date.now());
          setHasWon(savedState.hasWon || false);
          setIsGameOver(savedState.isGameOver || false);
          nextId.current = savedState.nextId || Math.max(0, ...savedState.tiles.map((t: TileState) => t.id)) + 1;

          if (!savedState.isGameOver && savedState.tiles.length >= GRID_SIZE * GRID_SIZE && !isMovePossible(savedState.tiles)) {
              setIsGameOver(true);
          }
        } else {
          resetGame();
        }
      } catch (error) {
        console.error("Failed to load or parse game state. Starting a new game.", error);
        resetGame();
      }
    } else {
      resetGame();
    }
  }, [resetGame, isMovePossible]);

  useEffect(() => {
    if (gameStartTime) {
      const gameState = {
        tiles,
        score,
        moves,
        gameStartTime,
        hasWon,
        isGameOver,
        nextId: nextId.current,
      };
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    }
  }, [tiles, score, moves, gameStartTime, hasWon, isGameOver]);


  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('bestScore2048', score.toString());
    }
  }, [score, bestScore]);
  
  const continueGame = () => {
    setIsWinner(false);
  };
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    let direction: 'up' | 'down' | 'left' | 'right' | null = null;
    
    switch (event.key) {
      case 'ArrowLeft': direction = 'left'; break;
      case 'ArrowRight': direction = 'right'; break;
      case 'ArrowUp': direction = 'up'; break;
      case 'ArrowDown': direction = 'down'; break;
      default: return;
    }

    event.preventDefault();
    makeMove(direction);
    
  }, [makeMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { 
    tiles, score, bestScore, isGameOver, isWinner, comboCount, winStats, 
    resetGame, makeMove, continueGame
  };
};