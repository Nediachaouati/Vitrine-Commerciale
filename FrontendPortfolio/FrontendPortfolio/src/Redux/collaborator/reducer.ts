// Redux/collaborator/reducer.ts
import { CollaboratorActionTypes } from './constants';
import type { CollaboratorFull } from '../../helpers/model/dto/collaborator.dto';

interface CollaboratorState {
  collab: CollaboratorFull | null;
  loading: boolean;
  msg: string;
  error: string;
}

const INIT_STATE: CollaboratorState = {
  collab: null,
  loading: false,
  msg: '',
  error: '',
};

export default function CollaboratorReducer(state = INIT_STATE, action: any): CollaboratorState {
  switch (action.type) {
    case CollaboratorActionTypes.GET_ME:
    case CollaboratorActionTypes.ADD_SKILL:
    case CollaboratorActionTypes.UPDATE_SKILL:
    case CollaboratorActionTypes.DELETE_SKILL:
    case CollaboratorActionTypes.ADD_EXPERIENCE:
    case CollaboratorActionTypes.UPDATE_EXPERIENCE:
    case CollaboratorActionTypes.DELETE_EXPERIENCE:
    case CollaboratorActionTypes.ADD_EDUCATION:
    case CollaboratorActionTypes.UPDATE_EDUCATION:
    case CollaboratorActionTypes.DELETE_EDUCATION:
    case CollaboratorActionTypes.ADD_CERTIFICATION:
    case CollaboratorActionTypes.UPDATE_CERTIFICATION:
    case CollaboratorActionTypes.DELETE_CERTIFICATION:
    case CollaboratorActionTypes.ADD_PROJECT:
    case CollaboratorActionTypes.UPDATE_PROJECT:
    case CollaboratorActionTypes.DELETE_PROJECT:
      return { ...state, loading: true, msg: '', error: '' };

    case CollaboratorActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case CollaboratorActionTypes.GET_ME:
          return { ...state, loading: false, collab: action.payload.data, error: '' };
        default:
          // Pour tous les ADD/UPDATE/DELETE → recharger le profil complet
          return { ...state, loading: false, msg: action.payload.msg || 'Succès', error: '' };
      }

    case CollaboratorActionTypes.API_RESPONSE_ERROR:
      return { ...state, loading: false, error: action.payload.error || 'Erreur', msg: '' };

    case CollaboratorActionTypes.CLEAR_MSG:
      return { ...state, msg: '', error: '' };

    default:
      return state;
  }
}