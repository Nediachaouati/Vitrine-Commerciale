// pages/PortfolioBuilder/index.tsx
import { useEffect, useRef } from 'react';
import { useRedux } from '../../../../hooks';
import { GetMe } from '../../../../Redux/collaborator/actions';
import { LoadMyPortfolios, SelectPortfolio, ClearConversation } from '../../../../Redux/portfolio/actions';
import ChatPanel from './ChatPanel';
import PortfolioSelector from './PortfolioSelector';
import PortfolioDetail from './PortfolioDetail';

const PortfolioBuilder = () => {
  const { dispatch, appSelector } = useRedux();
  // useRef au lieu de useState pour éviter tout re-render lié à initialized
  const hasFetched = useRef(false);

  const collab = appSelector((state: any) => state.Collaborator?.collab ?? null);
  const collabLoading = appSelector((state: any) => state.Collaborator?.loading ?? false);

  const portfolios = appSelector((state: any) => state.Portfolio?.portfolios ?? []);
  const selectedPortfolioId = appSelector((state: any) => state.Portfolio?.selectedPortfolioId ?? null);
  const portLoading = appSelector((state: any) => state.Portfolio?.loading ?? false);

  // Un seul dispatch au montage — useRef garantit qu'il ne se redéclenche jamais
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    dispatch(ClearConversation());
    dispatch(GetMe());
    dispatch(LoadMyPortfolios());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Chargement initial (seulement si on n'a encore rien)
  const isInitialLoad = (collabLoading || portLoading) && collab === null && portfolios.length === 0;

  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-60px)]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-danger border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!collab) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)] text-center px-8">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold dark:text-white mb-2">Profil collaborateur introuvable</h3>
        <p className="text-sm text-gray-400">Complète d'abord ton profil avant d'accéder au portfolio.</p>
      </div>
    );
  }

  const selectedPortfolio = portfolios.find((p: any) => p.portfolioId === selectedPortfolioId) ?? null;

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden">
      {/* Panneau gauche : Chat IA */}
      <div className="w-[40%] flex flex-col border-r border-white-light dark:border-[#1b2e4b]">
        <ChatPanel
          collab={collab}
          portfolios={portfolios}
          selectedPortfolioId={selectedPortfolioId}
        />
      </div>

      {/* Panneau droite : Sélecteur + détail */}
      <div className="w-[60%] flex flex-col overflow-y-auto">
        <PortfolioSelector
          collab={collab}
          portfolios={portfolios}
          selectedPortfolioId={selectedPortfolioId}
          onSelect={(id) => dispatch(SelectPortfolio(id))}
        />

        {selectedPortfolio ? (
          <PortfolioDetail collab={collab} portfolio={selectedPortfolio} />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-8 py-16">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-sm text-gray-400">
              {portfolios.length === 0
                ? "Aucun portfolio. Crée-en un avec le bouton ci-dessus."
                : "Sélectionne un portfolio pour voir son contenu."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioBuilder;