import { AdminActionTypes } from './constants';

const INIT_STATE = {
  listUsers: [],
  loading:   false,
  msg:       '',
  error:     '',
};

export default function AdminReducer(
  state: any = INIT_STATE,
  action: any
): any {
  switch (action.type) {
    case AdminActionTypes.GET_ALL_USERS:
    case AdminActionTypes.CREATE_USER:
    case AdminActionTypes.DELETE_USER:
      return { ...state, loading: true, msg: '', error: '' };

    case AdminActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case AdminActionTypes.GET_ALL_USERS:
          return { ...state, listUsers: action.payload.data, loading: false, msg: '' };
        case AdminActionTypes.CREATE_USER:
        case AdminActionTypes.DELETE_USER:
          return { ...state, loading: false, msg: action.payload.msg };
        default:
          return state;
      }

    case AdminActionTypes.API_RESPONSE_ERROR:
      return { ...state, error: action.payload.error, loading: false };

    default:
      return state;
  }
}