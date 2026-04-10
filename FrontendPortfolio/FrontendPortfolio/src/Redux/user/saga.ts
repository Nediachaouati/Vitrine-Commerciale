import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { UserActionTypes, UserMessages } from './constants';
import { userApiResponseSuccess, userApiResponseError } from './actions';
import {
  GetAllCollaborateursApi,
  GetAllManagersApi,
  GetUsersByRolesApi,
} from '../../helpers/api/UserApi';

function* GetAllUsersSaga(): SagaIterator {
  try {
    const response = yield call(GetUsersByRolesApi, 'vitrine-collaborator,vitrine-manager');
    yield put(userApiResponseSuccess(UserActionTypes.GET_ALL, response.data));
  } catch (error: any) {
    yield put(userApiResponseError(UserActionTypes.GET_ALL, error));
  }
}

function* GetAllUsersAdminSaga(): SagaIterator {
  try {
    const response = yield call(GetUsersByRolesApi, 'vitrine-admin');
    yield put(userApiResponseSuccess(UserActionTypes.GET_ALL_ADMIN, response.data));
  } catch (error: any) {
    yield put(userApiResponseError(UserActionTypes.GET_ALL_ADMIN, error));
  }
}

function* GetAllUsersCollaborateurSaga(): SagaIterator {
  try {
    const response = yield call(GetAllCollaborateursApi);
    yield put(userApiResponseSuccess(UserActionTypes.GET_ALL_FORMATEUR, response.data));
  } catch (error: any) {
    yield put(userApiResponseError(UserActionTypes.GET_ALL_FORMATEUR, error));
  }
}

function* GetAllUsersManagerSaga(): SagaIterator {
  try {
    const response = yield call(GetAllManagersApi);
    yield put(userApiResponseSuccess(UserActionTypes.GET_ALL_APPRENAT, response.data));
  } catch (error: any) {
    yield put(userApiResponseError(UserActionTypes.GET_ALL_APPRENAT, error));
  }
}

function* UserSaga() {
  yield all([
    takeEvery(UserActionTypes.GET_ALL,          GetAllUsersSaga),
    takeEvery(UserActionTypes.GET_ALL_ADMIN,     GetAllUsersAdminSaga),
    takeEvery(UserActionTypes.GET_ALL_FORMATEUR, GetAllUsersCollaborateurSaga),
    takeEvery(UserActionTypes.GET_ALL_APPRENAT,  GetAllUsersManagerSaga),
  ]);
}

export default UserSaga;