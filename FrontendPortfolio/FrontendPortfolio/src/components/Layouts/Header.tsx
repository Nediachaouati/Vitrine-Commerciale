// Header.tsx
import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';   // ← Ajout de useDispatch
import { useTranslation } from 'react-i18next';

import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import IconUser from '../Icon/IconUser';
import IconLogout from '../Icon/IconLogout';
import IconCaretDown from '../Icon/IconCaretDown';

import { logoutUser } from '../../Redux/actions';
import { IRootState } from '../../Redux/store';
import { RoleEnum } from '../../helpers/model/enum/role.enum';
import { toggleTheme, toggleSidebar } from '../../store/themeConfigSlice';

const Header = () => {
    const location = useLocation();
    const { t } = useTranslation();

    // ✅ Déclaration de dispatch
    const dispatch = useDispatch();

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const isRtl = themeConfig.rtlClass === 'rtl';

    const { userConnected, userLoggedIn } = useSelector((state: IRootState) => ({
        userConnected: state.Auth.user ?? null,
        userLoggedIn: state.Auth.userLoggedIn ?? false,
    }));

    const roles = userConnected?.roles || [];
    const isAdmin = roles.includes(RoleEnum.ADMIN);
    const isCollab = roles.includes(RoleEnum.COLLABORATEUR);

    // Highlight active link
    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            document.querySelectorAll('ul.horizontal-menu .nav-link').forEach((el: any) => el.classList.remove('active'));
            selector.classList.add('active');
        }
    }, [location]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-sm">
                {/* ==================== MENU PUBLIC ==================== */}
                <div className="relative bg-white flex w-full items-center px-5 dark:bg-black py-2">
                    {/* Logo */}
                    <div className="horizontal-logo flex items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/home" className="main-logo flex items-center shrink-0">
                            <img className="w-10 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/images/logo_-tri.png" alt="logo" />
                            <span className="text-2xl ltr:ml-2 rtl:mr-2 font-bold text-gray-600 dark:text-white-light">
                                VITRINE
                            </span>
                        </Link>
                    </div>

                    <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6] justify-end">

                        {/* Menu Public */}
                        <ul className="horizontal-menu flex font-semibold text-black dark:text-white-dark">
                            <li className="menu nav-item relative">
                                <NavLink to="/home" className="nav-link px-3 py-2">{t('Accueil')}</NavLink>
                            </li>
                            <li className="menu nav-item relative">
                                <NavLink to="/aboutus" className="nav-link px-3 py-2">{t('À propos de nous')}</NavLink>
                            </li>
                            <li className="menu nav-item relative">
                                <NavLink to="/contactus" className="nav-link px-3 py-2">{t('Contactez-nous')}</NavLink>
                            </li>
                        </ul>

                        {/* ==================== THEME TOGGLE ==================== */}
                        <div>
                            {themeConfig.theme === 'light' && (
                                <button
                                    className="w-9 h-9 flex items-center p-2 bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60 rounded"
                                    onClick={() => dispatch(toggleTheme('dark'))}
                                >
                                    <IconSun />
                                </button>
                            )}

                            {themeConfig.theme === 'dark' && (
                                <button
                                    className="w-9 h-9 flex items-center p-2 bg-white-light/40 dark:bg-dark/40 hover:text-white hover:bg-primary dark:hover:bg-primary rounded"
                                    onClick={() => dispatch(toggleTheme('system'))}
                                >
                                    <IconMoon />
                                </button>
                            )}

                            {themeConfig.theme === 'system' && (
                                <button
                                    className="w-9 h-9 flex items-center p-2 bg-white-light/40 dark:bg-dark/40 hover:text-white hover:bg-primary dark:hover:bg-primary rounded"
                                    onClick={() => dispatch(toggleTheme('light'))}
                                >
                                    <IconLaptop />
                                </button>
                            )}
                        </div>

                        {/* Mobile Sidebar Toggle */}
                        <button
                            type="button"
                            className="collapse-icon lg:hidden w-9 h-9 flex-none dark:text-[#d0d2d6] hover:text-white ltr:ml-2 rtl:mr-2 p-2 bg-white-light/40 dark:bg-dark/40 hover:bg-primary dark:hover:bg-primary rounded"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconMenu className="w-5 h-5" />
                        </button>

                        {/* User Dropdown / Connexion */}
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
                                onClick={() => {/* dispatch(loginUser()) */}}
                            >
                                {t('Connexion')}
                            </button>
                        )}
                    </div>
                </div>

                {/* ==================== MENU ADMIN (Double Menu) ==================== */}
                {isAdmin && (
                    <div className="bg-white dark:bg-black border-t border-gray-200 dark:border-white-light/10">
                        <div className="px-5 py-3">
                            <ul className="horizontal-menu flex font-semibold text-black dark:text-white-dark gap-x-1 flex-wrap">
                                <li className="menu nav-item">
                                    <NavLink to="/analytics" className="nav-link px-4 py-2 hover:bg-gray-100 dark:hover:bg-white-light/10 rounded">
                                        Tableau de bord
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/gestionusers" className="nav-link px-4 py-2 hover:bg-gray-100 dark:hover:bg-white-light/10 rounded">
                                        Gestion utilisateurs
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {isCollab && (
                    <div className="bg-white dark:bg-black border-t border-gray-200 dark:border-white-light/10">
                        <div className="px-5 py-3">
                            <ul className="horizontal-menu flex font-semibold text-black dark:text-white-dark gap-x-1 flex-wrap">
                                <li className="menu nav-item">
                                    <NavLink to="/portfolio-builder" className="nav-link px-4 py-2 hover:bg-gray-100 dark:hover:bg-white-light/10 rounded">
                                        Portfolio
                                    </NavLink>
                                </li>
                                <li className="menu nav-item">
                                    <NavLink to="/mon-portfolio" className="nav-link px-4 py-2 hover:bg-gray-100 dark:hover:bg-white-light/10 rounded">
                                        Mon portfolio
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;