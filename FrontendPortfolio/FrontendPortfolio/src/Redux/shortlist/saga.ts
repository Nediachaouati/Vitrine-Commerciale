import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { ShortlistActionTypes } from './constants';
import {
  shortlistApiResponseSuccess,
  shortlistApiResponseError,
} from './actions';
import {
  CreateShortlistApi,
  GetMyShortlistsApi,
  GetShortlistByIdApi,
  UpdateShortlistApi,
  DeleteShortlistApi,
  AddShortlistItemApi,
  RemoveShortlistItemApi,
  SendShortlistApi,
  ViewShortlistByTokenApi,
} from '../../helpers/api/ShortlistApi';

// ── Manager CRUD ──────────────────────────────────────────────────
function* createShortlist({ payload }: any): Generator {
  try {
    const response: any = yield call(CreateShortlistApi, payload.dto);
    yield put(
      shortlistApiResponseSuccess(
        ShortlistActionTypes.CREATE_SHORTLIST,
        response.data,
        'Sélection créée avec succès'
      )
    );
  } catch (error: any) {
    yield put(
      shortlistApiResponseError(
        ShortlistActionTypes.CREATE_SHORTLIST,
        error?.message ?? 'Erreur'
      )
    );
  }
}

function* loadMyShortlists(): Generator {
  try {
    const response: any = yield call(GetMyShortlistsApi);
    yield put(
      shortlistApiResponseSuccess(ShortlistActionTypes.LOAD_MY_SHORTLISTS, response.data)
    );
  } catch (error: any) {
    yield put(
      shortlistApiResponseError(
        ShortlistActionTypes.LOAD_MY_SHORTLISTS,
        error?.message ?? 'Erreur'
      )
    );
  }
}

function* loadShortlist({ payload }: any): Generator {
  try {
    const response: any = yield call(GetShortlistByIdApi, payload.id);
    yield put(
      shortlistApiResponseSuccess(ShortlistActionTypes.LOAD_SHORTLIST, response.data)
    );
  } catch (error: any) {
    yield put(
      shortlistApiResponseError(
        ShortlistActionTypes.LOAD_SHORTLIST,
        error?.message ?? 'Erreur'
      )
    );
  }
}

function* updateShortlist({ payload }: any): Generator {
  try {
    const response: any = yield call(UpdateShortlistApi, payload.id, payload.dto);
    yield put(
      shortlistApiResponseSuccess(
        ShortlistActionTypes.UPDATE_SHORTLIST,
        response.data,
        'Sélection mise à jour'
      )
    );
  } catch (error: any) {
    yield put(
      shortlistApiResponseError(
        ShortlistActionTypes.UPDATE_SHORTLIST,
        error?.message ?? 'Erreur'
      )
    );
  }
}

function* deleteShortlist({ payload }: any): Generator {
  try {
    yield call(DeleteShortlistApi, payload.id);
    yield put(
      shortlistApiResponseSuccess(
        ShortlistActionTypes.DELETE_SHORTLIST,
        { id: payload.id },
        'Sélection supprimée'
      )
    );
  } catch (error: any) {
    yield put(
      shortlistApiResponseError(
        ShortlistActionTypes.DELETE_SHORTLIST,
        error?.message ?? 'Erreur'
      )
    );
  }
}

function* sendShortlist({ payload }: any): Generator {
  try {
    const response: any = yield call(SendShortlistApi, payload.id, payload.dto ?? { mode: 'link' });
    yield put(
      shortlistApiResponseSuccess(
        ShortlistActionTypes.SEND_SHORTLIST,
        response.data,
        'Sélection envoyée au client'
      )
    );
  } catch (error: any) {
    yield put(
      shortlistApiResponseError(
        ShortlistActionTypes.SEND_SHORTLIST,
        error?.message ?? 'Erreur'
      )
    );
  }
}

// ── Items ─────────────────────────────────────────────────────────
function* addItem({ payload }: any): Generator {
  try {
    const response: any = yield call(
      AddShortlistItemApi,
      payload.shortlistId,
      payload.item
    );
    yield put(
      shortlistApiResponseSuccess(ShortlistActionTypes.ADD_ITEM, response.data)
    );
    // Reload to get fresh state
    const refreshed: any = yield call(GetShortlistByIdApi, payload.shortlistId);
    yield put(
      shortlistApiResponseSuccess(ShortlistActionTypes.LOAD_SHORTLIST, refreshed.data)
    );
  } catch (error: any) {
    yield put(
      shortlistApiResponseError(ShortlistActionTypes.ADD_ITEM, error?.message ?? 'Erreur')
    );
  }
}

function* removeItem({ payload }: any): Generator {
  try {
    yield call(RemoveShortlistItemApi, payload.shortlistId, payload.portfolioId);
    yield put(
      shortlistApiResponseSuccess(ShortlistActionTypes.REMOVE_ITEM, {
        portfolioId: payload.portfolioId,
      })
    );
  } catch (error: any) {
    yield put(
      shortlistApiResponseError(
        ShortlistActionTypes.REMOVE_ITEM,
        error?.message ?? 'Erreur'
      )
    );
  }
}

// ── Client view ───────────────────────────────────────────────────
function* viewByToken({ payload }: any): Generator {
  try {
    const response: any = yield call(ViewShortlistByTokenApi, payload.token);
    yield put(
      shortlistApiResponseSuccess(ShortlistActionTypes.VIEW_BY_TOKEN, response.data)
    );
  } catch (error: any) {
    yield put(
      shortlistApiResponseError(
        ShortlistActionTypes.VIEW_BY_TOKEN,
        error?.message ?? 'Erreur'
      )
    );
  }
}

// ── Watchers ──────────────────────────────────────────────────────
function* watchCreateShortlist() {
  yield takeLatest(ShortlistActionTypes.CREATE_SHORTLIST, createShortlist);
}
function* watchLoadMyShortlists() {
  yield takeLatest(ShortlistActionTypes.LOAD_MY_SHORTLISTS, loadMyShortlists);
}
function* watchLoadShortlist() {
  yield takeLatest(ShortlistActionTypes.LOAD_SHORTLIST, loadShortlist);
}
function* watchUpdateShortlist() {
  yield takeLatest(ShortlistActionTypes.UPDATE_SHORTLIST, updateShortlist);
}
function* watchDeleteShortlist() {
  yield takeLatest(ShortlistActionTypes.DELETE_SHORTLIST, deleteShortlist);
}
function* watchSendShortlist() {
  yield takeLatest(ShortlistActionTypes.SEND_SHORTLIST, sendShortlist);
}
function* watchAddItem() {
  yield takeLatest(ShortlistActionTypes.ADD_ITEM, addItem);
}
function* watchRemoveItem() {
  yield takeLatest(ShortlistActionTypes.REMOVE_ITEM, removeItem);
}
function* watchViewByToken() {
  yield takeLatest(ShortlistActionTypes.VIEW_BY_TOKEN, viewByToken);
}

export default function* shortlistSaga() {
  yield all([
    fork(watchCreateShortlist),
    fork(watchLoadMyShortlists),
    fork(watchLoadShortlist),
    fork(watchUpdateShortlist),
    fork(watchDeleteShortlist),
    fork(watchSendShortlist),
    fork(watchAddItem),
    fork(watchRemoveItem),
    fork(watchViewByToken),
  ]);
}