// Redux/collaborator/saga.ts
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { CollaboratorActionTypes } from './constants';
import { collabApiResponseSuccess, collabApiResponseError, GetMe } from './actions';
import {
  GetMeApi,
  AddSkillApi, UpdateSkillApi, DeleteSkillApi,
  AddExperienceApi, UpdateExperienceApi, DeleteExperienceApi,
  AddEducationApi, UpdateEducationApi, DeleteEducationApi,
  AddCertificationApi, UpdateCertificationApi, DeleteCertificationApi,
  AddProjectApi, UpdateProjectApi, DeleteProjectApi,
} from '../../helpers/api/CollaboratorApi';

// ── GET ME ───────────────────────────────────────────────────────────────
function* getMeSaga(): SagaIterator {
  try {
    const r = yield call(GetMeApi);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.GET_ME, r.data));
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.GET_ME, e?.message));
  }
}

// ── SKILLS ───────────────────────────────────────────────────────────────
function* addSkillSaga({ payload }: any): SagaIterator {
  try {
    yield call(AddSkillApi, payload.dto);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.ADD_SKILL, null, 'Skill ajouté'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.ADD_SKILL, e?.response?.data?.message ?? e?.message));
  }
}

function* updateSkillSaga({ payload }: any): SagaIterator {
  try {
    yield call(UpdateSkillApi, payload.id, payload.dto);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.UPDATE_SKILL, null, 'Skill mis à jour'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.UPDATE_SKILL, e?.response?.data?.message ?? e?.message));
  }
}

function* deleteSkillSaga({ payload }: any): SagaIterator {
  try {
    yield call(DeleteSkillApi, payload.id);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.DELETE_SKILL, null, 'Skill supprimé'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.DELETE_SKILL, e?.response?.data?.message ?? e?.message));
  }
}

// ── EXPERIENCES ──────────────────────────────────────────────────────────
function* addExperienceSaga({ payload }: any): SagaIterator {
  try {
    yield call(AddExperienceApi, payload.dto);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.ADD_EXPERIENCE, null, 'Expérience ajoutée'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.ADD_EXPERIENCE, e?.response?.data?.message ?? e?.message));
  }
}

function* updateExperienceSaga({ payload }: any): SagaIterator {
  try {
    yield call(UpdateExperienceApi, payload.id, payload.dto);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.UPDATE_EXPERIENCE, null, 'Expérience mise à jour'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.UPDATE_EXPERIENCE, e?.response?.data?.message ?? e?.message));
  }
}

function* deleteExperienceSaga({ payload }: any): SagaIterator {
  try {
    yield call(DeleteExperienceApi, payload.id);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.DELETE_EXPERIENCE, null, 'Expérience supprimée'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.DELETE_EXPERIENCE, e?.response?.data?.message ?? e?.message));
  }
}

// ── EDUCATION ────────────────────────────────────────────────────────────
function* addEducationSaga({ payload }: any): SagaIterator {
  try {
    yield call(AddEducationApi, payload.dto);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.ADD_EDUCATION, null, 'Formation ajoutée'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.ADD_EDUCATION, e?.response?.data?.message ?? e?.message));
  }
}

function* updateEducationSaga({ payload }: any): SagaIterator {
  try {
    yield call(UpdateEducationApi, payload.id, payload.dto);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.UPDATE_EDUCATION, null, 'Formation mise à jour'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.UPDATE_EDUCATION, e?.response?.data?.message ?? e?.message));
  }
}

function* deleteEducationSaga({ payload }: any): SagaIterator {
  try {
    yield call(DeleteEducationApi, payload.id);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.DELETE_EDUCATION, null, 'Formation supprimée'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.DELETE_EDUCATION, e?.response?.data?.message ?? e?.message));
  }
}

// ── CERTIFICATIONS ───────────────────────────────────────────────────────
function* addCertificationSaga({ payload }: any): SagaIterator {
  try {
    yield call(AddCertificationApi, payload.dto);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.ADD_CERTIFICATION, null, 'Certification ajoutée'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.ADD_CERTIFICATION, e?.response?.data?.message ?? e?.message));
  }
}

function* updateCertificationSaga({ payload }: any): SagaIterator {
  try {
    yield call(UpdateCertificationApi, payload.id, payload.dto);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.UPDATE_CERTIFICATION, null, 'Certification mise à jour'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.UPDATE_CERTIFICATION, e?.response?.data?.message ?? e?.message));
  }
}

function* deleteCertificationSaga({ payload }: any): SagaIterator {
  try {
    yield call(DeleteCertificationApi, payload.id);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.DELETE_CERTIFICATION, null, 'Certification supprimée'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.DELETE_CERTIFICATION, e?.response?.data?.message ?? e?.message));
  }
}

// ── PROJECTS ─────────────────────────────────────────────────────────────
function* addProjectSaga({ payload }: any): SagaIterator {
  try {
    yield call(AddProjectApi, payload.dto);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.ADD_PROJECT, null, 'Projet ajouté'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.ADD_PROJECT, e?.response?.data?.message ?? e?.message));
  }
}

function* updateProjectSaga({ payload }: any): SagaIterator {
  try {
    yield call(UpdateProjectApi, payload.id, payload.dto);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.UPDATE_PROJECT, null, 'Projet mis à jour'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.UPDATE_PROJECT, e?.response?.data?.message ?? e?.message));
  }
}

function* deleteProjectSaga({ payload }: any): SagaIterator {
  try {
    yield call(DeleteProjectApi, payload.id);
    yield put(collabApiResponseSuccess(CollaboratorActionTypes.DELETE_PROJECT, null, 'Projet supprimé'));
    yield put(GetMe());
  } catch (e: any) {
    yield put(collabApiResponseError(CollaboratorActionTypes.DELETE_PROJECT, e?.response?.data?.message ?? e?.message));
  }
}

// ── ROOT WATCHER ─────────────────────────────────────────────────────────
export function* watchCollaborator() {
  yield all([
    takeEvery(CollaboratorActionTypes.GET_ME, getMeSaga),
    takeEvery(CollaboratorActionTypes.ADD_SKILL, addSkillSaga),
    takeEvery(CollaboratorActionTypes.UPDATE_SKILL, updateSkillSaga),
    takeEvery(CollaboratorActionTypes.DELETE_SKILL, deleteSkillSaga),
    takeEvery(CollaboratorActionTypes.ADD_EXPERIENCE, addExperienceSaga),
    takeEvery(CollaboratorActionTypes.UPDATE_EXPERIENCE, updateExperienceSaga),
    takeEvery(CollaboratorActionTypes.DELETE_EXPERIENCE, deleteExperienceSaga),
    takeEvery(CollaboratorActionTypes.ADD_EDUCATION, addEducationSaga),
    takeEvery(CollaboratorActionTypes.UPDATE_EDUCATION, updateEducationSaga),
    takeEvery(CollaboratorActionTypes.DELETE_EDUCATION, deleteEducationSaga),
    takeEvery(CollaboratorActionTypes.ADD_CERTIFICATION, addCertificationSaga),
    takeEvery(CollaboratorActionTypes.UPDATE_CERTIFICATION, updateCertificationSaga),
    takeEvery(CollaboratorActionTypes.DELETE_CERTIFICATION, deleteCertificationSaga),
    takeEvery(CollaboratorActionTypes.ADD_PROJECT, addProjectSaga),
    takeEvery(CollaboratorActionTypes.UPDATE_PROJECT, updateProjectSaga),
    takeEvery(CollaboratorActionTypes.DELETE_PROJECT, deleteProjectSaga),
  ]);
}