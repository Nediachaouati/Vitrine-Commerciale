import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { APICore } from '../helpers/api/apiCore'; // adapte ton chemin

type PrivateRouteProps = {
  component: React.ComponentType<any>;
  roles?: string[];
};

const api = new APICore();

const PrivateRoute = ({ component: RouteComponent, roles }: PrivateRouteProps) => {
  const location = useLocation();
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return null;

  if (!keycloak.authenticated) {
    keycloak.login({
      redirectUri: window.location.origin + location.pathname,
    });
    return null;
  }

  // ✅ On récupère tout depuis APICore
  const user = api.getCurrentUserInfo();
  const userRoles = user.roles || [];

  if (roles && roles.length > 0) {
    const hasRole = roles.some((r) => userRoles.includes(r));

    if (!hasRole) {
      keycloak.login({
        redirectUri: window.location.origin + (location.state?.from?.pathname || '/'),
      });
    }
  }

  return <RouteComponent />;
};

export default PrivateRoute;
