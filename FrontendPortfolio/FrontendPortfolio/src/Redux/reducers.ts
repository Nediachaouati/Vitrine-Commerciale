import { combineReducers } from 'redux';
import themeConfigSlice from '../store/themeConfigSlice';
import Auth            from './auth/reducers';
import AdminReducer    from './admin/reducers';
import User            from './user/reducers';
import ProfileReducer from './profile/reducers';

export default combineReducers({
  themeConfig: themeConfigSlice,
  Auth,
  Admin: AdminReducer,
  User,
  Profile: ProfileReducer,
});