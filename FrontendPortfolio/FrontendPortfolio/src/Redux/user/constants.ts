const PREFIX = '@@user/';

export enum UserActionTypes {
  API_RESPONSE_SUCCESS = `${PREFIX}API_RESPONSE_SUCCESS`,
  API_RESPONSE_ERROR = `${PREFIX}API_RESPONSE_ERROR`,
  GET_ALL = `${PREFIX}GET_ALL`,
  GET_ONE = `${PREFIX}GET_ONE`,
  CREATE = `${PREFIX}CREATE`,
  UPDATE = `${PREFIX}UPDATE`,
  DELETE = `${PREFIX}DELETE`,
  GET_ALL_ADMIN = `${PREFIX}GET_ALL_ADMIN`,
  GET_ALL_FORMATEUR = `${PREFIX}GET_ALL_FORMATEUR`,
  GET_ALL_APPRENAT = `${PREFIX}GET_ALL_APPRENAT`,
}

export const UserMessages = {
  CREATE: 'User est ajouté avec succès',
  DELETE: 'User supprimé avec succés',
  UPDATE: 'User mis à jour avec succès',
} as const;
