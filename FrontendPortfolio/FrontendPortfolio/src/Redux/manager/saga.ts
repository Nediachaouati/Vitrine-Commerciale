import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { ManagerActionTypes } from './constants';
import {
  managerApiResponseSuccess,
  managerApiResponseError,
} from './actions';
import {
  GetDashboardApi,
  FilterPortfoliosApi,
  CreateClientNeedApi,
  GetMyNeedsApi,
  MatchFromNeedApi,
  MatchDirectApi,
  GetMatchCriteriaApi,
  GetSuggestionsApi,
   BatchSwitchApi,
  GetSwitchedViewsApi,
  DeleteSwitchedViewApi,
} from '../../helpers/api/ManagerApi';

// ── Dashboard ──────────────────────────────────────────────────────
function* loadDashboard(): Generator {
  try {
    const response: any = yield call(GetDashboardApi);
    yield put(managerApiResponseSuccess(ManagerActionTypes.LOAD_DASHBOARD, response.data));
  } catch (error: any) {
    yield put(managerApiResponseError(ManagerActionTypes.LOAD_DASHBOARD, error?.message ?? 'Erreur'));
  }
}

// ── Besoins client ─────────────────────────────────────────────────
function* createNeed({ payload }: any): Generator {
  try {
    // 1. Créer le besoin
    const response: any = yield call(CreateClientNeedApi, payload.dto);
    const need = response.data;

    yield put(managerApiResponseSuccess(
      ManagerActionTypes.CREATE_NEED,
      need,
      'Besoin créé avec succès'
    ));

    // 2. ✅ Lancer le matching automatiquement avec le nouveau besoin
    const matchResponse: any = yield call(MatchFromNeedApi, need.needId);
    yield put(managerApiResponseSuccess(ManagerActionTypes.RUN_MATCH, matchResponse.data));

  } catch (error: any) {
    yield put(managerApiResponseError(ManagerActionTypes.CREATE_NEED, error?.message ?? 'Erreur'));
  }
}

function* loadMyNeeds(): Generator {
  try {
    const response: any = yield call(GetMyNeedsApi);
    yield put(managerApiResponseSuccess(ManagerActionTypes.LOAD_MY_NEEDS, response.data));
  } catch (error: any) {
    yield put(managerApiResponseError(ManagerActionTypes.LOAD_MY_NEEDS, error?.message ?? 'Erreur'));
  }
}

// ── Matching ───────────────────────────────────────────────────────
function* runMatch({ payload }: any): Generator {
  try {
    const response: any = yield call(MatchFromNeedApi, payload.needId);
    yield put(managerApiResponseSuccess(ManagerActionTypes.RUN_MATCH, response.data));
  } catch (error: any) {
    yield put(managerApiResponseError(ManagerActionTypes.RUN_MATCH, error?.message ?? 'Erreur'));
  }
}

function* matchDirect({ payload }: any): Generator {
  try {
    const response: any = yield call(MatchDirectApi, payload.dto);
    yield put(managerApiResponseSuccess(ManagerActionTypes.MATCH_DIRECT, response.data));
  } catch (error: any) {
    yield put(managerApiResponseError(ManagerActionTypes.MATCH_DIRECT, error?.message ?? 'Erreur'));
  }
}

// ── Critères ───────────────────────────────────────────────────────
function* loadCriteria({ payload }: any): Generator {
  try {
    const response: any = yield call(GetMatchCriteriaApi, payload.needId, payload.collaboratorId);
    yield put(managerApiResponseSuccess(ManagerActionTypes.LOAD_CRITERIA, response.data));
  } catch (error: any) {
    yield put(managerApiResponseError(ManagerActionTypes.LOAD_CRITERIA, error?.message ?? 'Erreur'));
  }
}

// ── Suggestions ────────────────────────────────────────────────────
function* loadSuggestions({ payload }: any): Generator {
  try {
    const response: any = yield call(GetSuggestionsApi, payload.needId, payload.collaboratorId);
    yield put(managerApiResponseSuccess(ManagerActionTypes.LOAD_SUGGESTIONS, response.data));
  } catch (error: any) {
    yield put(managerApiResponseError(ManagerActionTypes.LOAD_SUGGESTIONS, error?.message ?? 'Erreur'));
  }
}

// ── Portfolios filtrés ─────────────────────────────────────────────
function* filterPortfolios({ payload }: any): Generator {
  try {
    const response: any = yield call(FilterPortfoliosApi, payload.filter);
    yield put(managerApiResponseSuccess(ManagerActionTypes.FILTER_PORTFOLIOS, response.data));
  } catch (error: any) {
    yield put(managerApiResponseError(ManagerActionTypes.FILTER_PORTFOLIOS, error?.message ?? 'Erreur'));
  }
}

// ── Batch Switch ───────────────────────────────────────────────────
function* batchSwitch({ payload }: any): Generator {
  try {
    const response: any = yield call(BatchSwitchApi, payload.dto);
    yield put(managerApiResponseSuccess(
      ManagerActionTypes.BATCH_SWITCH,
      response.data,
      'Repositionnement effectué avec succès'
    ));
    // ✅ Recharge TOUTES les vues sans filtre tech après batch switch
    const viewsResponse: any = yield call(GetSwitchedViewsApi, undefined);
    yield put(managerApiResponseSuccess(ManagerActionTypes.LOAD_SWITCHED_VIEWS, viewsResponse.data));
  } catch (error: any) {
    yield put(managerApiResponseError(ManagerActionTypes.BATCH_SWITCH, error?.message ?? 'Erreur'));
  }
}
 
function* loadSwitchedViews({ payload }: any): Generator {
  try {
    const response: any = yield call(GetSwitchedViewsApi, payload.tech);
    yield put(managerApiResponseSuccess(ManagerActionTypes.LOAD_SWITCHED_VIEWS, response.data));
  } catch (error: any) {
    yield put(managerApiResponseError(ManagerActionTypes.LOAD_SWITCHED_VIEWS, error?.message ?? 'Erreur'));
  }
}
 
function* deleteSwitchedView({ payload }: any): Generator {
  try {
    yield call(DeleteSwitchedViewApi, payload.viewId);
    // ✅ Passe viewId explicitement car backend retourne juste { message }
    yield put(managerApiResponseSuccess(
      ManagerActionTypes.DELETE_SWITCHED_VIEW,
      { viewId: payload.viewId }
    ));
  } catch (error: any) {
    yield put(managerApiResponseError(ManagerActionTypes.DELETE_SWITCHED_VIEW, error?.message ?? 'Erreur'));
  }
}
 


// ── Watchers ───────────────────────────────────────────────────────
function* watchLoadDashboard() { yield takeLatest(ManagerActionTypes.LOAD_DASHBOARD, loadDashboard); }
function* watchCreateNeed()    { yield takeLatest(ManagerActionTypes.CREATE_NEED, createNeed); }
function* watchLoadMyNeeds()   { yield takeLatest(ManagerActionTypes.LOAD_MY_NEEDS, loadMyNeeds); }
function* watchRunMatch()      { yield takeLatest(ManagerActionTypes.RUN_MATCH, runMatch); }
function* watchMatchDirect()   { yield takeLatest(ManagerActionTypes.MATCH_DIRECT, matchDirect); }
function* watchLoadCriteria()  { yield takeLatest(ManagerActionTypes.LOAD_CRITERIA, loadCriteria); }
function* watchLoadSuggestions() { yield takeLatest(ManagerActionTypes.LOAD_SUGGESTIONS, loadSuggestions); }
function* watchFilterPortfolios() { yield takeLatest(ManagerActionTypes.FILTER_PORTFOLIOS, filterPortfolios); }
function* watchBatchSwitch()      { yield takeLatest(ManagerActionTypes.BATCH_SWITCH, batchSwitch); }
function* watchLoadSwitchedViews(){ yield takeLatest(ManagerActionTypes.LOAD_SWITCHED_VIEWS, loadSwitchedViews); }
function* watchDeleteSwitchedView(){ yield takeLatest(ManagerActionTypes.DELETE_SWITCHED_VIEW, deleteSwitchedView); }
export default function* managerSaga() {
  yield all([
    fork(watchLoadDashboard),
    fork(watchCreateNeed),
    fork(watchLoadMyNeeds),
    fork(watchRunMatch),
    fork(watchMatchDirect),
    fork(watchLoadCriteria),
    fork(watchLoadSuggestions),
    fork(watchFilterPortfolios),
    fork(watchBatchSwitch),
    fork(watchLoadSwitchedViews),
    fork(watchDeleteSwitchedView),
  ]);
}