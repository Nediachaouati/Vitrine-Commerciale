import { ShortlistActionTypes } from './constants';
import type {
  ShortlistSummaryDto,
  ShortlistDetailDto,
  ClientShortlistViewDto,
} from '../../helpers/model/dto/Shortlist.dto';

interface ShortlistState {
  shortlists: ShortlistSummaryDto[];
  currentShortlist: ShortlistDetailDto | null;
  clientView: ClientShortlistViewDto | null;
  selectedId: number | null;
  builderOpen: boolean;
  loading: boolean;
  sendLoading: boolean;
  msg: string;
  error: string;
  shareUrl: string;
  shareToken: string;
}

const INIT_STATE: ShortlistState = {
  shortlists: [],
  currentShortlist: null,
  clientView: null,
  selectedId: null,
  builderOpen: false,
  loading: false,
  sendLoading: false,
  msg: '',
  error: '',
  shareUrl: '',
  shareToken: '',
};

export default function ShortlistReducer(
  state = INIT_STATE,
  action: any
): ShortlistState {
  switch (action.type) {
    // ── Loaders ──────────────────────────────────────────────────
    case ShortlistActionTypes.LOAD_MY_SHORTLISTS:
    case ShortlistActionTypes.LOAD_SHORTLIST:
    case ShortlistActionTypes.CREATE_SHORTLIST:
    case ShortlistActionTypes.UPDATE_SHORTLIST:
    case ShortlistActionTypes.DELETE_SHORTLIST:
    case ShortlistActionTypes.ADD_ITEM:
    case ShortlistActionTypes.REMOVE_ITEM:
    case ShortlistActionTypes.VIEW_BY_TOKEN:
      return { ...state, loading: true, msg: '', error: '' };

    case ShortlistActionTypes.SEND_SHORTLIST:
      return { ...state, sendLoading: true, msg: '', error: '' };

    // ── UI ────────────────────────────────────────────────────────
    case ShortlistActionTypes.SET_SELECTED:
      return { ...state, selectedId: action.payload.id };

    case ShortlistActionTypes.CLEAR_MSG:
      return { ...state, msg: '', error: '' };

    case ShortlistActionTypes.OPEN_BUILDER:
      return { ...state, builderOpen: true };

    case ShortlistActionTypes.CLOSE_BUILDER:
      return { ...state, builderOpen: false };

    // ── Succès ────────────────────────────────────────────────────
    case ShortlistActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case ShortlistActionTypes.LOAD_MY_SHORTLISTS:
          return { ...state, loading: false, shortlists: action.payload.data ?? [] };

        case ShortlistActionTypes.LOAD_SHORTLIST:
          return { ...state, loading: false, currentShortlist: action.payload.data };

        case ShortlistActionTypes.CREATE_SHORTLIST:
          return {
            ...state,
            loading: false,
            currentShortlist: action.payload.data,
            shortlists: [
              {
                shortlistId: action.payload.data.shortlistId,
                title: action.payload.data.title,
                description: action.payload.data.description,
                status: action.payload.data.status,
                shareToken: action.payload.data.shareToken,
                expiresAt: action.payload.data.expiresAt,
                createdAt: action.payload.data.createdAt,
                itemCount: action.payload.data.items?.length ?? 0,
                clientName: action.payload.data.clientName,
              },
              ...state.shortlists,
            ],
            msg: 'Sélection créée avec succès',
            builderOpen: false,
          };

        case ShortlistActionTypes.UPDATE_SHORTLIST:
          return {
            ...state,
            loading: false,
            currentShortlist: action.payload.data,
            shortlists: state.shortlists.map((s) =>
              s.shortlistId === action.payload.data.shortlistId
                ? { ...s, ...action.payload.data }
                : s
            ),
            msg: 'Sélection mise à jour',
          };

        case ShortlistActionTypes.DELETE_SHORTLIST:
          return {
            ...state,
            loading: false,
            shortlists: state.shortlists.filter(
              (s) => s.shortlistId !== action.payload.data?.id
            ),
            currentShortlist:
              state.currentShortlist?.shortlistId === action.payload.data?.id
                ? null
                : state.currentShortlist,
            msg: 'Sélection supprimée',
          };

        case ShortlistActionTypes.SEND_SHORTLIST:
          return {
            ...state,
            sendLoading: false,
            shareUrl: action.payload.data?.shareUrl ?? '',
            shareToken: action.payload.data?.shareToken ?? '',
            shortlists: state.shortlists.map((s) =>
              s.shortlistId === state.selectedId
                ? { ...s, status: 'sent' }
                : s
            ),
            currentShortlist: state.currentShortlist
              ? { ...state.currentShortlist, status: 'sent' }
              : null,
            msg: 'Sélection envoyée au client',
          };

        case ShortlistActionTypes.ADD_ITEM:
          return { ...state, loading: false, msg: 'Collaborateur ajouté' };

        case ShortlistActionTypes.REMOVE_ITEM:
          return {
            ...state,
            loading: false,
            currentShortlist: state.currentShortlist
              ? {
                  ...state.currentShortlist,
                  items: state.currentShortlist.items.filter(
                    (i) => i.portfolioId !== action.payload.data?.portfolioId
                  ),
                }
              : null,
            msg: 'Collaborateur retiré',
          };

        case ShortlistActionTypes.VIEW_BY_TOKEN:
          return { ...state, loading: false, clientView: action.payload.data };

        default:
          return { ...state, loading: false };
      }

    // ── Erreurs ───────────────────────────────────────────────────
    case ShortlistActionTypes.API_RESPONSE_ERROR:
      return {
        ...state,
        loading: false,
        sendLoading: false,
        error: action.payload.error || 'Erreur',
        msg: '',
      };

    default:
      return state;
  }
}