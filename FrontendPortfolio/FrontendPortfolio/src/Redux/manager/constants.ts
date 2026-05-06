const PREFIX = '@@manager/';

export enum ManagerActionTypes {
  API_RESPONSE_SUCCESS   = `${PREFIX}API_RESPONSE_SUCCESS`,
  API_RESPONSE_ERROR     = `${PREFIX}API_RESPONSE_ERROR`,

  // Dashboard
  LOAD_DASHBOARD         = `${PREFIX}LOAD_DASHBOARD`,

  // Besoins client
  CREATE_NEED            = `${PREFIX}CREATE_NEED`,
  LOAD_MY_NEEDS          = `${PREFIX}LOAD_MY_NEEDS`,
  LOAD_NEED              = `${PREFIX}LOAD_NEED`,

  // Matching
  RUN_MATCH              = `${PREFIX}RUN_MATCH`,
  MATCH_DIRECT           = `${PREFIX}MATCH_DIRECT`,
  LOAD_CRITERIA          = `${PREFIX}LOAD_CRITERIA`,

  // Suggestions
  LOAD_SUGGESTIONS       = `${PREFIX}LOAD_SUGGESTIONS`,

  // Portfolios filtrés
  FILTER_PORTFOLIOS      = `${PREFIX}FILTER_PORTFOLIOS`,

  // Détail collaborateur
  LOAD_COLLABORATOR      = `${PREFIX}LOAD_COLLABORATOR`,

  // ── Tech Switch (Batch) ────────────────────────────────────────
  BATCH_SWITCH           = `${PREFIX}BATCH_SWITCH`,
  LOAD_SWITCHED_VIEWS    = `${PREFIX}LOAD_SWITCHED_VIEWS`,
  DELETE_SWITCHED_VIEW   = `${PREFIX}DELETE_SWITCHED_VIEW`,

  // UI
  SELECT_NEED            = `${PREFIX}SELECT_NEED`,
  SELECT_COLLAB          = `${PREFIX}SELECT_COLLAB`,
  SET_ACTIVE_TAB         = `${PREFIX}SET_ACTIVE_TAB`,
  CLEAR_MATCH            = `${PREFIX}CLEAR_MATCH`,
  CLEAR_MSG              = `${PREFIX}CLEAR_MSG`,
}

export const ManagerMessages = {
  NEED_CREATED: 'Besoin client créé avec succès',
  MATCH_DONE:   'Matching effectué avec succès',
  SWITCH_DONE:   'Repositionnement effectué avec succès',
  VIEW_DELETED:  'Vue supprimée',
} as const;