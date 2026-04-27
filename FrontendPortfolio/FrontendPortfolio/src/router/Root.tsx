import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '../Redux/store';
import { RoleEnum } from '../helpers/model/enum/role.enum';

const Root = () => {
  const { user, userLoggedIn } = useSelector((state: IRootState) => ({
    user: state.Auth.user,
    userLoggedIn: state.Auth.userLoggedIn,
  }));

  if (!userLoggedIn || !user) {
    return <Navigate to="/home" replace />;
  }

  const roles = user.roles || [];

  if (roles.includes(RoleEnum.ADMIN)) {
    return <Navigate to="/gestionusers" replace />;
  }
  if (roles.includes(RoleEnum.MANAGER)) {
    return <Navigate to="/dash" replace />;
  }
  if (roles.includes(RoleEnum.COLLABORATEUR)) {
    return <Navigate to="/portfolio-builder" replace />;
  }

  return <Navigate to="/home" replace />;
};

export default Root;