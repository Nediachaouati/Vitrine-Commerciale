import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

import { APICore, keycloak } from '../../helpers/api/apiCore';
import { authApiResponseSuccess, authApiResponseError } from './actions';
import { AuthActionTypes } from './constants';

const api = new APICore();

/**
 * INIT_AUTH
 * Hydrate Redux depuis Keycloak après initialisation.
 * (à dispatcher une seule fois au boot)
 */
function* initAuth(): SagaIterator {
  try {
    if (keycloak.authenticated) {
      const user = api.getCurrentUserInfo();
      yield put(authApiResponseSuccess(AuthActionTypes.INIT_AUTH, user));
    } else {
      yield put(authApiResponseSuccess(AuthActionTypes.INIT_AUTH, null!));
    }
  } catch (e: any) {
    yield put(authApiResponseError(AuthActionTypes.INIT_AUTH, e?.message || 'init auth error'));
  }
}

/**
 * LOGIN_USER
 * Plus d’appel backend login.
 * On délègue à Keycloak.
 */
function* login(): SagaIterator {
  console.log('login saga');
  try {
    yield call([keycloak, keycloak.login]); // redirect vers Keycloak

    // après redirect + retour, INIT_AUTH hydratera redux
    // mais si tu veux hydrater direct (cas rare):
    // const user = api.getCurrentUserInfo();
    // yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, user));
  } catch (e: any) {
    yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, e?.message || 'login error'));
  }
}

/**
 * LOGOUT_USER
 * Délègue à Keycloak logout.
 */
function* logout(): SagaIterator {
  try {
    // ✅ Keycloak logout + redirect vers home

    yield call([keycloak, keycloak.logout], {} as any);
    // Redux success (normalement tu n’arriveras pas ici car redirect)
    yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {}));
  } catch (e: any) {
    yield put(authApiResponseError(AuthActionTypes.LOGOUT_USER, e?.message || 'logout error'));
  }
}
/**
 * SIGNUP_USER
 * Si tu as activé "User registration" dans Keycloak,
 * login() ouvrira la page avec lien "Register".
 */
function* signup(): SagaIterator {
  try {
    yield call([keycloak, keycloak.register]); // ouvre écran register Keycloak
    yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER, {}));
  } catch (e: any) {
    yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER, e?.message || 'signup error'));
  }
}

/**
 * FORGOT_PASSWORD
 * En Keycloak, c’est géré via la page login (lien reset).
 * Donc ici on redirige vers login avec action reset.
 */
function* forgotPassword(): SagaIterator {
  try {
    yield call([keycloak, keycloak.login], { action: 'UPDATE_PASSWORD' } as any);
    yield put(authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD, {}));
  } catch (e: any) {
    yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD, e?.message || 'forgot password error'));
  }
}

// watchers
export function* watchInitAuth() {
  yield takeEvery(AuthActionTypes.INIT_AUTH, initAuth);
}
export function* watchLoginUser() {
  yield takeEvery(AuthActionTypes.LOGIN_USER, login);
}
export function* watchLogout() {
  yield takeEvery(AuthActionTypes.LOGOUT_USER, logout);
}
export function* watchSignup() {
  yield takeEvery(AuthActionTypes.SIGNUP_USER, signup);
}
export function* watchForgotPassword() {
  yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword);
}

// root saga
function* authSaga() {
  yield all([fork(watchInitAuth), fork(watchLoginUser), fork(watchLogout), fork(watchSignup), fork(watchForgotPassword)]);
}

export default authSaga;
