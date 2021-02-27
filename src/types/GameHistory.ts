import { Entity } from './Entity';
import { Game } from './Game';

export type GameTurn = Entity & {
  value: number;
  userId: string;
  gameId: string;
};

export type GameHistory = Game & {
  turns: GameTurn[];
};
