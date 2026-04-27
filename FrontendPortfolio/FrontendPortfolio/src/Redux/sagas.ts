import { all } from 'redux-saga/effects';
import authSaga  from './auth/saga';
import AdminSaga from './admin/saga';
import UserSaga  from './user/saga';
import { watchProfile } from './profile/saga';
import { watchCollaborator } from './collaborator/saga';
import { watchPortfolio } from './portfolio/saga';
import managerSaga from './manager/saga';


export default function* rootSaga() {
  yield all([
    authSaga(),
    AdminSaga(),
    UserSaga(),
    watchProfile(),
    watchCollaborator(),
    watchPortfolio(),
    managerSaga(),
  ]);
}