/*import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

import {
  AddFormationApi,
  UpdateFormationApi,
  GetFormationByIdApi,
  GetAllFormationsApi,
  DeleteFormationApi,
  Formations,
  AddFormationWithPhotoApi,
  UpdateFormationWithPhotoApi,

  // ===== BUILDER APIs (NEW) =====
  GetExamensWithVersionsByFormationIdApi,
  GetCoursWithQuestionsByFormationIdApi,
} from '../../helpers/';

import { FormationsActionTypes, FormationsMessages } from './constants';
import { formationsApiResponseError, formationsApiResponseSuccess } from './actions';

type FormationsData = {
  payload: any;
  type: string;
};

function* AddFormationsSaga({ payload }: any): SagaIterator {
  try {
    const response = yield call(AddFormationWithPhotoApi, payload.formations);
    const data = response.data;
    yield put(formationsApiResponseSuccess(FormationsActionTypes.CREATE, data, FormationsMessages.CREATE));
  } catch (error: any) {
    yield put(formationsApiResponseError(FormationsActionTypes.CREATE, error));
  }
}

function* GetFormationsByIdSaga({ payload: { id } }: FormationsData): SagaIterator {
  try {
    const response = yield call(GetFormationByIdApi, Number(id));
    const item = response.data;
    yield put(formationsApiResponseSuccess(FormationsActionTypes.GET_ONE, item));
  } catch (error: any) {
    yield put(formationsApiResponseError(FormationsActionTypes.GET_ONE, error));
  }
}

function* GetAllFormationsSaga(): SagaIterator {
  try {
    const response = yield call(GetAllFormationsApi);
    const items = response.data;
    yield put(formationsApiResponseSuccess(FormationsActionTypes.GET_ALL, items));
  } catch (error: any) {
    yield put(formationsApiResponseError(FormationsActionTypes.GET_ALL, error));
  }
}

function* DeleteFormationsSaga({ payload: { id } }: FormationsData): SagaIterator {
  try {
    const response = yield call(DeleteFormationApi, Number(id));
    yield put(formationsApiResponseSuccess(FormationsActionTypes.DELETE, response.data, FormationsMessages.DELETE));
  } catch (error: any) {
    yield put(formationsApiResponseError(FormationsActionTypes.DELETE, error));
  }
}

function* UpdateFormationsSaga({ payload }: any): SagaIterator {
  try {
    const response = yield call(UpdateFormationApi, payload.formations);
    const data = response.data;
    yield put(formationsApiResponseSuccess(FormationsActionTypes.UPDATE, data, FormationsMessages.UPDATE));
  } catch (error: any) {
    yield put(formationsApiResponseError(FormationsActionTypes.UPDATE, error));
  }
}

function* UpdateWithPhtoFormations({ payload }: any): SagaIterator {
  try {
    const response = yield call(UpdateFormationWithPhotoApi, payload.formations);
    const data = response.data;
    yield put(formationsApiResponseSuccess(FormationsActionTypes.UPDATEWITHPHOTO, data, FormationsMessages.UPDATE));
  } catch (error: any) {
    yield put(formationsApiResponseError(FormationsActionTypes.UPDATEWITHPHOTO, error));
  }
}

export function* watchAddFormations() {
  yield takeEvery(FormationsActionTypes.CREATE, AddFormationsSaga);
}
export function* watchGetFormationsById() {
  yield takeEvery(FormationsActionTypes.GET_ONE, GetFormationsByIdSaga);
}
export function* watchGetAllFormationss() {
  yield takeEvery(FormationsActionTypes.GET_ALL, GetAllFormationsSaga);
}
export function* watchDeleteFormations() {
  yield takeEvery(FormationsActionTypes.DELETE, DeleteFormationsSaga);
}
export function* watchUpdateFormations() {
  yield takeEvery(FormationsActionTypes.UPDATE, UpdateFormationsSaga);
}
export function* watchUpdateWithPhtoFormations() {
  yield takeEvery(FormationsActionTypes.UPDATEWITHPHOTO, UpdateWithPhtoFormations);
}

function* FormationsSaga() {
  yield all([fork(watchAddFormations), fork(watchUpdateFormations), fork(watchGetFormationsById), fork(watchGetAllFormationss), fork(watchDeleteFormations), fork(watchUpdateWithPhtoFormations)]);
}

export default FormationsSaga;
*/