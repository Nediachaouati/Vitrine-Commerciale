// Redux/portfolio/actions.ts
import { PortfolioActionTypes } from './constants';
import type {
  CreatePortfolioDto,
  UpdatePortfolioDto,
  SetPortfolioItemsDto,
  ChatMessageDto,
} from '../../helpers/model/dto/collaborator.dto';

export type PortfolioActionType = { type: PortfolioActionTypes; payload: any };

export const portfolioApiResponseSuccess = (actionType: string, data: any, msg?: string): PortfolioActionType => ({
  type: PortfolioActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data, msg },
});

export const portfolioApiResponseError = (actionType: string, error: any): PortfolioActionType => ({
  type: PortfolioActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Chargement
export const LoadMyPortfolios = () => ({
  type: PortfolioActionTypes.LOAD_MY_PORTFOLIOS,
  payload: {},
});

export const LoadPortfolio = (portfolioId: number) => ({
  type: PortfolioActionTypes.LOAD_PORTFOLIO,
  payload: { portfolioId },
});

// CRUD
export const CreatePortfolio = (dto: CreatePortfolioDto) => ({
  type: PortfolioActionTypes.CREATE_PORTFOLIO,
  payload: { dto },
});

export const UpdatePortfolio = (portfolioId: number, dto: UpdatePortfolioDto) => ({
  type: PortfolioActionTypes.UPDATE_PORTFOLIO,
  payload: { portfolioId, dto },
});

export const DeletePortfolio = (portfolioId: number) => ({
  type: PortfolioActionTypes.DELETE_PORTFOLIO,
  payload: { portfolioId },
});

// Sélection items
export const SetPortfolioSkills = (portfolioId: number, dto: SetPortfolioItemsDto) => ({
  type: PortfolioActionTypes.SET_SKILLS,
  payload: { portfolioId, dto },
});

export const SetPortfolioExperiences = (portfolioId: number, dto: SetPortfolioItemsDto) => ({
  type: PortfolioActionTypes.SET_EXPERIENCES,
  payload: { portfolioId, dto },
});

export const SetPortfolioEducation = (portfolioId: number, dto: SetPortfolioItemsDto) => ({
  type: PortfolioActionTypes.SET_EDUCATION,
  payload: { portfolioId, dto },
});

export const SetPortfolioCertifications = (portfolioId: number, dto: SetPortfolioItemsDto) => ({
  type: PortfolioActionTypes.SET_CERTIFICATIONS,
  payload: { portfolioId, dto },
});

export const SetPortfolioProjects = (portfolioId: number, dto: SetPortfolioItemsDto) => ({
  type: PortfolioActionTypes.SET_PROJECTS,
  payload: { portfolioId, dto },
});

// Chat IA
export const ChatSendMessage = (portfolioId: number, messages: ChatMessageDto[], collaboratorId: number) => ({
  type: PortfolioActionTypes.CHAT_SEND_MESSAGE,
  payload: { portfolioId, messages, collaboratorId },
});

// UI
export const SelectPortfolio = (portfolioId: number) => ({
  type: PortfolioActionTypes.SELECT_PORTFOLIO,
  payload: { portfolioId },
});

export const ClearConversation = () => ({
  type: PortfolioActionTypes.CLEAR_CONVERSATION,
  payload: {},
});

export const ClearPortfolioMsg = () => ({
  type: PortfolioActionTypes.CLEAR_MSG,
  payload: {},
});