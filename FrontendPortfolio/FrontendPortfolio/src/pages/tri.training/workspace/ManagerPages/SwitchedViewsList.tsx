import { useEffect, useState } from 'react';
import type { SwitchedViewSummaryDto, BatchSwitchResultItemDto } from '../../../../helpers/model/dto/manager.dto';

const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

const ScoreBadge = ({ score }: { score?: number }) => {
    if (score == null) return null;
    const color = score >= 75 ? 'bg-success/10 text-success border-success/20' : score >= 50 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-danger/10 text-danger border-danger/20';
    return <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold shrink-0 ${color}`}>{Math.round(score)}%</span>;
};

const CopyLinkButton = ({ slug }: { slug: string }) => {
    const [copied, setCopied] = useState(false);
    const url = `${window.location.origin}/portfolio/view/${slug}`;
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button
            onClick={handleCopy}
            className={`text-[10px] px-2 py-1 border rounded-lg transition-all ${copied ? 'border-success/40 bg-success/10 text-success' : 'border-primary/30 text-primary hover:bg-primary/10'}`}
            title="Copier le lien client"
        >
            {copied ? '✓ Copié' : 'Copier le lien'}
        </button>
    );
};

// ── Carte résultat batch ─────────────────────────────────────────────
const ResultCard = ({
    item,
    index,
    isChecked,
    onCheck,
}: {
    item: BatchSwitchResultItemDto;
    index: number;
    isChecked?: boolean;
    onCheck?: (item: BatchSwitchResultItemDto) => void;
}) => {
    const [expanded, setExpanded] = useState(false);
    const initials = item.collaboratorName.split(' ').map((n) => n[0]).join('').slice(0, 2);

    if (item.status === 'error') {
        return (
            <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="bg-danger/5 border border-danger/20 rounded-2xl rounded-tl-sm px-4 py-3 text-sm flex-1 max-w-sm">
                    <p className="font-medium text-danger">{item.collaboratorName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Erreur lors du switch.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-start gap-3" style={{ animationDelay: `${index * 80}ms` }}>
            {/* Checkbox */}
            {onCheck && (
                <div
                    onClick={(e) => { e.stopPropagation(); onCheck(item); }}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all mt-1 ${
                        isChecked ? 'border-danger bg-danger text-white' : 'border-gray-300 dark:border-gray-600 hover:border-danger'
                    }`}
                >
                    {isChecked && (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            )}

            <div className="w-7 h-7 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <div className="flex-1 max-w-lg">
                <p className="text-xs font-semibold text-danger mb-1">Résultat · {item.collaboratorName}</p>
                <div
                    className="bg-white-light dark:bg-[#1b2e4b] rounded-2xl rounded-tl-sm px-4 py-3 cursor-pointer hover:bg-white dark:hover:bg-[#0e1726] transition-colors"
                    onClick={() => setExpanded(!expanded)}
                >
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-danger/10 flex items-center justify-center text-[10px] font-bold text-danger uppercase shrink-0">{initials}</div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold dark:text-white truncate">{item.collaboratorName}</p>
                                <p className="text-[11px] text-gray-400 truncate">
                                    <span className="line-through">{item.originalJobTitle}</span>
                                    {' → '}
                                    <span className="text-danger font-medium">{item.generatedTitle}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <ScoreBadge score={item.relevanceScore} />
                            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {expanded && (
                        <div className="mt-3 pt-3 border-t border-white-light dark:border-[#0e1726] space-y-3">
                            {item.publicShareSlug && (
                                <div className="p-3 bg-success/5 border border-success/20 rounded-xl">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Lien à envoyer au client</p>
                                    <p className="text-xs font-mono text-success break-all mb-1.5">
                                        {window.location.origin}/portfolio/view/{item.publicShareSlug}
                                    </p>
                                    <div className="flex gap-2">
                                        <a href={`/portfolio/view/${item.publicShareSlug}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[10px] text-success hover:underline px-2 py-1 border border-success/30 rounded-lg">
                                            Ouvrir ↗
                                        </a>
                                        <CopyLinkButton slug={item.publicShareSlug} />
                                    </div>
                                </div>
                            )}
                            {item.generatedBio && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Bio switchée</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.generatedBio}</p>
                                </div>
                            )}
                            {item.transferableSkills?.length > 0 && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Compétences transférables</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.transferableSkills.map((s) => (
                                            <span key={s} className="px-2.5 py-0.5 bg-success/10 text-success text-[10px] rounded-full border border-success/20">✓ {s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Carte vue sauvegardée ────────────────────────────────────────────
const SavedViewCard = ({
    view,
    onDelete,
    isChecked,
    onCheck,
}: {
    view: SwitchedViewSummaryDto;
    onDelete: (viewId: number) => void;
    isChecked?: boolean;
    onCheck?: (view: SwitchedViewSummaryDto) => void;
}) => {
    const [expanded, setExpanded] = useState(false);
    const [confirmDel, setConfirmDel] = useState(false);
    const initials = view.collaboratorName.split(' ').map((n) => n[0]).join('').slice(0, 2);

    return (
        <div className="flex items-start gap-3">
            {/* Checkbox */}
            {onCheck && (
                <div
                    onClick={(e) => { e.stopPropagation(); onCheck(view); }}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all mt-1 ${
                        isChecked ? 'border-danger bg-danger text-white' : 'border-gray-300 dark:border-gray-600 hover:border-danger'
                    }`}
                >
                    {isChecked && (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            )}

            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <div className="flex-1 max-w-lg">
                <p className="text-xs font-semibold text-primary mb-1">Sauvegardé · {fmtDate(view.updatedAt)}</p>
                <div
                    className="bg-white-light dark:bg-[#1b2e4b] rounded-2xl rounded-tl-sm px-4 py-3 cursor-pointer hover:bg-white dark:hover:bg-[#0e1726] transition-colors"
                    onClick={() => setExpanded(!expanded)}
                >
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary uppercase shrink-0">{initials}</div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <p className="text-sm font-semibold dark:text-white">{view.collaboratorName}</p>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{view.targetTech}</span>
                                </div>
                                <p className="text-[11px] text-gray-400 truncate mt-0.5">{view.generatedTitle || view.originalTitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <ScoreBadge score={view.relevanceScore} />
                            {!confirmDel ? (
                                <button onClick={() => setConfirmDel(true)} className="text-gray-400 hover:text-danger transition-colors p-1 rounded" title="Supprimer">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <button onClick={() => onDelete(view.viewId)} className="text-[10px] px-2 py-1 bg-danger text-white rounded-lg">Confirmer</button>
                                    <button onClick={() => setConfirmDel(false)} className="text-[10px] px-2 py-1 border border-white-light dark:border-[#1b2e4b] rounded-lg text-gray-400">Annuler</button>
                                </div>
                            )}
                            <svg
                                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                onClick={() => setExpanded(!expanded)}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {expanded && (
                        <div className="mt-3 pt-3 border-t border-white-light dark:border-[#0e1726] space-y-3">
                            {view.publicShareSlug && (
                                <div className="p-3 bg-success/5 border border-success/20 rounded-xl">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Lien à envoyer au client</p>
                                    <p className="text-xs font-mono text-success break-all mb-1.5">
                                        {window.location.origin}/portfolio/view/{view.publicShareSlug}
                                    </p>
                                    <div className="flex gap-2">
                                        <a href={`/portfolio/view/${view.publicShareSlug}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[10px] text-success hover:underline px-2 py-1 border border-success/30 rounded-lg">
                                            Voir ↗
                                        </a>
                                        <CopyLinkButton slug={view.publicShareSlug} />
                                        {view.publicSlug && (
                                            <a href={`/portfolio/public/${view.publicSlug}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[10px] text-primary hover:underline px-2 py-1 border border-primary/30 rounded-lg">
                                                Original ↗
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Titre switché</p>
                                <p className="text-sm font-semibold dark:text-white">{view.generatedTitle}</p>
                                <p className="text-xs text-gray-400 line-through">{view.originalTitle}</p>
                            </div>
                            {view.generatedBio && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Bio switchée</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{view.generatedBio}</p>
                                </div>
                            )}
                            {view.transferableSkills?.length > 0 && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Compétences transférables</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {view.transferableSkills.map((s) => (
                                            <span key={s} className="px-2.5 py-0.5 bg-success/10 text-success text-[10px] rounded-full border border-success/20">✓ {s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Main ─────────────────────────────────────────────────────────────
interface Props {
    batchResults: BatchSwitchResultItemDto[] | null;
    savedViews: SwitchedViewSummaryDto[];
    savedLoading: boolean;
    onDelete: (viewId: number) => void;
    onLoadViews: (tech?: string) => void;
    // ✅ Callback simplifié : pas de toast ici, c'est Switch.tsx qui gère l'ouverture du builder
    onCreateSelection?: (items: { portfolioId: number; collaboratorName: string; jobTitle?: string;switchedViewId?: number | null; }[]) => void;
}

const SwitchedViewsList = ({ batchResults, savedViews, savedLoading, onDelete, onLoadViews, onCreateSelection }: Props) => {
    const [activeTab, setActiveTab] = useState<'results' | 'saved'>('results');
    const [filterTech, setFilterTech] = useState('');
    const [checkedResults, setCheckedResults] = useState<BatchSwitchResultItemDto[]>([]);
    const [checkedViews, setCheckedViews] = useState<SwitchedViewSummaryDto[]>([]);

    useEffect(() => {
    if (batchResults && batchResults.length > 0) {
      setActiveTab('results');
    }
  }, [batchResults]);
    // ✅ Plus de selectionToast ici — le toast vient uniquement de ShortlistBuilder après création réelle

    const handleCheckResult = (item: BatchSwitchResultItemDto) => {
        setCheckedResults((prev) =>
            prev.find((r) => r.portfolioId === item.portfolioId)
                ? prev.filter((r) => r.portfolioId !== item.portfolioId)
                : [...prev, item]
        );
    };

    const handleCheckView = (view: SwitchedViewSummaryDto) => {
        setCheckedViews((prev) =>
            prev.find((v) => v.viewId === view.viewId)
                ? prev.filter((v) => v.viewId !== view.viewId)
                : [...prev, view]
        );
    };

    const totalChecked = activeTab === 'results' ? checkedResults.length : checkedViews.length;

    const handleSendToSelection = () => {
        if (!onCreateSelection) return;

        // ✅ On transmet juste les items au parent — c'est lui qui ouvre le builder
        // Pas de toast ici : le toast vient de ShortlistBuilder après la vraie création
        if (activeTab === 'results') {
            onCreateSelection(
                checkedResults.map((r) => ({
                    portfolioId: r.portfolioId,
                    collaboratorName: r.collaboratorName,
                    jobTitle: r.generatedTitle,
                    switchedViewId: r.switchedViewId ?? null,
                }))
            );
        } else {
            // ✅ SwitchedViewSummaryDto a portfolioId — on force le cast en number pour éviter
            // que JSON.stringify transmette une string et fasse crasher la validation backend
            onCreateSelection(
                checkedViews.map((v) => ({
                    portfolioId: Number(v.portfolioId),
                    collaboratorName: v.collaboratorName,
                    jobTitle: v.generatedTitle,
                    switchedViewId: v.viewId,
                }))
            );
        }

        // ✅ On reset les cases cochées après avoir transmis
        if (activeTab === 'results') {
            setCheckedResults([]);
        } else {
            setCheckedViews([]);
        }
    };

    const techsInSaved = [...new Set(savedViews.map((v) => v.targetTech))];

    const handleTechFilter = (tech: string) => {
        setFilterTech(tech);
        onLoadViews(tech || undefined);
    };

    const checkedList = activeTab === 'results' ? checkedResults : checkedViews;

    return (
        <div className="flex flex-col h-full relative" style={{ minHeight: '520px' }}>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white-light dark:bg-[#1b2e4b] rounded-xl w-fit mb-4">
                <button
                    onClick={() => setActiveTab('results')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeTab === 'results' ? 'bg-white dark:bg-[#0e1726] text-danger shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-danger'
                    }`}
                >
                    Résultats switch
                    {batchResults && <span className="ml-1.5 px-1.5 py-0.5 bg-danger text-white text-[10px] rounded-full">{batchResults.length}</span>}
                </button>
                <button
                    onClick={() => { setActiveTab('saved'); onLoadViews(); }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeTab === 'saved' ? 'bg-white dark:bg-[#0e1726] text-danger shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-danger'
                    }`}
                >
                    Historique
                    {savedViews.length > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-primary text-white text-[10px] rounded-full">{savedViews.length}</span>}
                </button>
            </div>

            {/* ── Tab Résultats ── */}
            {activeTab === 'results' && (
                <div className="flex-1 overflow-y-auto pb-20">
                    {!batchResults ? (
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                            <div className="w-12 h-12 rounded-full bg-white-light dark:bg-[#1b2e4b] flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-400">Lancez un switch</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="bg-white-light dark:bg-[#1b2e4b] rounded-2xl rounded-tl-sm px-4 py-3 text-sm dark:text-white max-w-sm">
                                    Switch terminé.{' '}
                                    <span className="text-success font-semibold">{batchResults.filter((r) => r.status === 'success').length} profil(s)</span>{' '}
                                    ont été repositionnés avec succès. Cochez les profils pour créer une sélection.
                                </div>
                            </div>

                            {batchResults.map((item, i) => (
                                <ResultCard
                                    key={`result-${item.portfolioId}-${i}`}
                                    item={item}
                                    index={i}
                                    isChecked={checkedResults.some((r) => r.portfolioId === item.portfolioId)}
                                    onCheck={handleCheckResult}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Tab Historique ── */}
            {activeTab === 'saved' && (
                <div className="flex-1 overflow-y-auto pb-20">
                    {techsInSaved.length > 1 && (
                        <div className="flex gap-2 flex-wrap mb-4">
                            <button
                                onClick={() => handleTechFilter('')}
                                className={`px-3 py-1 rounded-full text-xs border transition-all ${
                                    filterTech === '' ? 'border-danger bg-danger/10 text-danger' : 'border-white-light dark:border-[#1b2e4b] text-gray-500 hover:border-danger/40'
                                }`}
                            >
                                Tous
                            </button>
                            {techsInSaved.map((tech) => (
                                <button
                                    key={tech}
                                    onClick={() => handleTechFilter(tech)}
                                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                                        filterTech === tech ? 'border-danger bg-danger/10 text-danger' : 'border-white-light dark:border-[#1b2e4b] text-gray-500 hover:border-danger/40'
                                    }`}
                                >
                                    {tech}
                                </button>
                            ))}
                        </div>
                    )}

                    {savedLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-7 h-7 border-2 border-danger border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-xs text-gray-400">Chargement de l'historique…</p>
                        </div>
                    ) : savedViews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-12 h-12 rounded-full bg-white-light dark:bg-[#1b2e4b] flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-400">Aucune vue sauvegardée</p>
                            <p className="text-xs text-gray-400 mt-1">Lancez un switch pour créer des vues.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {savedViews.map((view) => (
                                <SavedViewCard
                                    key={view.viewId}
                                    view={view}
                                    onDelete={onDelete}
                                    isChecked={checkedViews.some((v) => v.viewId === view.viewId)}
                                    onCheck={handleCheckView}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Barre flottante sélection ── */}
            {totalChecked > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-white dark:bg-[#0e1726] border border-danger/30 rounded-2xl shadow-xl px-5 py-3 whitespace-nowrap">
                    <div className="flex -space-x-2">
                        {checkedList.slice(0, 4).map((item, i) => {
                            const name = item.collaboratorName;
                            const ini = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                            const key = 'portfolioId' in item
                                ? `r-${(item as BatchSwitchResultItemDto).portfolioId}-${i}`
                                : `v-${(item as SwitchedViewSummaryDto).viewId}-${i}`;
                            return (
                                <div key={key} className="w-7 h-7 rounded-full bg-danger/20 border-2 border-white dark:border-[#0e1726] flex items-center justify-center text-[9px] text-danger font-bold">
                                    {ini}
                                </div>
                            );
                        })}
                        {totalChecked > 4 && (
                            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-[#0e1726] flex items-center justify-center text-[9px] text-gray-500 font-bold">
                                +{totalChecked - 4}
                            </div>
                        )}
                    </div>

                    <span className="text-sm font-semibold dark:text-white">
                        {totalChecked} profil{totalChecked > 1 ? 's' : ''} sélectionné{totalChecked > 1 ? 's' : ''}
                    </span>

                    <button
                        onClick={handleSendToSelection}
                        className="flex items-center gap-1.5 px-4 py-2 bg-danger text-white rounded-xl text-sm font-bold hover:bg-danger/90 transition shadow-sm"
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                        Créer une sélection
                    </button>

                    <button
                        onClick={() => activeTab === 'results' ? setCheckedResults([]) : setCheckedViews([])}
                        className="text-gray-400 hover:text-danger transition text-xs font-medium"
                    >
                        Annuler
                    </button>
                </div>
            )}
        </div>
    );
};

export default SwitchedViewsList;