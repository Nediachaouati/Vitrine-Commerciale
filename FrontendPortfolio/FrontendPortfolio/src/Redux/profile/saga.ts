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
    console.log('📥 GET profile response:', response.data);
    yield put(
      profileApiResponseSuccess(ProfileActionTypes.GET_MY_PROFILE, response.data)
    );
  } catch (e: any) {
    console.error('❌ GET profile error:', e?.response?.data ?? e?.message);
    yield put(
      profileApiResponseError(ProfileActionTypes.GET_MY_PROFILE, e?.message ?? e)
    );
  }
}

function* updateMyProfileSaga({ payload }: any): SagaIterator {
  try {
    console.log('📤 Sending DTO to backend:', payload.dto);
    
    const response = yield call(UpdateMyProfileApi, payload.dto);
    console.log('📥 UPDATE response.data:', response.data);

    // Message de succès
    yield put(
      profileApiResponseSuccess(
        ProfileActionTypes.UPDATE_MY_PROFILE,
        response.data,           // tu peux passer response.data si utile
        ProfileMessages.UPDATE_SUCCESS
      )
    );

    // Recharger le profil complet (le plus important !)
    yield put({ type: ProfileActionTypes.GET_MY_PROFILE });

  } catch (e: any) {
    console.error('❌ UPDATE error:', e?.response?.data ?? e?.message);
    yield put(
      profileApiResponseError(
        ProfileActionTypes.UPDATE_MY_PROFILE,
        e?.response?.data?.message ?? e?.message ?? 'Erreur lors de la mise à jour'
      )
    );
  }
}

function* uploadAvatarSaga({ payload }: any): SagaIterator {
  try {
    const response = yield call(UploadAvatarApi, payload.formData);
    yield put(
      profileApiResponseSuccess(
        ProfileActionTypes.UPLOAD_AVATAR,
        response.data ?? null,
        ProfileMessages.AVATAR_UPLOADED
      )
    );
    yield put({ type: ProfileActionTypes.GET_MY_PROFILE });
  } catch (e: any) {
    yield put(
      profileApiResponseError(
        ProfileActionTypes.UPLOAD_AVATAR,
        e?.response?.data?.message ?? e?.message ?? "Erreur lors de l'upload"
      )
    );
  }
}

export function* watchProfile() {
  yield all([
    takeEvery(ProfileActionTypes.GET_MY_PROFILE, getMyProfileSaga),
    takeEvery(ProfileActionTypes.UPDATE_MY_PROFILE, updateMyProfileSaga),
    takeEvery(ProfileActionTypes.UPLOAD_AVATAR, uploadAvatarSaga),
  ]);
}