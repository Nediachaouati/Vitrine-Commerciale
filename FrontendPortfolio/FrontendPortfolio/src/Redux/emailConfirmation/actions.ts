/*
import { EmailConfirmation } from '../../helpers';
import { EmailConfirmationActionTypes } from './constants';

export type EmailConfirmationActionType = {
  type:
    | EmailConfirmationActionTypes.API_RESPONSE_SUCCESS
    | EmailConfirmationActionTypes.API_RESPONSE_ERROR
    | EmailConfirmationActionTypes.GET_ALL
    | EmailConfirmationActionTypes.GET_ONE
    | EmailConfirmationActionTypes.UPDATE
    | EmailConfirmationActionTypes.DELETE
    | EmailConfirmationActionTypes.CREATE;
  payload: any;
};

type EmailConfirmationData = {
  payload: EmailConfirmation;
  type: string;
};

export const emailconfirmationApiResponseSuccess = (actionType: string, data: any, msg?: string | {}): EmailConfirmationActionType => ({
  type: EmailConfirmationActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data, msg },
});

export const emailconfirmationApiResponseError = (actionType: string, error: any): EmailConfirmationActionType => ({
  type: EmailConfirmationActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const AddEmailConfirmation = (emailconfirmation: EmailConfirmation): EmailConfirmationActionType => ({
  type: EmailConfirmationActionTypes.CREATE,
  payload: { emailconfirmation },
});

export const DeleteEmailConfirmation = (emailconfirmation: EmailConfirmation): EmailConfirmationActionType => ({
  type: EmailConfirmationActionTypes.DELETE,
  payload: { emailconfirmation },
});

export const GetAllEmailConfirmations = (): EmailConfirmationActionType => ({
  type: EmailConfirmationActionTypes.GET_ALL,
  payload: {},
});

export const GetEmailConfirmationById = (idEmailConfirmation: number): EmailConfirmationActionType => ({
  type: EmailConfirmationActionTypes.GET_ONE,
  payload: { idEmailConfirmation },
});

export const UpdateEmailConfirmation = (emailconfirmation: EmailConfirmation): EmailConfirmationActionType => ({
  type: EmailConfirmationActionTypes.UPDATE,
  payload: { emailconfirmation },
});*/
