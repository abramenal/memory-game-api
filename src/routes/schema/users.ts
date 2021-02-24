import Joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';

export const GetUsersParamsSchema = Joi.object({
  username: Joi.string().required(),
});

export interface GetUsersRequest extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    username: string;
  };
}

export const CreateUserPayloadSchema = Joi.object({
  username: Joi.string().required(),
});

export interface CreateUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    username: string;
  };
}

export const GetUserHistoryParamsSchema = Joi.object({
  userId: Joi.string().required(),
});

export interface GetUserHistoryRequest extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    userId: string;
  };
}
