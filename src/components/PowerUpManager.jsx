import React from 'react';

const PowerUpManager = ({ activePowerUps }) => {
  const getPowerUpTimeRemaining = (powerUp) => {
    const elapsed = Date.now() - powerUp.startTime;
    const remaining = powerUp.duration - elapsed;
    return Math.max(0, remaining / 1000); // Convert to seconds
  };

  return (
    <div className="absolute top-12 left-2 flex flex-col gap-2">
      {activePowerUps.map((powerUp, index) => {
        const timeRemaining = getPowerUpTimeRemaining(powerUp);
        const isExpiringSoon = timeRemaining < 3;
        
        return (
          <div 
            key={`${powerUp.type}-${index}`}
            className={`flex items-center gap-2 text-white ${isExpiringSoon ? 'animate-pulse' : ''}`}
          >
            <span className="text-sm">
              {powerUp.type === 'speed' ? '⚡ Speed Boost' : powerUp.type}
            </span>
            <div className="w-20 h-2 bg-gray-700 rounded">
              <div 
                className="h-full bg-yellow-400 rounded transition-all duration-200"
                style={{ 
                  width: `${(timeRemaining / (powerUp.duration / 1000)) * 100}%`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PowerUpManager;