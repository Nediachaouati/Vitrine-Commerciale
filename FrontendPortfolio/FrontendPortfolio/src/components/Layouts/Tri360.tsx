import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconX from '../Icon/IconX';
import { useRedux } from '../../hooks';
import { RoleEnum } from '../../helpers/model/enum/role.enum';

const Tri360 = () => {
  const [showPanel, setShowPanel] = useState(false);
  const navigate = useNavigate();
  const { appSelector } = useRedux();

  const { userConnected } = appSelector((state: any) => ({
    userConnected: state.Auth.user ?? null,
  }));

  const isAdmin = userConnected?.roles?.includes(RoleEnum.ADMIN) ?? false;

  const goTo = (path: string) => {
    setShowPanel(false);
    navigate(path);
  };

  // Si ce n'est pas un admin → on n'affiche rien dans Tri360
  if (!isAdmin) {
    return null;   // ← Important : ne rien afficher pour Manager et Collaborateur
  }

  return (
    <div>
      {/* Overlay */}
      <div
        className={`${showPanel ? '!block' : ''} fixed inset-0 bg-black/60 z-[51] hidden`}
        onClick={() => setShowPanel(false)}
      />

      {/* Panneau */}
      <nav className={`bg-white dark:bg-black fixed ltr:-right-[400px] rtl:-left-[400px] top-0 bottom-0 w-full max-w-[400px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 z-[52] flex flex-col ${showPanel ? 'ltr:!right-0 rtl:!left-0' : ''}`}>

        {/* Bouton déclencheur ADMIN */}
        <button
          type="button"
          className="
            group bg-danger text-white cursor-pointer
            ltr:rounded-tl-full rtl:rounded-tr-full
            ltr:rounded-bl-full rtl:rounded-br-full
            absolute ltr:-left-12 rtl:-right-12 
            top-[92px]
            my-auto
            h-10 w-12 flex items-center justify-center
            shadow-lg overflow-hidden
            transition-all duration-300 ease-out
            hover:w-40 ltr:hover:translate-x-[-7rem] rtl:hover:translate-x-[7rem]
            z-[55]
            hover:shadow-xl
          "
          onClick={() => setShowPanel(!showPanel)}
        >
          <span className="text-[10px] font-semibold tracking-wider select-none transition-opacity duration-150 group-hover:opacity-0">
            ADMIN
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold tracking-wider whitespace-nowrap select-none opacity-0 group-hover:opacity-100 translate-x-full group-hover:translate-x-0 transition-all duration-500 ease-out pointer-events-none">
            Admin Tools
          </span>
        </button>

        {/* En-tête */}
        <div className="px-5 py-4 border-b border-white-light dark:border-[#1b2e4b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-danger flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-bold tracking-wide">TRI</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold dark:text-white leading-none">TRI 360 TOOLS</h4>
              <p className="text-xs text-white-dark mt-0.5">Accès rapide</p>
            </div>
          </div>
          <button onClick={() => setShowPanel(false)} className="opacity-30 hover:opacity-100 dark:text-white transition">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu : seulement visible pour Admin */}
        <div className="flex-1 p-5 flex flex-col gap-3">
          <button
            onClick={() => goTo('/gestionusers/collaborateurs')}
            className="w-full flex items-center gap-4 p-4 border border-white-light dark:border-[#1b2e4b] rounded-lg hover:border-danger hover:bg-danger/5 transition-all duration-200 group text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0 group-hover:bg-danger/20 transition">
              <svg className="w-5 h-5 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold dark:text-white group-hover:text-danger transition-colors">
                Gestion des Utilisateurs
              </p>
              <p className="text-xs text-white-dark mt-0.5">
                Collaborateurs &amp; Managers
              </p>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-danger group-hover:translate-x-0.5 transition-all shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white-light dark:border-[#1b2e4b] shrink-0">
          <p className="text-[11px] text-center text-white-dark">TRI 360 © {new Date().getFullYear()}</p>
        </div>
      </nav>
    </div>
  );
};

export default Tri360;