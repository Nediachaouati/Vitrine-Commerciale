import { all } from 'redux-saga/effects';
import authSaga  from './auth/saga';
import AdminSaga from './admin/saga';
import UserSaga  from './user/saga';
import { watchProfile } from './profile/saga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    AdminSaga(),
    UserSaga(),
    watchProfile(),
  ]);
}