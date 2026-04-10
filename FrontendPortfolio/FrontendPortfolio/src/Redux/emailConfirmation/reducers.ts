/*
import { EmailConfirmationActionTypes } from './constants';

const INIT_STATE = {
  ListEmailConfirmations: [],
  EmailConfirmation: null,
  msg: '',
  error: '',
};

export default function EmailConfirmationRed(state: any = INIT_STATE, action: any): any {
  switch (action.type) {
    case EmailConfirmationActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case EmailConfirmationActionTypes.GET_ALL:
          return {
            ...state,
            ListEmailConfirmations: action.payload.data,
            msg: '',
            error: '',
          };

        case EmailConfirmationActionTypes.GET_ONE:
          return {
            ...state,
            EmailConfirmation: action.payload.data,
            msg: '',
            error: '',
          };

        case EmailConfirmationActionTypes.CREATE:
        case EmailConfirmationActionTypes.UPDATE:
        case EmailConfirmationActionTypes.DELETE:
          return {
            ...state,
            EmailConfirmation: action.payload.data,
            msg: action.payload.msg,
            error: '',
          };

        default:
          return state;
      }

    case EmailConfirmationActionTypes.API_RESPONSE_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };

    default:
      return state;
  }
}
*/