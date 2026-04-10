import { ProfileActionTypes } from './constants';

const INIT_STATE = {
  profile: null,
  loading: false,
  msg: '',
  error: '',
};

export default function ProfileReducer(state = INIT_STATE, action: any) {
  switch (action.type) {
    case ProfileActionTypes.GET_MY_PROFILE:
    case ProfileActionTypes.UPDATE_MY_PROFILE:
    case ProfileActionTypes.UPLOAD_AVATAR:
      return { ...state, loading: true, msg: '', error: '' };

    case ProfileActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case ProfileActionTypes.GET_MY_PROFILE:
        case ProfileActionTypes.UPDATE_MY_PROFILE:
          return { 
            ...state, 
            profile: action.payload.data, 
            loading: false,
            msg: action.payload.msg || ''
          };

        case ProfileActionTypes.UPLOAD_AVATAR:
          return { 
            ...state, 
            loading: false,
            msg: action.payload.msg || ''
          };

        default:
          return state;
      }

    case ProfileActionTypes.API_RESPONSE_ERROR:
      return { ...state, error: action.payload.error, loading: false };

    default:
      return state;
  }
}