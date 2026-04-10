export enum AuthActionTypes {
  API_RESPONSE_SUCCESS = '@@auth/API_RESPONSE_SUCCESS',
  API_RESPONSE_ERROR = '@@auth/API_RESPONSE_ERROR',

  LOGIN_USER = '@@auth/LOGIN_USER',
  LOGOUT_USER = '@@auth/LOGOUT_USER',
  SIGNUP_USER = '@@auth/SIGNUP_USER',
  FORGOT_PASSWORD = '@@auth/FORGOT_PASSWORD',
  FORGOT_PASSWORD_CHANGE = '@@auth/FORGOT_PASSWORD_CHANGE',

  // ✅ NEW: hydrate redux from keycloak after init
  INIT_AUTH = '@@auth/INIT_AUTH',

  RESET = '@@auth/RESET',
}
