import { useEffect, useRef, useState } from 'react';
import { useRedux } from '../../../../hooks';
import { LoadMyNeeds, CreateNeed, RunMatch, LoadCriteria, LoadSuggestions, SelectCollab, SelectNeed, ClearMatch } from '../../../../Redux/manager/actions';
import type { CreateClientNeedDto, MatchedCollaboratorDto, PortfolioListItemDto } from '../../../../helpers/model/dto/manager.dto';
import NeedsForm from './NeedsForm';
import MatchResultCard from './MatchResultCard';
import ShortlistBuilder from './ManagerShortlistPage/ShortlistBuilder';

// ── Groupement par tier ───────────────────────────────────────────────────
type Tier = 'ideal' | 'risk' | 'backup';

const getTier = (score: number): Tier => {
    if (score >= 85) return 'ideal';
    if (score >= 60) return 'risk';
    return 'backup';
};

const TierIcon = ({ tier }: { tier: Tier }) => {
    if (tier === 'ideal')
        return (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <circle cx="7" cy="7" r="6.5" stroke="#10b981" strokeWidth="1.5" />
                <path d="M4 7l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    if (tier === 'risk')
        return (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M7 1.5L12.5 11.5H1.5L7 1.5Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7 5.5V8" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="9.5" r="0.75" fill="#f59e0b" />
            </svg>
        );
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="6.5" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

const TIER_LABELS: Record<Tier, string> = {
    ideal: 'Profil idéal',
    risk: 'Risque faible',
    backup: 'Profil de secours',
};

// ── Convertir MatchedCollaboratorDto → PortfolioListItemDto ───────────────
const toPortfolioItem = (r: MatchedCollaboratorDto): PortfolioListItemDto => ({
    portfolioId: r.portfolioId,
    publicSlug: r.publicSlug ?? '',          // undefined → ''
    title: '',
    description: undefined,
    theme: '',
    language: '',
    isActive: true,
    viewCount: 0,
    createdAt: '',
    collaborator: {
        collaboratorId: r.collaboratorId,
        firstName: r.firstName,
        lastName: r.lastName,
        jobTitle: r.jobTitle,
        avatarUrl: r.avatarUrl ?? undefined,  // null → undefined
        availabilityStatus: r.availabilityStatus ?? 'not_available',
        primarySkills: r.matchedSkills ?? [],
        yearsExperience: 0,
        badges: r.badges ?? [],
        bio: '',
        isPublic: true,
        portfolioCount: 0,
        viewCount: 0,
    },
});

const Matching = () => {
    const { dispatch, appSelector } = useRedux();
    const hasFetched = useRef(false);

    const needs         = appSelector((s: any) => s.Manager?.needs ?? []);
    const matchResults  = appSelector((s: any) => s.Manager?.matchResults ?? []);
    const criteria      = appSelector((s: any) => s.Manager?.criteria ?? null);
    const suggestions   = appSelector((s: any) => s.Manager?.suggestions ?? null);
    const selectedNeedId   = appSelector((s: any) => s.Manager?.selectedNeedId ?? null);
    const selectedCollabId = appSelector((s: any) => s.Manager?.selectedCollabId ?? null);
    const loading          = appSelector((s: any) => s.Manager?.loading ?? false);
    const matchLoading     = appSelector((s: any) => s.Manager?.matchLoading ?? false);
    const suggestionsLoading = appSelector((s: any) => s.Manager?.suggestionsLoading ?? false);
    const error            = appSelector((s: any) => s.Manager?.error ?? '');

    // ── Sélection pour shortlist ──────────────────────────────────────────
    const [checkedCollabs, setCheckedCollabs] = useState<MatchedCollaboratorDto[]>([]);
    const [showBuilder, setShowBuilder]       = useState(false);

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
        setCheckedCollabs([]); // reset sélection
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

    const handleCheck = (result: MatchedCollaboratorDto) => {
        setCheckedCollabs((prev) =>
            prev.find((r) => r.collaboratorId === result.collaboratorId)
                ? prev.filter((r) => r.collaboratorId !== result.collaboratorId)
                : [...prev, result]
        );
    };

    // ── Groupement ────────────────────────────────────────────────────────
    const COLLAPSE_THRESHOLD = 45;
    const collapsedCount = matchResults.filter((r: any) => r.matchScore < COLLAPSE_THRESHOLD).length;
    const visibleResults = matchResults.filter((r: any) => r.matchScore >= COLLAPSE_THRESHOLD);

    const visibleGrouped: Record<Tier, any[]> = { ideal: [], risk: [], backup: [] };
    visibleResults.forEach((r: any) => {
        visibleGrouped[getTier(r.matchScore)].push(r);
    });

    const orderedTiers: Tier[] = ['ideal', 'risk', 'backup'];

    return (
        <div className="flex h-[calc(100vh-60px)] overflow-hidden">
            {/* ── Left panel ───────────────────────────────────────────── */}
            <div className="w-[380px] shrink-0 flex flex-col border-r border-gray-100 dark:border-[#1b2e4b] overflow-y-auto">
                <div className="p-4">
                    <NeedsForm onSubmit={handleCreate} loading={loading} />
                </div>

                {needs.length > 0 && (
                    <div className="px-4 pb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Besoins enregistrés</p>
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
                                            className="ml-2 shrink-0 text-xs px-2 py-1 border border-red-400 text-red-500 bg-transparent rounded-md hover:bg-red-500 hover:text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* ── Right panel ──────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4 relative">
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
                        <p className="font-semibold dark:text-white">Aucun résultat</p>
                        <p className="text-sm mt-1">Créez un besoin client ou sélectionnez un besoin existant pour lancer le matching</p>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-3xl">
                        {/* Header résultats */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold dark:text-white">
                                    {matchResults.length} Profil{matchResults.length !== 1 ? 's' : ''} Analysés
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">IA — Classés par pertinence · Cochez pour créer une shortlist</p>
                            </div>
                            <button onClick={() => dispatch(ClearMatch())} className="text-xs text-gray-400 hover:text-red-500 transition">
                                Effacer
                            </button>
                        </div>

                        {/* Groupes par tier */}
                        {orderedTiers.map((tier) => {
                            const group = visibleGrouped[tier];
                            if (group.length === 0) return null;
                            return (
                                <div key={tier}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <TierIcon tier={tier} />
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{TIER_LABELS[tier]}</span>
                                        </div>
                                        <div className="flex-1 h-px bg-gray-100 dark:bg-[#1b2e4b]" />
                                        <span className="text-[10px] text-gray-400">{group.length}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {group.map((r: any) => (
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
                                                isChecked={checkedCollabs.some((c) => c.collaboratorId === r.collaboratorId)}
                                                onCheck={handleCheck}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Profils sous seuil */}
                        {collapsedCount > 0 && (
                            <button className="w-full text-xs text-gray-400 dark:text-gray-500 py-2 border border-dashed border-gray-200 dark:border-[#1b2e4b] rounded-lg hover:text-gray-600 transition">
                                {collapsedCount} autre{collapsedCount !== 1 ? 's' : ''} profil{collapsedCount !== 1 ? 's' : ''} — score &lt; {COLLAPSE_THRESHOLD}%
                            </button>
                        )}

                        {/* Espace en bas pour la barre flottante */}
                        {checkedCollabs.length > 0 && <div className="h-20" />}
                    </div>
                )}

                {/* ── Barre flottante de sélection ─────────────────────── */}
                {checkedCollabs.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-white dark:bg-[#0e1726] border border-primary/30 rounded-2xl shadow-xl px-5 py-3">
                        {/* Avatars empilés */}
                        <div className="flex -space-x-2">
                            {checkedCollabs.slice(0, 4).map((r) => {
                                const initials = `${r.firstName.charAt(0)}${r.lastName.charAt(0)}`.toUpperCase();
                                return (
                                    <div
                                        key={r.collaboratorId}
                                        className="w-7 h-7 rounded-full bg-primary/20 border-2 border-white dark:border-[#0e1726] flex items-center justify-center text-[9px] text-primary font-bold overflow-hidden"
                                    >
                                        {r.avatarUrl
                                            ? <img src={r.avatarUrl} className="w-full h-full object-cover" alt="" />
                                            : initials
                                        }
                                    </div>
                                );
                            })}
                            {checkedCollabs.length > 4 && (
                                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-[#0e1726] flex items-center justify-center text-[9px] text-gray-500 font-bold">
                                    +{checkedCollabs.length - 4}
                                </div>
                            )}
                        </div>

                        <span className="text-sm font-semibold dark:text-white">
                            {checkedCollabs.length} profil{checkedCollabs.length > 1 ? 's' : ''} sélectionné{checkedCollabs.length > 1 ? 's' : ''}
                        </span>

                        <button
                            onClick={() => setShowBuilder(true)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition shadow-sm"
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                            </svg>
                            Créer la Sélection
                        </button>

                        <button
                            onClick={() => setCheckedCollabs([])}
                            className="text-gray-400 hover:text-red-500 transition text-xs font-medium"
                        >
                            Annuler
                        </button>
                    </div>
                )}
            </div>

            {/* ── ShortlistBuilder Modal ────────────────────────────────── */}
            {showBuilder && (
                <ShortlistBuilder
                    onClose={() => {
                        setShowBuilder(false);
                        setCheckedCollabs([]);
                    }}
                    preselected={checkedCollabs.map(toPortfolioItem)}
                    startAtStep={2}
                />
            )}
        </div>
    );
};

export default Matching;