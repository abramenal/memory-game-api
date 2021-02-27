import { Entity } from './Entity';

export type GameStatus = 'started' | 'completed' | 'failed';

export type Game = Entity & {
  status: GameStatus;
  sequence: number[];
  currentTurn: number;
  turnsTotal: number;
  userId: string;
};
