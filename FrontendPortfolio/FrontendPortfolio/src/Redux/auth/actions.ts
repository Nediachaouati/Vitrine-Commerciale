import { AuthActionTypes } from './constants';

export type AuthActionType = {
  type:
    | AuthActionTypes.API_RESPONSE_SUCCESS
    | AuthActionTypes.API_RESPONSE_ERROR
    | AuthActionTypes.FORGOT_PASSWORD
    | AuthActionTypes.FORGOT_PASSWORD_CHANGE
    | AuthActionTypes.LOGIN_USER
    | AuthActionTypes.LOGOUT_USER
    | AuthActionTypes.RESET
    | AuthActionTypes.SIGNUP_USER
    | AuthActionTypes.INIT_AUTH;
  payload: any;
};

export type UserData = {
  id?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  token?: string;
};

// common success
export const authApiResponseSuccess = (actionType: string, data: UserData | {}): AuthActionType => ({
  type: AuthActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const authApiResponseError = (actionType: string, error: string): AuthActionType => ({
  type: AuthActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// ⚠️ maintenant => déclenche Keycloak login, donc email/password inutiles
export const loginUser = (): AuthActionType => ({
  type: AuthActionTypes.LOGIN_USER,
  payload: {},
});

export const logoutUser = (): AuthActionType => ({
  type: AuthActionTypes.LOGOUT_USER,
  payload: {},
});

// ⚠️ signup aussi passe par Keycloak (redirige vers register si activé)
export const signupUser = (): AuthActionType => ({
  type: AuthActionTypes.SIGNUP_USER,
  payload: {},
});

// forgotPassword possible via Keycloak (page reset) ou backend
export const forgotPassword = (email: string): AuthActionType => ({
  type: AuthActionTypes.FORGOT_PASSWORD,
  payload: { email },
});

// ✅ new: hydrate redux depuis Keycloak
export const initAuth = (): AuthActionType => ({
  type: AuthActionTypes.INIT_AUTH,
  payload: {},
});

export const resetAuth = (): AuthActionType => ({
  type: AuthActionTypes.RESET,
  payload: {},
});
