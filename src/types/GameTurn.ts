import { Entity } from './Entity';

export type GameTurn = Entity & {
  value: number;
  userId: string;
  gameId: string;
};
