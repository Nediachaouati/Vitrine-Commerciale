import { UserActionTypes } from './constants';

const INIT_STATE = {
  ListUsers: [],
  ListUsersAdmin: [],
  ListUsersFormateur: [],
  ListUsersApprenant: [],
  User: null,
  msg: '',
  error: '',
};

export default function UserRed(state: any = INIT_STATE, action: any): any {
  switch (action.type) {
    case UserActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case UserActionTypes.GET_ALL:
          return {
            ...state,
            ListUsers: action.payload.data,
            msg: '',
            error: '',
          };
        case UserActionTypes.GET_ALL_FORMATEUR:
          return {
            ...state,
            ListUsersFormateur: action.payload.data,
            msg: '',
            error: '',
          };
        case UserActionTypes.GET_ALL_APPRENAT:
          return {
            ...state,
            ListUsersApprenant: action.payload.data,
            msg: '',
            error: '',
          };
        case UserActionTypes.GET_ALL_ADMIN:
          return {
            ...state,
            ListUsersAdmin: action.payload.data,
            msg: '',
            error: '',
          };

        case UserActionTypes.GET_ONE:
          return {
            ...state,
            User: action.payload.data,
            msg: '',
            error: '',
          };

        case UserActionTypes.CREATE:
        case UserActionTypes.UPDATE:
        case UserActionTypes.DELETE:
          return {
            ...state,
            User: action.payload.data,
            msg: action.payload.msg,
            error: '',
          };

        default:
          return state;
      }

    case UserActionTypes.API_RESPONSE_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };

    default:
      return state;
  }
}
