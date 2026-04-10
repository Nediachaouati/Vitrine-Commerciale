import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { setPageTitle } from '../../store/themeConfigSlice';
import { IRootState } from '../../Redux/store';

const Unauthorized = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    dispatch(setPageTitle('Unauthorized'));
  }, [dispatch]);

  const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

  const handleLogin = () => {
    keycloak.login({
      redirectUri: window.location.origin + (location.state?.from?.pathname || '/'),
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="px-6 py-16 text-center font-semibold before:container before:absolute before:left-1/2 before:-translate-x-1/2 before:rounded-full before:bg-[linear-gradient(180deg,#4361EE_0%,rgba(67,97,238,0)_50.73%)] before:aspect-square before:opacity-10 md:py-20">
        <div className="relative">
          {/* Si tu n’as pas d’icône 401, tu peux garder celle-ci */}
          <img
            src={isDark ? '/assets/images/error/401-dark.svg' : '/assets/images/error/401-light.svg'}
            onError={(e) => {
              // fallback si les svg 401 n’existent pas
              (e.currentTarget as HTMLImageElement).src = isDark ? '/assets/images/error/404-dark.svg' : '/assets/images/error/404-light.svg';
            }}
            alt="Unauthorized"
            className="mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl"
          />

          <h1 className="mt-6 text-2xl font-bold dark:text-white">Session non valide</h1>

          <p className="mt-3 text-base text-gray-600 dark:text-white">Votre session est expirée . Merci de vous reconnecter pour continuer.</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={handleLogin} className="btn btn-gradient w-max border-0 uppercase shadow-none">
              Se reconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
