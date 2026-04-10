import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { AdminActionTypes, AdminMessages } from './constants';
import { adminApiResponseSuccess, adminApiResponseError } from './actions';
import {
  GetAllUsersAdminApi,
  CreateUserAdminApi,
  DeleteUserAdminApi,
} from '../../helpers/api/AdminApi';

function* getAllUsersSaga(): SagaIterator {
  try {
    const response = yield call(GetAllUsersAdminApi);
    yield put(adminApiResponseSuccess(AdminActionTypes.GET_ALL_USERS, response.data));
  } catch (e: any) {
    yield put(adminApiResponseError(AdminActionTypes.GET_ALL_USERS, e?.message ?? e));
  }
}

function* createUserSaga({ payload }: any): SagaIterator {
  try {
    const response = yield call(CreateUserAdminApi, payload.dto);
    yield put(adminApiResponseSuccess(
      AdminActionTypes.CREATE_USER, response.data, AdminMessages.CREATE
    ));
  } catch (e: any) {
    yield put(adminApiResponseError(AdminActionTypes.CREATE_USER, e?.message ?? e));
  }
}

function* deleteUserSaga({ payload }: any): SagaIterator {
  try {
    yield call(DeleteUserAdminApi, payload.id);
    yield put(adminApiResponseSuccess(
      AdminActionTypes.DELETE_USER, null, AdminMessages.DELETE
    ));
  } catch (e: any) {
    yield put(adminApiResponseError(AdminActionTypes.DELETE_USER, e?.message ?? e));
  }
}

function* AdminSaga() {
  yield all([
    takeEvery(AdminActionTypes.GET_ALL_USERS, getAllUsersSaga),
    takeEvery(AdminActionTypes.CREATE_USER,   createUserSaga),
    takeEvery(AdminActionTypes.DELETE_USER,   deleteUserSaga),
  ]);
}

export default AdminSaga;