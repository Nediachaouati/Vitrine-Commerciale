import { ProfileActionTypes } from './constants';
import type { UpdateProfileDto } from '../../helpers/model/dto/update-profile.dto';

export type ProfileActionType = {
  type: ProfileActionTypes;
  payload: any;
};

export const profileApiResponseSuccess = (
  actionType: string,
  data: any,
  msg?: string
): ProfileActionType => ({
  type: ProfileActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data, msg },
});

export const profileApiResponseError = (
  actionType: string,
  error: any
): ProfileActionType => ({
  type: ProfileActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const GetMyProfile = () => ({
  type: ProfileActionTypes.GET_MY_PROFILE,
  payload: {},
});

export const UpdateMyProfile = (dto: UpdateProfileDto) => ({
  type: ProfileActionTypes.UPDATE_MY_PROFILE,
  payload: { dto },
});

export const UploadAvatar = (formData: FormData) => ({
  type: ProfileActionTypes.UPLOAD_AVATAR,
  payload: { formData },
});

export const DeleteAvatar = () => ({
  type: ProfileActionTypes.DELETE_AVATAR,
  payload: {},
});

export const ClearProfileMsg = () => ({
  type: ProfileActionTypes.CLEAR_MSG,
  payload: {},
});