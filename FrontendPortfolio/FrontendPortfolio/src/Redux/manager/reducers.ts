import { ManagerActionTypes } from './constants';
import type {
  CollaboratorSummaryDto,
  ClientNeedResponseDto,
  MatchedCollaboratorDto,
  PortfolioListItemDto,
  ImprovementSuggestionDto,
  BatchSwitchResponseDto,
  SwitchedViewSummaryDto,
} from '../../helpers/model/dto/manager.dto';

interface ManagerState {
  collaborators: CollaboratorSummaryDto[];
  needs: ClientNeedResponseDto[];
  selectedNeedId: number | null;
  matchResults: MatchedCollaboratorDto[];
  criteria: any | null;
  suggestions: ImprovementSuggestionDto | null;
  portfolios: PortfolioListItemDto[];
  selectedCollabId: number | null;
  activeTab: 'dashboard' | 'matching' | 'portfolios';
  loading: boolean;
  matchLoading: boolean;
  suggestionsLoading: boolean;
  msg: string;
  error: string;
  // ── Tech Switch ──────────────────────────────────────────────────
  switchLoading: boolean;
  switchResult: BatchSwitchResponseDto | null;
  switchViews: SwitchedViewSummaryDto[];
  switchViewsLoading: boolean;
}

const INIT_STATE: ManagerState = {
  collaborators: [],
  needs: [],
  selectedNeedId: null,
  matchResults: [],
  criteria: null,
  suggestions: null,
  portfolios: [],
  selectedCollabId: null,
  activeTab: 'dashboard',
  loading: false,
  matchLoading: false,
  suggestionsLoading: false,
  msg: '',
  error: '',
  // ── Tech Switch ──────────────────────────────────────────────────
  switchLoading: false,
  switchResult: null,
  switchViews: [],
  switchViewsLoading: false,
};

export default function ManagerReducer(state = INIT_STATE, action: any): ManagerState {
  switch (action.type) {

    // ── Loaders ────────────────────────────────────────────────────
    case ManagerActionTypes.LOAD_DASHBOARD:
    case ManagerActionTypes.LOAD_MY_NEEDS:
    case ManagerActionTypes.FILTER_PORTFOLIOS:
      return { ...state, loading: true, msg: '', error: '' };

    // CREATE_NEED met matchLoading (pas loading) car la saga enchaîne direct avec RUN_MATCH
    case ManagerActionTypes.CREATE_NEED:
      return { ...state, loading: true, matchLoading: true, msg: '', error: '' };

    case ManagerActionTypes.RUN_MATCH:
    case ManagerActionTypes.MATCH_DIRECT:
    case ManagerActionTypes.LOAD_CRITERIA:
      return { ...state, matchLoading: true, msg: '', error: '' };

    case ManagerActionTypes.LOAD_SUGGESTIONS:
      return { ...state, suggestionsLoading: true, error: '' };
    
    case ManagerActionTypes.BATCH_SWITCH:
      return { ...state, switchLoading: true, switchResult: null, msg: '', error: '' };
 
    case ManagerActionTypes.LOAD_SWITCHED_VIEWS:
      return { ...state, switchViewsLoading: true, error: '' };
 
    case ManagerActionTypes.DELETE_SWITCHED_VIEW:
      return { ...state, switchLoading: true, error: '' };

    // ── UI ─────────────────────────────────────────────────────────
    case ManagerActionTypes.SELECT_NEED:
      return { ...state, selectedNeedId: action.payload.needId };

    case ManagerActionTypes.SELECT_COLLAB:
      return { ...state, selectedCollabId: action.payload.collaboratorId };

    case ManagerActionTypes.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload.tab };

    case ManagerActionTypes.CLEAR_MATCH:
      return { ...state, matchResults: [], criteria: null, suggestions: null };

    case ManagerActionTypes.CLEAR_MSG:
      return { ...state, msg: '', error: '' };

    // ── Succès ─────────────────────────────────────────────────────
    case ManagerActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {

        case ManagerActionTypes.LOAD_DASHBOARD:
          return { ...state, loading: false, collaborators: action.payload.data ?? [] };

        case ManagerActionTypes.CREATE_NEED:
          return {
            ...state,
            loading: false,
            // matchLoading reste true — la saga va enchaîner RUN_MATCH
            msg: action.payload.msg || 'Besoin créé',
            needs: [action.payload.data, ...state.needs],
            selectedNeedId: action.payload.data?.needId ?? state.selectedNeedId,
          };

        case ManagerActionTypes.LOAD_MY_NEEDS:
          return { ...state, loading: false, needs: action.payload.data ?? [] };

        case ManagerActionTypes.RUN_MATCH:
        case ManagerActionTypes.MATCH_DIRECT:
          return {
            ...state,
            loading: false,
            matchLoading: false,
            matchResults: action.payload.data ?? [],
            // ✅ selectedNeedId mis à jour si vient d'un CREATE_NEED
            selectedNeedId: state.selectedNeedId,
          };

        case ManagerActionTypes.LOAD_CRITERIA:
          return { ...state, matchLoading: false, criteria: action.payload.data };

        case ManagerActionTypes.LOAD_SUGGESTIONS:
          return { ...state, suggestionsLoading: false, suggestions: action.payload.data };

        case ManagerActionTypes.FILTER_PORTFOLIOS:
          return { ...state, loading: false, portfolios: action.payload.data ?? [] };

         // ── Tech Switch ──────────────────────────────────────────
        case ManagerActionTypes.BATCH_SWITCH:
          return {
            ...state,
            switchLoading: false,
            switchResult: action.payload.data,
            msg: action.payload.msg || 'Repositionnement effectué',
          };
 
        case ManagerActionTypes.LOAD_SWITCHED_VIEWS:
          return {
            ...state,
            switchViewsLoading: false,
            // ✅ Merge les nouvelles vues avec les existantes pour éviter d'écraser
            switchViews: action.payload.data ?? [],
          };
 
        case ManagerActionTypes.DELETE_SWITCHED_VIEW:
          return {
            ...state,
            switchLoading: false,
            // ✅ Filtre par viewId passé depuis la saga (pas depuis backend)
            switchViews: state.switchViews.filter(
              (v) => v.viewId !== action.payload.data?.viewId
            ),
            msg: 'Vue supprimée',
          };
 
        default:
          return { ...state, loading: false };
      }

      
    // ── Erreurs ────────────────────────────────────────────────────
    case ManagerActionTypes.API_RESPONSE_ERROR:
      return {
        ...state,
        loading: false,
        matchLoading: false,
        suggestionsLoading: false,
        switchLoading: false,      
        switchViewsLoading: false,
        error: action.payload.error || 'Erreur',
        msg: '',
      };

    default:
      return state;
  }
}