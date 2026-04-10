/*import { FormationsActionTypes } from './constants';

const INIT_STATE = {
  ListFormationss: [],
  Formations: null,

  // ===== BUILDER (NEW) =====
  FormationExamensWithVersions: null,
  FormationCoursWithQuestions: null,

  msg: '',
  error: '',
};

export default function FormationsRed(state: any = INIT_STATE, action: any): any {
  switch (action.type) {
    case FormationsActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case FormationsActionTypes.GET_ALL:
          return {
            ...state,
            ListFormationss: action.payload.data,
            msg: '',
            error: '',
          };

        case FormationsActionTypes.GET_ONE:
          return {
            ...state,
            Formations: action.payload.data,
            msg: '',
            error: '',
          };

        case FormationsActionTypes.CREATE:
        case FormationsActionTypes.UPDATE:
        case FormationsActionTypes.UPDATEWITHPHOTO:
        case FormationsActionTypes.DELETE:
          return {
            ...state,
            Formations: action.payload.data,
            msg: action.payload.msg,
            error: '',
          };

        default:
          return state;
      }

    case FormationsActionTypes.API_RESPONSE_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };

    default:
      return state;
  }
}
*/