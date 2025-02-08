export type StarType = 'normal' | 'speed';

export interface Star {
  id: number;
  x: number;
  y: number;
  type: StarType;
}

export interface PowerUp {
  type: StarType;
  duration: number;
  startTime: number;
}

export interface GameState {
  score: number;
  level: number;
  misses: number;
  gameOver: boolean;
  activePowerUps: PowerUp[];
}