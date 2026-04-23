// Redux/portfolio/constants.ts
const PREFIX = '@@portfolio/';

export enum PortfolioActionTypes {
  API_RESPONSE_SUCCESS     = `${PREFIX}API_RESPONSE_SUCCESS`,
  API_RESPONSE_ERROR       = `${PREFIX}API_RESPONSE_ERROR`,

  // Chargement
  LOAD_MY_PORTFOLIOS       = `${PREFIX}LOAD_MY_PORTFOLIOS`,
  LOAD_PORTFOLIO           = `${PREFIX}LOAD_PORTFOLIO`,

  // CRUD portfolio
  CREATE_PORTFOLIO         = `${PREFIX}CREATE_PORTFOLIO`,
  UPDATE_PORTFOLIO         = `${PREFIX}UPDATE_PORTFOLIO`,
  DELETE_PORTFOLIO         = `${PREFIX}DELETE_PORTFOLIO`,

  // Sélection items
  SET_SKILLS               = `${PREFIX}SET_SKILLS`,
  SET_EXPERIENCES          = `${PREFIX}SET_EXPERIENCES`,
  SET_EDUCATION            = `${PREFIX}SET_EDUCATION`,
  SET_CERTIFICATIONS       = `${PREFIX}SET_CERTIFICATIONS`,
  SET_PROJECTS             = `${PREFIX}SET_PROJECTS`,

  // Chat IA
  CHAT_SEND_MESSAGE        = `${PREFIX}CHAT_SEND_MESSAGE`,

  // UI
  SELECT_PORTFOLIO         = `${PREFIX}SELECT_PORTFOLIO`,
  CLEAR_CONVERSATION       = `${PREFIX}CLEAR_CONVERSATION`,
  CLEAR_MSG                = `${PREFIX}CLEAR_MSG`,
}

export const PortfolioMessages = {
  CREATED: 'Portfolio créé avec succès',
  UPDATED: 'Portfolio mis à jour',
  DELETED: 'Portfolio supprimé',
} as const;