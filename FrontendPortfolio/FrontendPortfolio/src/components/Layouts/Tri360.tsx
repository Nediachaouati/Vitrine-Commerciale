import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAnimation, toggleLayout, toggleMenu, toggleNavbar, toggleRTL, toggleTheme, toggleSemidark } from '../../store/themeConfigSlice';
import IconSettings from '../Icon/IconSettings';
import IconX from '../Icon/IconX';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import { IRootState } from '../../Redux/store';
import { IconTools, IconToolsOff } from '@tabler/icons-react';

const Tri360 = () => {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const dispatch = useDispatch();

  const [showCustomizer, setShowCustomizer] = useState(false);

  return (
    <div>
      <div className={`${(showCustomizer && '!block') || ''} fixed inset-0 bg-[black]/60 z-[51] px-4 hidden transition-[display]`} onClick={() => setShowCustomizer(false)}></div>

      <nav
        className={`${
          (showCustomizer && 'ltr:!right-0 rtl:!left-0') || ''
        } bg-white fixed ltr:-right-[400px] rtl:-left-[400px] top-0 bottom-0 w-full max-w-[400px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 z-[51] dark:bg-black p-4`}
      >
        <button
          type="button"
          className="
    group bg-danger text-white cursor-pointer
    ltr:rounded-tl-full rtl:rounded-tr-full ltr:rounded-bl-full rtl:rounded-br-full
    absolute ltr:-left-12 rtl:-right-12 top-20 -bottom-10 my-auto
    h-10 w-12
    flex items-center justify-center
    shadow-lg overflow-hidden absolute

    transition-[width,transform] duration-300 ease-out
    hover:w-40
    ltr:hover:translate-x-[-7rem]
    rtl:hover:translate-x-[7rem]
  "
          onClick={() => setShowCustomizer(!showCustomizer)}
        >
          {/* TRI initial */}
          <span
            className="
      relative   text-[10px] font-semibold tracking-wider select-none
      transition-opacity duration-150
      group-hover:opacity-0
    "
          >
            TRI
          </span>

          {/* Texte complet caché au départ, visible au hover */}
          <span
            className="
      absolute inset-0   flex items-center justify-center
      text-[10px] font-semibold tracking-wider whitespace-nowrap select-none
      opacity-0 group-hover:opacity-100
      translate-x-full group-hover:translate-x-0
      transition-[transform,opacity] duration-500 ease-out
      pointer-events-none
    "
          >
            TRI 360 TOOLS
          </span>
        </button>

        <div className="overflow-y-auto overflow-x-hidden perfect-scrollbar h-full">
          <div className="text-center relative pb-5">
            <button type="button" className="absolute top-0 ltr:right-0 rtl:left-0 opacity-30 hover:opacity-100 dark:text-white" onClick={() => setShowCustomizer(false)}>
              <IconX className="w-5 h-5" />
            </button>
            <h4 className="mb-1 dark:text-white">TRI 360</h4>
            <p className="text-white-dark">Accédez à tous vos outils TRI 360 avec une seule connexion.</p>
          </div>
          <div className="group border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3 cursor-pointer transition-colors duration-200 hover:border-red-500">
            <h5 className="mb-1 text-base dark:text-white leading-none transition-colors duration-200 group-hover:text-red-500">PRODUCTION</h5>
            {/* <div className="grid grid-cols-3 gap-2 mt-3"></div> */}
          </div>

          <div className="group border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3 cursor-pointer transition-colors duration-200 hover:border-red-500">
            <h5 className="mb-1 text-base dark:text-white leading-none transition-colors duration-200 group-hover:text-red-500">VORTEX</h5>
            {/* <div className="grid grid-cols-3 gap-2 mt-3"></div> */}
          </div>

          <div className="group border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3 cursor-pointer transition-colors duration-200 hover:border-red-500">
            <h5 className="mb-1 text-base dark:text-white leading-none transition-colors duration-200 group-hover:text-red-500">SAVIX LINC</h5>
            {/* <div className="grid grid-cols-3 gap-2 mt-3"></div> */}
          </div>

          <div className="group border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3 cursor-pointer transition-colors duration-200 hover:border-red-500">
            <h5 className="mb-1 text-base dark:text-white leading-none transition-colors duration-200 group-hover:text-red-500">SAVIX LINC</h5>
            {/* <div className="grid grid-cols-3 gap-2 mt-3"></div> */}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Tri360;
