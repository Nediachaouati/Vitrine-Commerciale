/*
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { AddEmailConfirmationApi, UpdateEmailConfirmationApi, GetEmailConfirmationByIdApi, GetAllEmailConfirmationsApi, DeleteEmailConfirmationApi, EmailConfirmation } from '../../helpers/';
import { EmailConfirmationActionTypes, EmailConfirmationMessages } from './constants';
import { emailconfirmationApiResponseError, emailconfirmationApiResponseSuccess } from './actions';

type EmailConfirmationData = {
  payload: EmailConfirmation;
  type: string;
};

function* AddEmailConfirmationSaga({ payload }: any): SagaIterator {
  try {
    const response = yield call(AddEmailConfirmationApi, payload.emailconfirmation);
    const data = response.data;
    yield put(emailconfirmationApiResponseSuccess(EmailConfirmationActionTypes.CREATE, data, EmailConfirmationMessages.CREATE));
  } catch (error: any) {
    yield put(emailconfirmationApiResponseError(EmailConfirmationActionTypes.CREATE, error));
  }
}

function* GetEmailConfirmationByIdSaga({ payload: { idEmailConfirmation } }: any): SagaIterator {
  try {
    const response = yield call(GetEmailConfirmationByIdApi, idEmailConfirmation);
    const item = response.data;
    yield put(emailconfirmationApiResponseSuccess(EmailConfirmationActionTypes.GET_ONE, item));
  } catch (error: any) {
    yield put(emailconfirmationApiResponseError(EmailConfirmationActionTypes.GET_ONE, error));
  }
}

function* GetAllEmailConfirmationsSaga(): SagaIterator {
  try {
    const response = yield call(GetAllEmailConfirmationsApi);
    const items = response.data;
    yield put(emailconfirmationApiResponseSuccess(EmailConfirmationActionTypes.GET_ALL, items));
  } catch (error: any) {
    yield put(emailconfirmationApiResponseError(EmailConfirmationActionTypes.GET_ALL, error));
  }
}

function* DeleteEmailConfirmationSaga({ payload }: any): SagaIterator {
  try {
    const response = yield call(DeleteEmailConfirmationApi, payload.emailconfirmation);
    yield put(emailconfirmationApiResponseSuccess(EmailConfirmationActionTypes.DELETE, response.data, EmailConfirmationMessages.DELETE));
  } catch (error: any) {
    yield put(emailconfirmationApiResponseError(EmailConfirmationActionTypes.DELETE, error));
  }
}

function* UpdateEmailConfirmationSaga({ payload }: any): SagaIterator {
  try {
    const response = yield call(UpdateEmailConfirmationApi, payload.emailconfirmation);
    const data = response.data;
    yield put(emailconfirmationApiResponseSuccess(EmailConfirmationActionTypes.UPDATE, data, EmailConfirmationMessages.UPDATE));
  } catch (error: any) {
    yield put(emailconfirmationApiResponseError(EmailConfirmationActionTypes.UPDATE, error));
  }
}

export function* watchAddEmailConfirmation() {
  yield takeEvery(EmailConfirmationActionTypes.CREATE, AddEmailConfirmationSaga);
}
export function* watchGetEmailConfirmationById() {
  yield takeEvery(EmailConfirmationActionTypes.GET_ONE, GetEmailConfirmationByIdSaga);
}
export function* watchGetAllEmailConfirmations() {
  yield takeEvery(EmailConfirmationActionTypes.GET_ALL, GetAllEmailConfirmationsSaga);
}
export function* watchDeleteEmailConfirmation() {
  yield takeEvery(EmailConfirmationActionTypes.DELETE, DeleteEmailConfirmationSaga);
}
export function* watchUpdateEmailConfirmation() {
  yield takeEvery(EmailConfirmationActionTypes.UPDATE, UpdateEmailConfirmationSaga);
}

function* EmailConfirmationSaga() {
  yield all([fork(watchAddEmailConfirmation), fork(watchUpdateEmailConfirmation), fork(watchGetEmailConfirmationById), fork(watchGetAllEmailConfirmations), fork(watchDeleteEmailConfirmation)]);
}

export default EmailConfirmationSaga;
*/