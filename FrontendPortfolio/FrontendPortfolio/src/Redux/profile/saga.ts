import { all, takeEvery, call, put } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { ProfileActionTypes, ProfileMessages } from './constants';
import { profileApiResponseSuccess, profileApiResponseError } from './actions';
import {
  GetMyProfileApi,
  UpdateMyProfileApi,
  UploadAvatarApi,
} from '../../helpers/api/ProfileApi';

function* getMyProfileSaga(): SagaIterator {
  try {
    const response = yield call(GetMyProfileApi);
    yield put(profileApiResponseSuccess(ProfileActionTypes.GET_MY_PROFILE, response.data));
  } catch (e: any) {
    yield put(profileApiResponseError(ProfileActionTypes.GET_MY_PROFILE, e?.message ?? e));
  }
}

function* updateMyProfileSaga({ payload }: any): SagaIterator {
  try {
    const response = yield call(UpdateMyProfileApi, payload.dto);
    yield put(profileApiResponseSuccess(
      ProfileActionTypes.UPDATE_MY_PROFILE,
      response.data,
      ProfileMessages.UPDATE_SUCCESS
    ));
    // Recharger le profil complet après mise à jour
    yield put({ type: ProfileActionTypes.GET_MY_PROFILE });
  } catch (e: any) {
    yield put(profileApiResponseError(ProfileActionTypes.UPDATE_MY_PROFILE, e?.message ?? e));
  }
}

function* uploadAvatarSaga({ payload }: any): SagaIterator {
  try {
    const response = yield call(UploadAvatarApi, payload.formData);
    yield put(profileApiResponseSuccess(
      ProfileActionTypes.UPLOAD_AVATAR,
      response.data,
      ProfileMessages.AVATAR_UPLOADED
    ));
    yield put({ type: ProfileActionTypes.GET_MY_PROFILE });
  } catch (e: any) {
    yield put(profileApiResponseError(ProfileActionTypes.UPLOAD_AVATAR, e?.message ?? e));
  }
}

export function* watchProfile() {
  yield all([
    takeEvery(ProfileActionTypes.GET_MY_PROFILE, getMyProfileSaga),
    takeEvery(ProfileActionTypes.UPDATE_MY_PROFILE, updateMyProfileSaga),
    takeEvery(ProfileActionTypes.UPLOAD_AVATAR, uploadAvatarSaga),
  ]);
}