import { combineReducers } from 'redux';
import themeConfigSlice from '../store/themeConfigSlice';
import Auth            from './auth/reducers';
import AdminReducer    from './admin/reducers';
import User            from './user/reducers';
import ProfileReducer from './profile/reducers';
import PortfolioReducer from './portfolio/reducer';
import CollaboratorReducer from './collaborator/reducer';
import ManagerReducer from './manager/reducers';
import RealisationReducer from './realisation/reducer';


export default combineReducers({
  themeConfig: themeConfigSlice,
  Auth,
  Admin: AdminReducer,
  User,
  Profile: ProfileReducer,
  Collaborator: CollaboratorReducer,
  Portfolio: PortfolioReducer,
  Manager: ManagerReducer,
  Realisation: RealisationReducer,
});