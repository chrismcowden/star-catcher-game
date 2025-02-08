import React, { useState, useEffect } from 'react';

const Game = () => {
  const [playerX, setPlayerX] = useState(50);
  const [stars, setStars] = useState([{ id: 1, x: 50, y: 0 }]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);

  // Calculate game speed based on score
  const getGameSpeed = () => {
    return Math.max(15, 50 - Math.floor(score / 5) * 3);
  };

  // Calculate number of active stars based on score
  const getMaxStars = () => {
    return Math.min(5, 1 + Math.floor(score / 10));
  };

  // Move player left/right with arrow keys
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && playerX > 0) {
        setPlayerX(x => Math.max(0, x - 5));
      }
      if (e.key === 'ArrowRight' && playerX < 90) {
        setPlayerX(x => Math.min(90, x + 5));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setStars(currentStars => {
        // Move existing stars down
        let newStars = currentStars.map(star => ({
          ...star,
          y: star.y + (1 + Math.floor(score / 15)) // Speed increases with score
        }));

        // Check collisions and bottom reaches
        let missesCount = 0;
        let scoreIncrease = 0;

        newStars = newStars.filter(star => {
          // Check if star reached bottom
          if (star.y >= 90) {
            missesCount++;
            return false;
          }

          // Check collision with player
          if (star.y >= 85 && Math.abs(star.x - playerX) < 10) {
            scoreIncrease++;
            return false;
          }

          return true;
        });

        // Add new stars if needed
        while (newStars.length < getMaxStars()) {
          newStars.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 90,
            y: 0
          });
        }

        // Update score and misses
        if (scoreIncrease > 0) {
          setScore(s => s + scoreIncrease);
          setLevel(Math.floor(score / 10) + 1);
        }
        if (missesCount > 0) {
          setMisses(m => m + missesCount);
        }

        return newStars;
      });
    }, getGameSpeed());

    return () => clearInterval(gameLoop);
  }, [playerX, gameOver, score]);

  // Check game over
  useEffect(() => {
    if (misses >= 3) {
      setGameOver(true);
    }
  }, [misses]);

  // Reset game
  const resetGame = () => {
    setPlayerX(50);
    setStars([{ id: 1, x: 50, y: 0 }]);
    setScore(0);
    setMisses(0);
    setGameOver(false);
    setLevel(1);
  };

  return (
    <div className="relative w-96 h-96 bg-black border-2 border-white">
      {/* Score and Level */}
      <div className="absolute top-2 left-2 text-white">
        Score: {score} | Level: {level} | Misses: {misses}
      </div>

      {/* Stars */}
      {stars.map(star => (
        <div 
          key={star.id}
          className="absolute w-4 h-4 text-yellow-400"
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
        >
          ★
        </div>
      ))}

      {/* Player */}
      <div 
        className="absolute w-8 h-8 bg-blue-500"
        style={{ left: `${playerX}%`, bottom: '5%' }}
      />

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white">
          <h2 className="text-2xl mb-4">Game Over!</h2>
          <p className="mb-4">Final Score: {score}</p>
          <p className="mb-4">Reached Level: {level}</p>
          <button 
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;