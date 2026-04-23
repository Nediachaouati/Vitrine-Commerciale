import { lazy, Suspense } from 'react';
import Root from './Root';
import { useRoutes, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import BlankLayout from '../components/Layouts/BlankLayout';
import { RoleEnum } from '../helpers/model/enum/role.enum';


const UserProfilePage = lazy(() => import('../pages/tri.training/workspace/UserProfile'));   
const PortfolioBuilder = lazy(() => import('../pages/tri.training/workspace/PortfolioBuilder'));
const MyPortfolioPage = lazy(() => import('../pages/tri.training/workspace/MyPortfolio'));
const ContactUs    = lazy(() => import('../pages/tri.training/landing/ContactUs/ContactUs'));
const AboutUs      = lazy(() => import('../pages/tri.training/landing/AboutUs/AboutUs'));
const GestionUsers = lazy(() => import('../pages/tri.training/workspace/GestionUsers/GestionUsers'));
const DefaultLayout = lazy(() => import('../components/Layouts/DefaultLayout'));
const Unauthorized  = lazy(() => import('../pages/Pages/Unauthorized'));
const Home          = lazy(() => import('../pages/tri.training/landing/home/Home'));

const loading = () => <div className=""></div>;

type LoadComponentProps = {
  component: React.LazyExoticComponent<() => JSX.Element>;
};

const LoadComponent = ({ component: Component }: LoadComponentProps) => (
  <Suspense fallback={loading()}>
    <Component />
  </Suspense>
);

const AllRoutes = () => {
  return useRoutes([
    {
      path: '/',
      element: <BlankLayout />,
      children: [
        { path: '',              element: <Root /> },
        { path: '/Unauthorized', element: <LoadComponent component={Unauthorized} /> },
      ],
    },
    {
      path: '/',
      element: <LoadComponent component={DefaultLayout} />,
      children: [
        { path: 'home',      element: <LoadComponent component={Home}      /> },
        { path: 'contactus', element: <LoadComponent component={ContactUs} /> },
        { path: 'aboutus',   element: <LoadComponent component={AboutUs}   /> },

        {
          path: 'profile',
          element: <LoadComponent component={UserProfilePage} />,
        },
        { path: 'portfolio-builder', element: <LoadComponent component={PortfolioBuilder} /> },
        { path: 'mon-portfolio',     element: <LoadComponent component={MyPortfolioPage}  /> },
        // ── Ancienne route (gardée pour compatibilité) ──
        {
          path: '/gestionutlilisateurs',
          element: (
            <PrivateRoute
              roles={[RoleEnum.ADMIN]}
              component={GestionUsers as React.ComponentType<any>}
            />
          ),
        },

        // ── Redirection /gestionusers → /gestionusers/collaborateurs ──
        {
          path: '/gestionusers',
          element: <Navigate to="/gestionusers/collaborateurs" replace />,
        },

        // ── Routes Gestion Users par rôle ──
        {
          path: '/gestionusers/collaborateurs',
          element: (
            <PrivateRoute
              roles={[RoleEnum.ADMIN]}
              component={GestionUsers as React.ComponentType<any>}
            />
          ),
        },
        {
          path: '/gestionusers/managers',
          element: (
            <PrivateRoute
              roles={[RoleEnum.ADMIN]}
              component={GestionUsers as React.ComponentType<any>}
            />
          ),
        },
      ],
    },
  ]);
};

export { AllRoutes };