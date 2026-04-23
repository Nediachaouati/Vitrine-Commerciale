import { PortfolioActionTypes } from './constants';
import type { PortfolioItem, ChatMessageDto } from '../../helpers/model/dto/collaborator.dto';

interface PortfolioState {
  portfolios: PortfolioItem[];
  currentPortfolio: PortfolioItem | null;
  selectedPortfolioId: number | null;
  chatMessages: ChatMessageDto[];
  isChatLoading: boolean;
  isSaving: boolean;
  loading: boolean;
  msg: string;
  error: string;
}

const INIT_STATE: PortfolioState = {
  portfolios: [],
  currentPortfolio: null,
  selectedPortfolioId: null,
  chatMessages: [],
  isChatLoading: false,
  isSaving: false,
  loading: false,
  msg: '',
  error: '',
};

export default function PortfolioReducer(state = INIT_STATE, action: any): PortfolioState {
  switch (action.type) {

    // Chargement principal → loading (cache le spinner initial)
    case PortfolioActionTypes.LOAD_MY_PORTFOLIOS:
    case PortfolioActionTypes.LOAD_PORTFOLIO:
    case PortfolioActionTypes.CREATE_PORTFOLIO:
    case PortfolioActionTypes.UPDATE_PORTFOLIO:
    case PortfolioActionTypes.DELETE_PORTFOLIO:
      return { ...state, loading: true, msg: '', error: '' };

    // Sauvegarde items → isSaving uniquement (ne cache pas la liste)
    case PortfolioActionTypes.SET_SKILLS:
    case PortfolioActionTypes.SET_EXPERIENCES:
    case PortfolioActionTypes.SET_EDUCATION:
    case PortfolioActionTypes.SET_CERTIFICATIONS:
    case PortfolioActionTypes.SET_PROJECTS:
      return { ...state, isSaving: true, msg: '', error: '' };

    case PortfolioActionTypes.CHAT_SEND_MESSAGE:
      return {
        ...state,
        isChatLoading: true,
        chatMessages: action.payload.messages,
      };

    case PortfolioActionTypes.SELECT_PORTFOLIO:
      return { ...state, selectedPortfolioId: action.payload.portfolioId };

    case PortfolioActionTypes.CLEAR_CONVERSATION:
      return { ...state, chatMessages: [] };

    case PortfolioActionTypes.CLEAR_MSG:
      return { ...state, msg: '', error: '' };

    case PortfolioActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {

        case PortfolioActionTypes.LOAD_MY_PORTFOLIOS:
          return {
            ...state,
            loading: false,
            portfolios: action.payload.data ?? [],
            selectedPortfolioId: action.payload.data?.[0]?.portfolioId ?? null,
          };

        case PortfolioActionTypes.LOAD_PORTFOLIO:
          return {
            ...state,
            loading: false,
            isSaving: false, // reset isSaving aussi quand le reload arrive
            currentPortfolio: action.payload.data,
          };

        case PortfolioActionTypes.CREATE_PORTFOLIO:
          return {
            ...state,
            loading: false,
            msg: action.payload.msg || 'Portfolio créé',
            portfolios: [...state.portfolios, action.payload.data],
            selectedPortfolioId: action.payload.data?.portfolioId ?? state.selectedPortfolioId,
          };

        case PortfolioActionTypes.DELETE_PORTFOLIO:
          return {
            ...state,
            loading: false,
            msg: action.payload.msg || 'Portfolio supprimé',
            portfolios: state.portfolios.filter(
              (p) => p.portfolioId !== action.payload.data?.portfolioId
            ),
            selectedPortfolioId:
              state.selectedPortfolioId === action.payload.data?.portfolioId
                ? (state.portfolios[0]?.portfolioId ?? null)
                : state.selectedPortfolioId,
          };

        // SET_* : on remet juste isSaving=false, le LoadPortfolio qui suit
        // dans la saga va mettre à jour currentPortfolio via LOAD_PORTFOLIO
        case PortfolioActionTypes.SET_SKILLS:
        case PortfolioActionTypes.SET_EXPERIENCES:
        case PortfolioActionTypes.SET_EDUCATION:
        case PortfolioActionTypes.SET_CERTIFICATIONS:
        case PortfolioActionTypes.SET_PROJECTS:
          return {
            ...state,
            isSaving: false,
            loading: false,
            msg: action.payload.msg || 'Mis à jour',
          };

        case PortfolioActionTypes.UPDATE_PORTFOLIO:
          return {
            ...state,
            loading: false,
            msg: action.payload.msg || 'Mis à jour',
          };

        case PortfolioActionTypes.CHAT_SEND_MESSAGE:
          return {
            ...state,
            isChatLoading: false,
            chatMessages: [
              ...state.chatMessages,
              { role: 'assistant' as const, content: action.payload.data?.message ?? '' },
            ],
          };

        default:
          return { ...state, loading: false };
      }

    case PortfolioActionTypes.API_RESPONSE_ERROR:
      return {
        ...state,
        loading: false,
        isSaving: false,
        isChatLoading: false,
        error: action.payload.error || 'Erreur',
        msg: '',
      };

    default:
      return state;
  }
}