import { RealisationActionTypes } from './constants';
import type { RealisationResponseDto } from '../../helpers/model/dto/realisation.dto';

interface RealisationState {
  realisations: RealisationResponseDto[];
  selectedId: number | null;
  formOpen: boolean;
  editingId: number | null; // null = création
  loading: boolean;
  saving: boolean;
  msg: string;
  error: string;
}

const INIT_STATE: RealisationState = {
  realisations: [],
  selectedId: null,
  formOpen: false,
  editingId: null,
  loading: false,
  saving: false,
  msg: '',
  error: '',
};

export default function RealisationReducer(
  state = INIT_STATE,
  action: any
): RealisationState {
  switch (action.type) {

    // ── Loaders ────────────────────────────────────────────────────
    case RealisationActionTypes.LOAD_MY_REALISATIONS:
      return { ...state, loading: true, msg: '', error: '' };

    case RealisationActionTypes.CREATE_REALISATION:
    case RealisationActionTypes.UPDATE_REALISATION:
    case RealisationActionTypes.DELETE_REALISATION:
      return { ...state, saving: true, msg: '', error: '' };

    // ── UI ─────────────────────────────────────────────────────────
    case RealisationActionTypes.SELECT_REALISATION:
      return { ...state, selectedId: action.payload.id };

    case RealisationActionTypes.OPEN_FORM:
      return { ...state, formOpen: true, editingId: action.payload.id };

    case RealisationActionTypes.CLOSE_FORM:
      return { ...state, formOpen: false, editingId: null };

    case RealisationActionTypes.CLEAR_MSG:
      return { ...state, msg: '', error: '' };

    // ── Succès ─────────────────────────────────────────────────────
    case RealisationActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {

        case RealisationActionTypes.LOAD_MY_REALISATIONS:
          return { ...state, loading: false, realisations: action.payload.data ?? [] };

        case RealisationActionTypes.CREATE_REALISATION:
          return {
            ...state,
            saving: false,
            formOpen: false,
            editingId: null,
            msg: 'Réalisation créée avec succès',
            realisations: [action.payload.data, ...state.realisations],
          };

        case RealisationActionTypes.UPDATE_REALISATION:
          return {
            ...state,
            saving: false,
            formOpen: false,
            editingId: null,
            msg: 'Réalisation mise à jour',
            realisations: state.realisations.map((r) =>
              r.realisationId === action.payload.data.realisationId
                ? action.payload.data
                : r
            ),
          };

        case RealisationActionTypes.DELETE_REALISATION:
          return {
            ...state,
            saving: false,
            msg: 'Réalisation supprimée',
            realisations: state.realisations.filter(
              (r) => r.realisationId !== action.payload.data.id
            ),
          };

        default:
          return { ...state, loading: false, saving: false };
      }

    // ── Erreurs ────────────────────────────────────────────────────
    case RealisationActionTypes.API_RESPONSE_ERROR:
      return {
        ...state,
        loading: false,
        saving: false,
        error: action.payload.error || 'Erreur',
        msg: '',
      };

    default:
      return state;
  }
}