// pages/tri.training/workspace/Manager/Matching/index.tsx
import { useEffect, useRef } from 'react';
import { useRedux } from '../../../../hooks';
import {
  LoadMyNeeds,
  CreateNeed,
  RunMatch,
  MatchDirect,
  LoadCriteria,
  LoadSuggestions,
  SelectCollab,
  SelectNeed,
  ClearMatch,
} from '../../../../Redux/manager/actions';
import type { CreateClientNeedDto } from '../../../../helpers/model/dto/manager.dto';
import NeedsForm from './NeedsForm';
import MatchResultCard from './MatchResultCard';

const Matching = () => {
  const { dispatch, appSelector } = useRedux();
  const hasFetched = useRef(false);

  const needs        = appSelector((s: any) => s.Manager?.needs ?? []);
  const matchResults = appSelector((s: any) => s.Manager?.matchResults ?? []);
  const criteria     = appSelector((s: any) => s.Manager?.criteria ?? null);
  const suggestions  = appSelector((s: any) => s.Manager?.suggestions ?? null);
  const selectedNeedId   = appSelector((s: any) => s.Manager?.selectedNeedId ?? null);
  const selectedCollabId = appSelector((s: any) => s.Manager?.selectedCollabId ?? null);
  const loading      = appSelector((s: any) => s.Manager?.loading ?? false);
  const matchLoading = appSelector((s: any) => s.Manager?.matchLoading ?? false);
  const suggestionsLoading = appSelector((s: any) => s.Manager?.suggestionsLoading ?? false);
  const error        = appSelector((s: any) => s.Manager?.error ?? '');

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    dispatch(LoadMyNeeds());
  }, []); // eslint-disable-line

  const handleCreate = (dto: CreateClientNeedDto) => {
    dispatch(ClearMatch());
    dispatch(CreateNeed(dto));
  };

  const handleRunMatch = (needId: number) => {
    dispatch(SelectNeed(needId));
    dispatch(RunMatch(needId));
  };

  const handleLoadCriteria = (collaboratorId: number) => {
    if (!selectedNeedId) return;
    dispatch(SelectCollab(collaboratorId));
    dispatch(LoadCriteria(selectedNeedId, collaboratorId));
  };

  const handleLoadSuggestions = (collaboratorId: number) => {
    if (!selectedNeedId) return;
    dispatch(SelectCollab(collaboratorId));
    dispatch(LoadSuggestions(selectedNeedId, collaboratorId));
  };

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden">
      {/* Left panel: form + besoins */}
      <div className="w-[380px] shrink-0 flex flex-col border-r border-gray-100 dark:border-[#1b2e4b] overflow-y-auto">
        <div className="p-4">
          <NeedsForm onSubmit={handleCreate} loading={loading} />
        </div>

        {/* Liste des besoins existants */}
        {needs.length > 0 && (
          <div className="px-4 pb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Besoins enregistrés
            </p>
            <div className="space-y-2">
              {needs.map((n: any) => (
                <div
                  key={n.needId}
                  className={`group p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedNeedId === n.needId
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-100 dark:border-[#1b2e4b] hover:border-primary/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0" onClick={() => dispatch(SelectNeed(n.needId))}>
                      <p className="text-sm font-semibold dark:text-white truncate">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {n.requiredSkills?.slice(0, 3).join(', ')}
                        {n.requiredSkills?.length > 3 ? '...' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRunMatch(n.needId)}
                      disabled={matchLoading}
                      className="ml-2 shrink-0 text-xs px-2 py-1 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                      Matcher
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right panel: results */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {matchLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Calcul du matching en cours...</p>
          </div>
        ) : matchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
            <div className="text-5xl mb-4">🎯</div>
            <p className="font-semibold dark:text-white">Aucun résultat</p>
            <p className="text-sm mt-1">Créez un besoin client ou sélectionnez un besoin existant pour lancer le matching.</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold dark:text-white">
                {matchResults.length} résultat{matchResults.length !== 1 ? 's' : ''} — triés par score
              </h2>
              <button
                onClick={() => dispatch(ClearMatch())}
                className="text-xs text-gray-400 hover:text-red-500 transition"
              >
                Effacer
              </button>
            </div>

            {matchResults.map((r: any) => (
              <MatchResultCard
                key={r.collaboratorId}
                result={r}
                needId={selectedNeedId!}
                onLoadCriteria={handleLoadCriteria}
                onLoadSuggestions={handleLoadSuggestions}
                suggestionsLoading={suggestionsLoading}
                criteria={selectedCollabId === r.collaboratorId ? criteria : null}
                suggestions={selectedCollabId === r.collaboratorId ? suggestions : null}
                selectedCollabId={selectedCollabId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matching;