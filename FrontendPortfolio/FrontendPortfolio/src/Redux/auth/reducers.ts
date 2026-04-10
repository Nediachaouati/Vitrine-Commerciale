import { APICore } from '../../helpers/api/apiCore';
import { AuthActionTypes } from './constants';

const api = new APICore();

const INIT_STATE = {
  user: api.isUserAuthenticated() ? api.getCurrentUserInfo() : null,
  expireToken: false,
  loading: false,
};

type UserData = {
  id?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  token?: string;
};

type AuthActionType = {
  type:
    | AuthActionTypes.API_RESPONSE_SUCCESS
    | AuthActionTypes.API_RESPONSE_ERROR
    | AuthActionTypes.LOGIN_USER
    | AuthActionTypes.SIGNUP_USER
    | AuthActionTypes.LOGOUT_USER
    | AuthActionTypes.FORGOT_PASSWORD
    | AuthActionTypes.INIT_AUTH
    | AuthActionTypes.RESET;
  payload: {
    actionType?: string;
    data?: UserData | {};
    error?: string;
  };
};

type State = {
  user?: UserData | null;
  expireToken: boolean;
  loading?: boolean;
  userLoggedIn?: boolean;
  userLogout?: boolean;
  userSignUp?: boolean;
};

const Auth = (state: State = INIT_STATE, action: AuthActionType): any => {
  switch (action.type) {
    case AuthActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case AuthActionTypes.INIT_AUTH:
        case AuthActionTypes.LOGIN_USER: {
          return {
            ...state,
            user: action.payload.data,
            userLoggedIn: api.isUserAuthenticated(),
            loading: false,
          };
        }

        case AuthActionTypes.LOGOUT_USER: {
          return {
            ...state,
            user: null,
            userLoggedIn: false,
            loading: false,
            userLogout: true,
          };
        }

        case AuthActionTypes.SIGNUP_USER: {
          return {
            ...state,
            userSignUp: true,
            loading: false,
          };
        }

        case AuthActionTypes.FORGOT_PASSWORD: {
          return {
            ...state,
            resetPasswordSuccess: action.payload.data,
            loading: false,
            passwordReset: true,
          };
        }

        default:
          return { ...state };
      }

    case AuthActionTypes.API_RESPONSE_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
        userLoggedIn: false,
      };

    case AuthActionTypes.LOGIN_USER:
      return { ...state, loading: true, userLoggedIn: false };

    case AuthActionTypes.SIGNUP_USER:
      return { ...state, loading: true, userSignUp: false };

    case AuthActionTypes.LOGOUT_USER:
      return { ...state, loading: true, userLogout: false };

    case AuthActionTypes.INIT_AUTH:
      return { ...state, loading: true };

    case AuthActionTypes.RESET:
      return {
        ...state,
        loading: false,
        error: false,
        userSignUp: false,
        passwordReset: false,
        passwordChange: false,
        resetPasswordSuccess: null,
      };

    default:
      return { ...state };
  }
};

export default Auth;
