// pages/PortfolioBuilder/PortfolioSelector.tsx
import { useState } from 'react';
import { useRedux } from '../../../../hooks';
import { CreatePortfolio, DeletePortfolio } from '../../../../Redux/portfolio/actions';
import type { CollaboratorFull, PortfolioItem } from '../../../../helpers/model/dto/collaborator.dto';

interface Props {
  collab: CollaboratorFull;
  portfolios: PortfolioItem[];
  selectedPortfolioId: number | null;
  onSelect: (id: number) => void;
}

const PortfolioSelector = ({ collab, portfolios, selectedPortfolioId, onSelect }: Props) => {
  const { dispatch } = useRedux();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', targetClient: '', theme: 'dark', language: 'fr' });

  const handleCreate = () => {
    if (!form.title.trim()) return;
    dispatch(CreatePortfolio({ ...form }));
    setShowCreate(false);
    setForm({ title: '', description: '', targetClient: '', theme: 'dark', language: 'fr' });
  };

  return (
    <div className="px-5 py-4 border-b border-white-light dark:border-[#1b2e4b] bg-white dark:bg-black shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold dark:text-white text-sm">
          Mes Portfolios ({portfolios.length})
        </h3>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="btn btn-danger btn-sm text-xs"
        >
          + Nouveau portfolio
        </button>
      </div>

      {/* Formulaire création */}
      {showCreate && (
        <div className="mb-4 p-4 rounded-xl border border-white-light dark:border-[#1b2e4b] bg-white-light/50 dark:bg-[#1b2e4b]/30 space-y-3">
          <input
            className="form-input text-sm w-full"
            placeholder="Titre du portfolio *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="form-input text-sm w-full"
            placeholder="Client ciblé (ex: Accenture)"
            value={form.targetClient}
            onChange={(e) => setForm({ ...form, targetClient: e.target.value })}
          />
          <textarea
            className="form-textarea text-sm w-full"
            placeholder="Description (optionnel)"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowCreate(false)} className="btn btn-outline-danger btn-sm text-xs">
              Annuler
            </button>
            <button onClick={handleCreate} disabled={!form.title.trim()} className="btn btn-danger btn-sm text-xs">
              Créer
            </button>
          </div>
        </div>
      )}

      {/* Liste portfolios */}
      <div className="flex gap-2 flex-wrap">
        {portfolios.map((p) => (
          <div
            key={p.portfolioId}
            onClick={() => onSelect(p.portfolioId)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm ${
              selectedPortfolioId === p.portfolioId
                ? 'border-danger bg-danger/10 text-danger font-semibold'
                : 'border-white-light dark:border-[#1b2e4b] hover:border-danger/50 dark:text-white'
            }`}
          >
            <span>{p.title}</span>
            {p.targetClient && (
              <span className="text-xs text-gray-400">• {p.targetClient}</span>
            )}
            {p.isActive && (
              <span className="w-2 h-2 rounded-full bg-success shrink-0" title="Actif" />
            )}
            <button
              onClick={(e) => { e.stopPropagation(); dispatch(DeletePortfolio(p.portfolioId)); }}
              className="text-gray-300 hover:text-danger transition ml-1 text-xs"
              title="Supprimer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioSelector;