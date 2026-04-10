import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { toggleTheme, toggleSidebar } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import IconUser from '../Icon/IconUser';
import IconLogout from '../Icon/IconLogout';
import { loginUser, logoutUser } from '../../Redux/actions';
import { IRootState } from '../../Redux/store';
import { useRedux } from '../../hooks';
import { RoleEnum } from '../../helpers/model/enum/role.enum';

const Header = () => {
  const location = useLocation();
  const { dispatch, appSelector } = useRedux();
  const { t } = useTranslation();

  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  const { userConnected, userLoggedIn } = appSelector((state: any) => ({
    userConnected: state.Auth.user ?? null,
    userLoggedIn: state.Auth.userLoggedIn ?? false,
  }));

  // Détection des rôles (utile pour d'autres choses plus tard)
  const roles = userConnected?.roles || [];
  const isAdmin = roles.includes(RoleEnum.ADMIN);

  useEffect(() => {
    const selector = document.querySelector(
      'ul.horizontal-menu a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add('active');
      document
        .querySelectorAll('ul.horizontal-menu .nav-link.active')
        .forEach((el: any) => el.classList.remove('active'));
      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        const ele: any = ul.closest('li.menu')?.querySelectorAll('.nav-link')?.[0];
        if (ele) setTimeout(() => ele.classList.add('active'));
      } else {
        selector.classList.add('active');
      }
    }
  }, [location]);

  const handleLogout = () => dispatch(logoutUser());

  return (
    <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
      <div className="shadow-sm">
        <div className="relative bg-white flex w-full items-center px-5 dark:bg-black py-2">

          {/* Logo */}
          <div className="horizontal-logo flex items-center ltr:mr-2 rtl:ml-2">
            <Link to="/home" className="main-logo flex items-center shrink-0">
              <img className="w-10 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/images/logo_-tri.png" alt="logo" />
              <span className="text-2xl ltr:ml-2 rtl:mr-2 font-bold text-gray-600 dark:text-white-light transition-all duration-300">
                VITRINE
              </span>
            </Link>
          </div>

          <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6] justify-end">

            {/* Menu nav simplifié - Plus de "À propos" ni "Contact" pour personne */}
            <ul className="horizontal-menuTop flex font-semibold text-black dark:text-white-dark">
              <li className="menu nav-item relative">
                <NavLink to="/home" className="nav-link">
                  <span className="px-1">{t('Accueil')}</span>
                </NavLink>
              </li>
            </ul>

            {/* Theme toggle */}
            <div>
              {themeConfig.theme === 'light' && (
                <button
                  className="w-9 h-9 flex items-center p-2 bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                  onClick={() => dispatch(toggleTheme('dark'))}
                >
                  <IconSun />
                </button>
              )}
              {themeConfig.theme === 'dark' && (
                <button
                  className="w-9 h-9 flex items-center p-2 bg-white-light/40 dark:bg-dark/40 hover:text-white hover:bg-primary dark:hover:bg-primary"
                  onClick={() => dispatch(toggleTheme('system'))}
                >
                  <IconMoon />
                </button>
              )}
              {themeConfig.theme === 'system' && (
                <button
                  className="w-9 h-9 flex items-center p-2 bg-white-light/40 dark:bg-dark/40 hover:text-white hover:bg-primary dark:hover:bg-primary"
                  onClick={() => dispatch(toggleTheme('light'))}
                >
                  <IconLaptop />
                </button>
              )}
            </div>

            {/* Mobile sidebar toggle */}
            <button
              type="button"
              className="collapse-icon lg:hidden w-9 h-9 flex-none dark:text-[#d0d2d6] hover:text-white ltr:ml-2 rtl:mr-2 p-2 bg-white-light/40 dark:bg-dark/40 hover:bg-primary dark:hover:bg-primary"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconMenu className="w-5 h-5" />
            </button>

            {/* User dropdown / Connexion */}
            {userLoggedIn ? (
              <div className="dropdown shrink-0 flex">
                <Dropdown
                  offset={[0, 8]}
                  placement={isRtl ? 'bottom-start' : 'bottom-end'}
                  btnClassName="relative group block flex"
                  button={
                    <span className="h-9 flex-none ltr:ml-2 rtl:mr-2 p-2 bg-white-light/40 dark:bg-dark/40 hover:bg-primary dark:hover:bg-primary rounded-md font-bold dark:text-white">
                      {userConnected?.firstName?.charAt(0) ?? '?'}
                      {userConnected?.lastName?.charAt(0) ?? '?'}
                    </span>
                  }
                >
                  <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold">
                    <li>
                      <div className="flex items-center px-4 py-4">
                        <span className="h-9 p-2 bg-primary/10 rounded-md font-bold text-primary">
                          {userConnected?.firstName?.charAt(0) ?? '?'}
                          {userConnected?.lastName?.charAt(0) ?? '?'}
                        </span>
                        <div className="ltr:pl-4 rtl:pr-4 truncate">
                          <h4 className="text-base dark:text-white">
                            {userConnected?.firstName} {userConnected?.lastName}
                          </h4>
                          <div className="text-xs bg-primary/10 text-primary rounded px-1 mt-1">
                            {userConnected?.roles?.[0] ?? '—'}
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <Link to="/profile" className="dark:hover:text-white">
                        <IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                        {t('Profil')}
                      </Link>
                    </li>
                    <li onClick={handleLogout} className="border-t border-white-light dark:border-white-light/10">
                      <Link to="#" className="text-danger !py-3">
                        <IconLogout className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                        {t('Déconnexion')}
                      </Link>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            ) : (
              <button
                type="button"
                className="flex-none dark:text-[#d0d2d6] hover:text-primary ltr:ml-2 rtl:mr-2 p-2 rounded-md bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                onClick={() => dispatch(loginUser())}
              >
                {t('Connexion')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;