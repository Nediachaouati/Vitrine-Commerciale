const PREFIX = '@@profile/';

export enum ProfileActionTypes {
  API_RESPONSE_SUCCESS = `${PREFIX}API_RESPONSE_SUCCESS`,
  API_RESPONSE_ERROR   = `${PREFIX}API_RESPONSE_ERROR`,

  GET_MY_PROFILE       = `${PREFIX}GET_MY_PROFILE`,
  UPDATE_MY_PROFILE    = `${PREFIX}UPDATE_MY_PROFILE`,
  UPLOAD_AVATAR        = `${PREFIX}UPLOAD_AVATAR`,
  DELETE_AVATAR        = `${PREFIX}DELETE_AVATAR`,
  CLEAR_MSG            = `${PREFIX}CLEAR_MSG`,
}

export const ProfileMessages = {
  UPDATE_SUCCESS: 'Profil mis à jour avec succès',
  AVATAR_UPLOADED: 'Photo de profil mise à jour',
  AVATAR_DELETED: 'Photo de profil supprimée',
} as const;