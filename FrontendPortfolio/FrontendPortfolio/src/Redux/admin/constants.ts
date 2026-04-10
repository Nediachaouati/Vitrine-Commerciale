const PREFIX = '@@admin/';

export enum AdminActionTypes {
  API_RESPONSE_SUCCESS = `${PREFIX}API_RESPONSE_SUCCESS`,
  API_RESPONSE_ERROR   = `${PREFIX}API_RESPONSE_ERROR`,
  GET_ALL_USERS        = `${PREFIX}GET_ALL_USERS`,
  CREATE_USER          = `${PREFIX}CREATE_USER`,
  DELETE_USER          = `${PREFIX}DELETE_USER`,
}

export const AdminMessages = {
  CREATE: 'Utilisateur créé avec succès',
  DELETE: 'Utilisateur supprimé avec succès',
} as const;