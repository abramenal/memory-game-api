import { Entity } from './Entity';

export type GameStatus = 'started' | 'completed' | 'failed';

export type Game = Entity & {
  status: GameStatus;
  sequence: string;
  currentTurn: number;
  turnsTotal: number;
  userId: string;
};
