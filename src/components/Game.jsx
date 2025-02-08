import React, { useState, useEffect } from 'react';
import PowerUpManager from './PowerUpManager';
import StarManager from './StarManager';

const SPEED_POWERUP_DURATION = 5000; // 5 seconds
const PLAYER_BASE_SPEED = 5;
const SPEED_BOOST_MULTIPLIER = 2;

const Game = () => {
  const [playerX, setPlayerX] = useState(50);
  const [stars, setStars] = useState([{ id: 1, x: 50, y: 0, type: 'normal' }]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [activePowerUps, setActivePowerUps] = useState([]);

  const getGameSpeed = () => {
    return Math.max(15, 50 - Math.floor(score / 5) * 3);
  };

  const getMaxStars = () => {
    return Math.min(5, 1 + Math.floor(score / 10));
  };

  const hasActivePowerUp = (type) => {
    return activePowerUps.some(powerUp => 
      powerUp.type === type && 
      Date.now() - powerUp.startTime < powerUp.duration
    );
  };

  const getPlayerMoveSpeed = () => {
    return hasActivePowerUp('speed') ? 
      PLAYER_BASE_SPEED * SPEED_BOOST_MULTIPLIER : 
      PLAYER_BASE_SPEED;
  };

  // Move player left/right with arrow keys
  useEffect(() => {
    const handleKeyPress = (e) => {
      const moveSpeed = getPlayerMoveSpeed();
      
      if (e.key === 'ArrowLeft' && playerX > 0) {
        setPlayerX(x => Math.max(0, x - moveSpeed));
      }
      if (e.key === 'ArrowRight' && playerX < 90) {
        setPlayerX(x => Math.min(90, x + moveSpeed));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activePowerUps]);

  // Power-up cleanup effect
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setActivePowerUps(current => 
        current.filter(powerUp => 
          Date.now() - powerUp.startTime < powerUp.duration
        )
      );
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setStars(currentStars => {
        let newStars = currentStars.map(star => ({
          ...star,
          y: star.y + (1 + Math.floor(score / 15))
        }));

        let missesCount = 0;
        let scoreIncrease = 0;

        newStars = newStars.filter(star => {
          if (star.y >= 90) {
            missesCount++;
            return false;
          }

          if (star.y >= 85 && Math.abs(star.x - playerX) < 10) {
            scoreIncrease++;
            
            // Handle power-up collection
            if (star.type === 'speed') {
              setActivePowerUps(current => [...current, {
                type: 'speed',
                duration: SPEED_POWERUP_DURATION,
                startTime: Date.now()
              }]);
            }
            
            return false;
          }

          return true;
        });

        // Add new stars if needed
        while (newStars.length < getMaxStars()) {
          const isSpeedStar = Math.random() < 0.1; // 10% chance for speed star
          newStars.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 90,
            y: 0,
            type: isSpeedStar ? 'speed' : 'normal'
          });
        }

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

  useEffect(() => {
    if (misses >= 3) {
      setGameOver(true);
    }
  }, [misses]);

  const resetGame = () => {
    setPlayerX(50);
    setStars([{ id: 1, x: 50, y: 0, type: 'normal' }]);
    setScore(0);
    setMisses(0);
    setGameOver(false);
    setLevel(1);
    setActivePowerUps([]);
  };

  return (
    <div className="relative w-96 h-96 bg-black border-2 border-white">
      {/* Score and Level */}
      <div className="absolute top-2 left-2 text-white">
        Score: {score} | Level: {level} | Misses: {misses}
      </div>

      {/* Power-up Manager */}
      <PowerUpManager activePowerUps={activePowerUps} />

      {/* Stars */}
      <StarManager stars={stars} />

      {/* Player */}
      <div 
        className={`absolute w-8 h-8 transition-colors duration-200 ${
          hasActivePowerUp('speed') ? 'bg-blue-400' : 'bg-blue-500'
        }`}
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