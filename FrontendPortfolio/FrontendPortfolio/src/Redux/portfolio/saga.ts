import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { PortfolioActionTypes, PortfolioMessages } from './constants';
import { portfolioApiResponseSuccess, portfolioApiResponseError, LoadPortfolio } from './actions';
import {
  GetMyPortfoliosApi,
  GetPortfolioApi,
  CreatePortfolioApi,
  UpdatePortfolioApi,
  DeletePortfolioApi,
  SetPortfolioSkillsApi,
  SetPortfolioExperiencesApi,
  SetPortfolioEducationApi,
  SetPortfolioCertificationsApi,
  SetPortfolioProjectsApi,
  PortfolioChatApi,
  GetPortfolioBySlugApi,
} from '../../helpers/api/PortfolioApi';

function* loadMyPortfoliosSaga(): SagaIterator {
  try {
    const r = yield call(GetMyPortfoliosApi);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.LOAD_MY_PORTFOLIOS, r.data));
  } catch (e: any) {
    yield put(portfolioApiResponseError(PortfolioActionTypes.LOAD_MY_PORTFOLIOS, e?.message));
  }
}

function* loadPortfolioSaga({ payload }: any): SagaIterator {
  try {
    const r = yield call(GetPortfolioApi, payload.portfolioId);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.LOAD_PORTFOLIO, r.data));
  } catch (e: any) {
    yield put(portfolioApiResponseError(PortfolioActionTypes.LOAD_PORTFOLIO, e?.message));
  }
}

function* createPortfolioSaga({ payload }: any): SagaIterator {
  try {
    const r = yield call(CreatePortfolioApi, payload.dto);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.CREATE_PORTFOLIO, r.data, PortfolioMessages.CREATED));
  } catch (e: any) {
    yield put(portfolioApiResponseError(PortfolioActionTypes.CREATE_PORTFOLIO, e?.response?.data?.message ?? e?.message));
  }
}

function* updatePortfolioSaga({ payload }: any): SagaIterator {
  try {
    const r = yield call(UpdatePortfolioApi, payload.portfolioId, payload.dto);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.UPDATE_PORTFOLIO, r.data, PortfolioMessages.UPDATED));
    //  Recharger la liste pour synchroniser avec la BDD
    const portfolios: any = yield call(GetMyPortfoliosApi);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.LOAD_MY_PORTFOLIOS, portfolios.data));
  } catch (e: any) {
    yield put(portfolioApiResponseError(PortfolioActionTypes.UPDATE_PORTFOLIO, e?.message));
  }
}

function* deletePortfolioSaga({ payload }: any): SagaIterator {
  try {
    yield call(DeletePortfolioApi, payload.portfolioId);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.DELETE_PORTFOLIO, { portfolioId: payload.portfolioId }, PortfolioMessages.DELETED));
    const r = yield call(GetMyPortfoliosApi);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.LOAD_MY_PORTFOLIOS, r.data));
  } catch (e: any) {
    yield put(portfolioApiResponseError(PortfolioActionTypes.DELETE_PORTFOLIO, e?.message));
  }
}

function* setSkillsSaga({ payload }: any): SagaIterator {
  try {
    yield call(SetPortfolioSkillsApi, payload.portfolioId, payload.dto);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.SET_SKILLS, null, 'Skills mis à jour'));
    yield put(LoadPortfolio(payload.portfolioId));
  } catch (e: any) {
    yield put(portfolioApiResponseError(PortfolioActionTypes.SET_SKILLS, e?.message));
  }
}

function* setExperiencesSaga({ payload }: any): SagaIterator {
  try {
    yield call(SetPortfolioExperiencesApi, payload.portfolioId, payload.dto);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.SET_EXPERIENCES, null, 'Expériences mises à jour'));
    yield put(LoadPortfolio(payload.portfolioId));
  } catch (e: any) {
    yield put(portfolioApiResponseError(PortfolioActionTypes.SET_EXPERIENCES, e?.message));
  }
}

function* setEducationSaga({ payload }: any): SagaIterator {
  try {
    yield call(SetPortfolioEducationApi, payload.portfolioId, payload.dto);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.SET_EDUCATION, null, 'Formations mises à jour'));
    yield put(LoadPortfolio(payload.portfolioId));
  } catch (e: any) {
    yield put(portfolioApiResponseError(PortfolioActionTypes.SET_EDUCATION, e?.message));
  }
}

function* setCertificationsSaga({ payload }: any): SagaIterator {
  try {
    yield call(SetPortfolioCertificationsApi, payload.portfolioId, payload.dto);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.SET_CERTIFICATIONS, null, 'Certifications mises à jour'));
    yield put(LoadPortfolio(payload.portfolioId));
  } catch (e: any) {
    yield put(portfolioApiResponseError(PortfolioActionTypes.SET_CERTIFICATIONS, e?.message));
  }
}

function* setProjectsSaga({ payload }: any): SagaIterator {
  try {
    yield call(SetPortfolioProjectsApi, payload.portfolioId, payload.dto);
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.SET_PROJECTS, null, 'Projets mis à jour'));
    yield put(LoadPortfolio(payload.portfolioId));
  } catch (e: any) {
    yield put(portfolioApiResponseError(PortfolioActionTypes.SET_PROJECTS, e?.message));
  }
}

function* chatSendMessageSaga({ payload }: any): SagaIterator {
  try {
    const r = yield call(PortfolioChatApi, payload.portfolioId, {
      collaboratorId: payload.collaboratorId,
      messages: payload.messages,
    });
    yield put(portfolioApiResponseSuccess(PortfolioActionTypes.CHAT_SEND_MESSAGE, r.data));
    yield put(LoadPortfolio(payload.portfolioId));
  } catch (e: any) {
    yield put(portfolioApiResponseError(PortfolioActionTypes.CHAT_SEND_MESSAGE, e?.message));
  }
}

//public slug 
function* loadPortfolioBySlug({ payload }: any): Generator {
  try {
    const response: any = yield call(GetPortfolioBySlugApi, payload.slug);
    yield put(portfolioApiResponseSuccess(
      PortfolioActionTypes.LOAD_PORTFOLIO_BY_SLUG,
      response.data
    ));
  } catch (error: any) {
    yield put(portfolioApiResponseError(
      PortfolioActionTypes.LOAD_PORTFOLIO_BY_SLUG,
      error?.message ?? 'Erreur'
    ));
  }
}

export function* watchPortfolio() {
  yield all([
    takeEvery(PortfolioActionTypes.LOAD_MY_PORTFOLIOS, loadMyPortfoliosSaga),
    takeEvery(PortfolioActionTypes.LOAD_PORTFOLIO, loadPortfolioSaga),
    takeEvery(PortfolioActionTypes.CREATE_PORTFOLIO, createPortfolioSaga),
    takeEvery(PortfolioActionTypes.UPDATE_PORTFOLIO, updatePortfolioSaga),
    takeEvery(PortfolioActionTypes.DELETE_PORTFOLIO, deletePortfolioSaga),
    takeEvery(PortfolioActionTypes.SET_SKILLS, setSkillsSaga),
    takeEvery(PortfolioActionTypes.SET_EXPERIENCES, setExperiencesSaga),
    takeEvery(PortfolioActionTypes.SET_EDUCATION, setEducationSaga),
    takeEvery(PortfolioActionTypes.SET_CERTIFICATIONS, setCertificationsSaga),
    takeEvery(PortfolioActionTypes.SET_PROJECTS, setProjectsSaga),
    takeEvery(PortfolioActionTypes.CHAT_SEND_MESSAGE, chatSendMessageSaga),
        takeEvery(PortfolioActionTypes.LOAD_PORTFOLIO_BY_SLUG, loadPortfolioBySlug),
  ]);
}