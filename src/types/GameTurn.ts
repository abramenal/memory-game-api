import { Entity } from './Entity';

export type GameTurn = Entity & {
  value: string;
  userId: string;
  gameId: string;
};
