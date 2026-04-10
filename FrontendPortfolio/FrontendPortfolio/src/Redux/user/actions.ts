import { User } from '../../helpers';
import { UserActionTypes } from './constants';

export type UserActionType = {
  type:
    | UserActionTypes.API_RESPONSE_SUCCESS
    | UserActionTypes.API_RESPONSE_ERROR
    | UserActionTypes.GET_ALL
    | UserActionTypes.GET_ALL_FORMATEUR
    | UserActionTypes.GET_ALL_ADMIN
    | UserActionTypes.GET_ALL_APPRENAT
    | UserActionTypes.GET_ONE
    | UserActionTypes.UPDATE
    | UserActionTypes.DELETE
    | UserActionTypes.CREATE;
  payload: any;
};

type UserData = {
  payload: User;
  type: string;
};

export const userApiResponseSuccess = (actionType: string, data: any, msg?: string | {}): UserActionType => ({
  type: UserActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data, msg },
});

export const userApiResponseError = (actionType: string, error: any): UserActionType => ({
  type: UserActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const AddUser = (user: User): UserActionType => ({
  type: UserActionTypes.CREATE,
  payload: { user },
});

export const DeleteUser = (user: User): UserActionType => ({
  type: UserActionTypes.DELETE,
  payload: user,
});

export const GetAllUsers = (): UserActionType => ({
  type: UserActionTypes.GET_ALL,
  payload: {},
});

export const GetUserById = (user: User): UserActionType => ({
  type: UserActionTypes.GET_ONE,
  payload: user,
});

export const UpdateUser = (user: User): UserActionType => ({
  type: UserActionTypes.UPDATE,
  payload: { user },
});

export const GetAllUsersAdmin = (): UserActionType => ({
  type: UserActionTypes.GET_ALL_ADMIN,
  payload: {},
});
export const GetAllUsersFORMATEUR = (): UserActionType => ({
  type: UserActionTypes.GET_ALL_FORMATEUR,
  payload: {},
});
export const GetAllUsersAPPRENANT = (): UserActionType => ({
  type: UserActionTypes.GET_ALL_APPRENAT,
  payload: {},
});
