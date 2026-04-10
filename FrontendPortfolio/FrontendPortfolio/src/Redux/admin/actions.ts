import { AdminActionTypes } from './constants';
import type { CreateUserDto } from '../../helpers/model/dto/create-user.dto';

export type AdminActionType = {
  type:    AdminActionTypes;
  payload: any;
};

export const adminApiResponseSuccess = (
  actionType: string, data: any, msg?: string
): AdminActionType => ({
  type:    AdminActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data, msg },
});

export const adminApiResponseError = (
  actionType: string, error: any
): AdminActionType => ({
  type:    AdminActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const GetAllAdminUsers = (): AdminActionType => ({
  type:    AdminActionTypes.GET_ALL_USERS,
  payload: {},
});

export const CreateAdminUser = (dto: CreateUserDto): AdminActionType => ({
  type:    AdminActionTypes.CREATE_USER,
  payload: { dto },
});

export const DeleteAdminUser = (id: string): AdminActionType => ({
  type:    AdminActionTypes.DELETE_USER,
  payload: { id },
});