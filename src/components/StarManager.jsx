import React from 'react';

const StarManager = ({ stars }) => {
  const getStarStyle = (type) => {
    switch (type) {
      case 'speed':
        return 'text-blue-400 animate-pulse';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <>
      {stars.map(star => (
        <div 
          key={star.id}
          className={`absolute w-4 h-4 ${getStarStyle(star.type)}`}
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
        >
          {star.type === 'speed' ? '⚡' : '★'}
        </div>
      ))}
    </>
  );
};

export default StarManager;