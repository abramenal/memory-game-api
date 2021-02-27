import Joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';

export const CreateGamePayloadSchema = Joi.object({
  userId: Joi.string().required(),
  turnsAmount: Joi.number().required(),
});

export interface CreateGameRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    userId: string;
    turnsAmount: number;
  };
}

export const CreateTurnPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  value: Joi.number().required(),
});

export const CreateTurnParamsSchema = Joi.object({
  gameId: Joi.string().required(),
});

export interface CreateTurnRequest extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    gameId: string;
  };
  [ContainerTypes.Body]: {
    userId: string;
    value: number;
  };
}
