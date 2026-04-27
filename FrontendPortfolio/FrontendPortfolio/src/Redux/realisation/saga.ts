import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { RealisationActionTypes } from './constants';
import { realisationApiResponseSuccess, realisationApiResponseError } from './actions';
import {
  GetMyRealisationsApi,
  CreateRealisationApi,
  UpdateRealisationApi,
  DeleteRealisationApi,
} from '../../helpers/api/RealisationApi';

// Load 
function* loadMyRealisations(): Generator {
  try {
    const response: any = yield call(GetMyRealisationsApi);
    yield put(realisationApiResponseSuccess(
      RealisationActionTypes.LOAD_MY_REALISATIONS,
      response.data
    ));
  } catch (error: any) {
    yield put(realisationApiResponseError(
      RealisationActionTypes.LOAD_MY_REALISATIONS,
      error?.message ?? 'Erreur'
    ));
  }
}

// ── Create 
function* createRealisation({ payload }: any): Generator {
  try {
    const response: any = yield call(CreateRealisationApi, payload.dto);
    yield put(realisationApiResponseSuccess(
      RealisationActionTypes.CREATE_REALISATION,
      response.data,
      'Réalisation créée'
    ));
  } catch (error: any) {
    yield put(realisationApiResponseError(
      RealisationActionTypes.CREATE_REALISATION,
      error?.message ?? 'Erreur'
    ));
  }
}

// ── Update 
function* updateRealisation({ payload }: any): Generator {
  try {
    const response: any = yield call(UpdateRealisationApi, payload.id, payload.dto);
    yield put(realisationApiResponseSuccess(
      RealisationActionTypes.UPDATE_REALISATION,
      response.data,
      'Réalisation mise à jour'
    ));
  } catch (error: any) {
    yield put(realisationApiResponseError(
      RealisationActionTypes.UPDATE_REALISATION,
      error?.message ?? 'Erreur'
    ));
  }
}

// ── Delete 
function* deleteRealisation({ payload }: any): Generator {
  try {
    yield call(DeleteRealisationApi, payload.id);
    yield put(realisationApiResponseSuccess(
      RealisationActionTypes.DELETE_REALISATION,
      { id: payload.id }
    ));
  } catch (error: any) {
    yield put(realisationApiResponseError(
      RealisationActionTypes.DELETE_REALISATION,
      error?.message ?? 'Erreur'
    ));
  }
}

// ── Watchers 
function* watchLoad()   { yield takeLatest(RealisationActionTypes.LOAD_MY_REALISATIONS, loadMyRealisations); }
function* watchCreate() { yield takeLatest(RealisationActionTypes.CREATE_REALISATION,   createRealisation); }
function* watchUpdate() { yield takeLatest(RealisationActionTypes.UPDATE_REALISATION,   updateRealisation); }
function* watchDelete() { yield takeLatest(RealisationActionTypes.DELETE_REALISATION,   deleteRealisation); }

export default function* realisationSaga() {
  yield all([
    fork(watchLoad),
    fork(watchCreate),
    fork(watchUpdate),
    fork(watchDelete),
  ]);
}