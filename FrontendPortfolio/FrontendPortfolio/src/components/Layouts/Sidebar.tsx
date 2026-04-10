import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import { IRootState } from '../../Redux/store';
import { RoleEnum } from '../../helpers/model/enum/role.enum';

const Sidebar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);

    const { userConnected } = useSelector((state: IRootState) => ({
        userConnected: state.Auth.user,
    }));

    const isAdmin = userConnected?.roles?.includes(RoleEnum.ADMIN) ?? false;

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
    };

    useEffect(() => {
        if (location.pathname.startsWith('/gestionusers')) {
            setCurrentMenu('gestion_users');
        }
    }, [location.pathname]);

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => { ele.click(); });
                }
            }
        }
    }, []);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
                <div className="bg-white dark:bg-black h-full">

                    {/* Logo */}
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-40 ml-[15px] mt-[-10px] flex-none" src="/assets/images/logo-tricareer.png" alt="logo" />
                        </NavLink>
                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>

                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        {/* Menu mobile public */}
                        <div className="lg:hidden border-t border-white-light dark:border-white-light/10 py-1"></div>
                        <ul className="lg:hidden relative font-semibold space-y-0.5 p-4 py-0">
                            <li className="nav-item">
                                <NavLink to="/home" className="group">
                                    <div className="flex items-center">
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Accueil')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/contactus" className="group">
                                    <div className="flex items-center">
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Contact Us')}</span>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>

                        {/* Menu connecté */}
                        {userConnected && (
                            <>
                                <div className="border-t border-white-light dark:border-white-light/10 py-1"></div>
                                <ul className="relative font-semibold space-y-0.5 p-4 py-0">

                                    <li className="nav-item">
                                        <NavLink to="/analytics" className="group">
                                            <div className="flex items-center">
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('dashboard')}</span>
                                            </div>
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink to="/gestionformations" className="group">
                                            <div className="flex items-center">
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Gestion Formations')}</span>
                                            </div>
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink to="/gestioncours" className="group">
                                            <div className="flex items-center">
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Gestion Cours')}</span>
                                            </div>
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink to="/my-learning" className="group">
                                            <div className="flex items-center">
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('My learning')}</span>
                                            </div>
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink to="/gestionsessions" className="group">
                                            <div className="flex items-center">
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Mes Formations')}</span>
                                            </div>
                                        </NavLink>
                                    </li>

                                    {/* Gestion Certif */}
                                    <li className="menu nav-item">
                                        <button
                                            type="button"
                                            className={`${currentMenu === 'Gestion_certif' ? 'active' : ''} nav-link group w-full`}
                                            onClick={() => toggleMenu('Gestion_certif')}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center">
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Gestion certif')}</span>
                                                </div>
                                                <div className={currentMenu !== 'Gestion_certif' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                    <IconCaretDown />
                                                </div>
                                            </div>
                                        </button>
                                        <AnimateHeight duration={300} height={currentMenu === 'Gestion_certif' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li><NavLink to="/GestionResultat">{t('Gestion Resultat')}</NavLink></li>
                                                <li><NavLink to="/PrintCertif">{t('Print Certificate')}</NavLink></li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>

                                    {/* Configuration */}
                                    <li className="menu nav-item">
                                        <button
                                            type="button"
                                            className={`${currentMenu === 'Configuration' ? 'active' : ''} nav-link group w-full`}
                                            onClick={() => toggleMenu('Configuration')}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center">
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Configuration')}</span>
                                                </div>
                                                <div className={currentMenu !== 'Configuration' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                    <IconCaretDown />
                                                </div>
                                            </div>
                                        </button>
                                        <AnimateHeight duration={300} height={currentMenu === 'Configuration' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li><NavLink to="/gestioncategories">{t('Gestion Categories')}</NavLink></li>
                                                <li><NavLink to="/gestionlevels">{t('Gestion Levels')}</NavLink></li>
                                                <li><NavLink to="/gestionteams">{t('Gestion Teams')}</NavLink></li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>

                                    {/* ── Gestion Users (AFFICHÉ UNIQUEMENT SI ADMIN) ── */}
                                    {isAdmin && (
                                        <li className="menu nav-item">
                                            <button
                                                type="button"
                                                className={`${currentMenu === 'gestion_users' ? 'active' : ''} nav-link group w-full`}
                                                onClick={() => toggleMenu('gestion_users')}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 shrink-0 text-black dark:text-[#506690]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                            <circle cx="9" cy="7" r="4" />
                                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                                        </svg>
                                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                                                            {t('Gestion Users')}
                                                        </span>
                                                    </div>
                                                    <div className={currentMenu !== 'gestion_users' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                        <IconCaretDown />
                                                    </div>
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={currentMenu === 'gestion_users' ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    <li><NavLink to="/gestionusers/collaborateurs">{t('Collaborateurs')}</NavLink></li>
                                                    <li><NavLink to="/gestionusers/managers">{t('Managers')}</NavLink></li>
                                                </ul>
                                            </AnimateHeight>
                                        </li>
                                    )}

                                </ul>
                            </>
                        )}
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;