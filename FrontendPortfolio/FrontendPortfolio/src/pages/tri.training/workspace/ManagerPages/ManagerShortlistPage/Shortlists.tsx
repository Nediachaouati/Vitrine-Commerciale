import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../../../Redux/store';
import {
    LoadMyShortlists,
    LoadShortlist,
    CreateShortlist,
    DeleteShortlist,
    SendShortlist,
    RemoveShortlistItem,
    SetSelectedShortlist,
    ClearShortlistMsg,
    OpenBuilder,
    CloseBuilder,
} from '../../../../../Redux/shortlist/actions';
import type { ShortlistItemDto, ShortlistSummaryDto } from '../../../../../helpers/model/dto/Shortlist.dto';
import ShortlistBuilder from '../ManagerShortlistPage/ShortlistBuilder';
import SharePanel from '../ManagerShortlistPage/SharePanel';

// ── Status helpers ────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; cls: string }> = {
    draft: { label: 'Brouillon', cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300' },
    sent: { label: 'Envoyée', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    viewed: { label: 'Consultée', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    archived: { label: 'Archivée', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
};

const AVAIL_CFG: Record<string, { label: string; dot: string }> = {
    available: { label: 'Disponible', dot: 'bg-emerald-500' },
    soon_available: { label: 'Bientôt dispo', dot: 'bg-amber-500' },
    not_available: { label: 'Non disponible', dot: 'bg-red-500' },
};

// ── Icons ─────────────────────────────────────────────────────────
const PlusIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
);

const SendIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
            clipRule="evenodd"
        />
    </svg>
);

const EyeIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        <path
            fillRule="evenodd"
            d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z"
            clipRule="evenodd"
        />
    </svg>
);

const LinkIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
        <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
    </svg>
);

// ── Shortlist List Card ────────────────────────────────────────────
const ShortlistCard = ({ s, isSelected, onSelect, onDelete }: { s: ShortlistSummaryDto; isSelected: boolean; onSelect: () => void; onDelete: () => void }) => {
    const st = STATUS_CFG[s.status] ?? STATUS_CFG.draft;
    const expired = s.expiresAt && new Date(s.expiresAt) < new Date();

    return (
        <div
            onClick={onSelect}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                isSelected ? 'border-primary bg-primary/5 shadow shadow-primary/10' : 'border-gray-200 dark:border-[#1b2e4b] hover:border-primary/50 bg-white dark:bg-[#0e1726]'
            }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="font-semibold text-sm dark:text-white truncate">{s.title}</p>
                    {s.clientName && <p className="text-xs text-gray-400 truncate mt-0.5">{s.clientName}</p>}
                </div>
                <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold ${st.cls}`}>{st.label}</span>
            </div>
            <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {s.itemCount} profil{s.itemCount > 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-2">
                    {expired && <span className="text-[10px] text-red-500 font-medium">Expiré</span>}
                    {s.expiresAt && !expired && <span className="text-[10px] text-gray-400">Exp. {new Date(s.expiresAt).toLocaleDateString('fr-FR')}</span>}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Profile Card in detail view ───────────────────────────────────
const ProfileCard = ({ item, onRemove, onView }: { item: ShortlistItemDto; onRemove: () => void; onView: () => void }) => {
    const avail = AVAIL_CFG[item.availabilityStatus] ?? AVAIL_CFG.not_available;
    const initials = `${item.firstName.charAt(0)}${item.lastName.charAt(0)}`.toUpperCase();

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-[#1b2e4b] bg-white dark:bg-[#0e1726] hover:border-primary/30 transition-all group">
            {/* Avatar */}
            <div className="relative shrink-0">
                {item.avatarUrl ? (
                    <img src={item.avatarUrl} alt={initials} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{initials}</div>
                )}
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0e1726] ${avail.dot}`} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm dark:text-white truncate">
                    {item.firstName} {item.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">{item.jobTitle}</p>
                {item.relevanceScore != null && (
                    <div className="flex items-center gap-1 mt-1">
                        <div className="h-1 w-16 bg-gray-100 dark:bg-[#1b2e4b] rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${item.relevanceScore}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-400">{Math.round(item.relevanceScore)}%</span>
                    </div>
                )}
            </div>

            {/* Skills */}
            <div className="hidden md:flex flex-wrap gap-1 max-w-[140px]">
                {item.primarySkills.slice(0, 2).map((s) => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-[#1b2e4b] text-gray-600 dark:text-gray-300 rounded-full">
                        {s}
                    </span>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.publicSlug && (
                    <button onClick={onView} title="Voir portfolio" className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition">
                        <EyeIcon />
                    </button>
                )}
                <button onClick={onRemove} title="Retirer" className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────
const ShortlistsPage = () => {
    const dispatch = useDispatch();
    const { shortlists, currentShortlist, selectedId, builderOpen, loading, sendLoading, msg, error, shareUrl, shareToken } = useSelector((state: IRootState) => (state as any).Shortlist);

    const [shareOpen, setShareOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        dispatch(LoadMyShortlists());
    }, [dispatch]);

    useEffect(() => {
        if (selectedId) dispatch(LoadShortlist(selectedId));
    }, [selectedId, dispatch]);

    useEffect(() => {
        if (msg || error) {
            const t = setTimeout(() => dispatch(ClearShortlistMsg()), 3000);
            return () => clearTimeout(t);
        }
    }, [msg, error, dispatch]);

    const handleSelect = useCallback(
        (id: number) => {
            dispatch(SetSelectedShortlist(id));
        },
        [dispatch],
    );

    const handleSend = () => {
        if (!selectedId) return;
        setShareOpen(true); // ouvre le panel, qui gère l'envoi
    };

    const handleDelete = (id: number) => {
        dispatch(DeleteShortlist(id));
        setDeleteConfirm(null);
        if (selectedId === id) dispatch(SetSelectedShortlist(null));
    };

    const handleRemoveItem = (portfolioId: number) => {
        if (!selectedId) return;
        dispatch(RemoveShortlistItem(selectedId, portfolioId));
    };

    const statusCurrent = currentShortlist ? (STATUS_CFG[currentShortlist.status] ?? STATUS_CFG.draft) : null;

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-280px)] px-1 pt-5">
            {/* ── Toast ──────────────────────────────────────────────────── */}
            {(msg || error) && (
                <div
                    className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-[fadeIn_0.2s_ease] ${
                        error
                            ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300'
                    }`}
                >
                    {error || msg}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-5 flex-1">
                {/* ══════════════════════════════════════════════════════════
            LEFT — List of shortlists
        ══════════════════════════════════════════════════════════ */}
                <div className="md:w-72 shrink-0 flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold dark:text-white">Sélection</h2>
                            <p className="text-xs text-gray-400">
                                {shortlists.length} sélection{shortlists.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={() => dispatch(OpenBuilder())}
                            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition shadow-sm"
                        >
                            <PlusIcon />
                            
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                        {loading && shortlists.length === 0 && (
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-20 bg-gray-100 dark:bg-[#0e1726] rounded-xl animate-pulse" />
                                ))}
                            </div>
                        )}
                        {shortlists.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-400 text-sm">
                                <p>Aucune shortlist</p>
                                <p className="text-xs mt-1">Créez votre première shortlist</p>
                            </div>
                        )}
                        {shortlists.map((s: ShortlistSummaryDto) => (
                            <ShortlistCard
                                key={s.shortlistId}
                                s={s}
                                isSelected={selectedId === s.shortlistId}
                                onSelect={() => handleSelect(s.shortlistId)}
                                onDelete={() => setDeleteConfirm(s.shortlistId)}
                            />
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
            RIGHT — Shortlist detail
        ══════════════════════════════════════════════════════════ */}
                <div className="flex-1 min-w-0">
                    {!currentShortlist && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <p className="text-sm font-medium">Sélectionnez une sélection</p>
                            <p className="text-xs mt-1">ou créez-en une nouvelle</p>
                        </div>
                    )}

                    {loading && selectedId && (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {currentShortlist && !loading && (
                        <div className="flex flex-col gap-4 h-full">
                            {/* ── Detail header ──────────────────────────────── */}
                            <div className="bg-white dark:bg-[#0e1726] rounded-2xl border border-gray-200 dark:border-[#1b2e4b] p-5">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-xl font-bold dark:text-white">{currentShortlist.title}</h3>
                                            {statusCurrent && <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${statusCurrent.cls}`}>{statusCurrent.label}</span>}
                                        </div>
                                        {currentShortlist.description && <p className="text-sm text-gray-400 mt-1 max-w-lg">{currentShortlist.description}</p>}
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                                            {currentShortlist.clientName && (
                                                <span>
                                                    Client : <span className="text-gray-600 dark:text-gray-300 font-medium">{currentShortlist.clientName}</span>
                                                </span>
                                            )}
                                            <span>Créée le {new Date(currentShortlist.createdAt).toLocaleDateString('fr-FR')}</span>
                                            {currentShortlist.expiresAt && <span>Expire le {new Date(currentShortlist.expiresAt).toLocaleDateString('fr-FR')}</span>}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        
                                    
                                        <button
                                            onClick={() => setShareOpen(true)}
                                            disabled={sendLoading || currentShortlist.items.length === 0}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                                        >
                                            {sendLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SendIcon />}
                                            Envoyer au client
                                            <LinkIcon />
                                        </button>
                                    </div>
                                </div>

                                {/* Stats bar */}
                               
                            </div>

                            {/* ── Profiles list ──────────────────────────────── */}
                            <div className="bg-white dark:bg-[#0e1726] rounded-2xl border border-gray-200 dark:border-[#1b2e4b] p-5 flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-sm dark:text-white">Profils sélectionnés</h4>
                                    <span className="text-xs text-gray-400">
                                        {currentShortlist.items.length} candidat{currentShortlist.items.length > 1 ? 's' : ''}
                                    </span>
                                </div>

                                {currentShortlist.items.length === 0 && (
                                    <div className="text-center py-10 text-gray-400 text-sm">
                                        <p>Aucun profil dans cette sélection</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {currentShortlist.items.map((item: ShortlistItemDto) => (
                                        <ProfileCard
                                            key={item.itemId}
                                            item={item}
                                            onRemove={() => handleRemoveItem(item.portfolioId)}
                                            onView={() => {
            // ✅ Si vue switchée disponible → ouvre la vue switchée
            // Sinon → fallback sur le portfolio original
            if (item.publicShareSlug) {
                window.open(`/portfolio/view/${item.publicShareSlug}`, '_blank');
            } else if (item.publicSlug) {
                window.open(`/portfolio/public/${item.publicSlug}`, '_blank');
            }
        }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ══ Builder Modal ══════════════════════════════════════════ */}
            {builderOpen && <ShortlistBuilder onClose={() => dispatch(CloseBuilder())} />}

            {/* ══ Share Panel ════════════════════════════════════════════ */}
            {shareOpen && currentShortlist && (
                <SharePanel
                    shortlist={currentShortlist}
                    shareUrl={shareUrl || currentShortlist.shareUrl}
                    shareToken={shareToken || currentShortlist.shareToken}
                    onClose={() => setShareOpen(false)}
                    onSent={() => {
                        dispatch(LoadMyShortlists()); // rafraîchit la liste
                        dispatch(LoadShortlist(selectedId!)); // rafraîchit le détail
                    }}
                />
            )}

            {/* ══ Delete confirm ════════════════════════════════════════ */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#0e1726] rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 border border-gray-200 dark:border-[#1b2e4b]">
                        <h3 className="font-bold text-lg dark:text-white mb-2">Supprimer la sélection ?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Cette action est irréversible.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#1b2e4b] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1b2e4b] transition"
                            >
                                Annuler
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShortlistsPage;
