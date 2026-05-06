import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../../../Redux/store';
import { FilterPortfolios } from '../../../../../Redux/manager/actions';
import { CreateShortlist } from '../../../../../Redux/shortlist/actions';
import type { PortfolioListItemDto } from '../../../../../helpers/model/dto/manager.dto';
import type { ShortlistItemInputDto } from '../../../../../helpers/model/dto/Shortlist.dto';

// ── Icons ─────────────────────────────────────────────────────────
const XIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
);
const CheckIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
);
const SearchIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);

const AVAIL_COLOR: Record<string, string> = {
    available: 'bg-emerald-500',
    soon_available: 'bg-amber-500',
    not_available: 'bg-red-500',
};

interface Step {
    id: 1 | 2 | 3;
    label: string;
}
const STEPS: Step[] = [
    { id: 1, label: 'Sélection profils' },
    { id: 2, label: 'Détails sélection' },
    { id: 3, label: 'Confirmation' },
];

interface Props {
    onClose: () => void;
    preselected?: PortfolioListItemDto[];
    startAtStep?: 1 | 2 | 3;
}

const ShortlistBuilder = ({ onClose, preselected = [], startAtStep = 1 }: Props) => {
    const dispatch = useDispatch();
    const { portfolios, loading: portfoliosLoading } = useSelector((state: IRootState) => (state as any).Manager);
    const { loading: creating, msg, error: shortlistError } = useSelector((state: IRootState) => (state as any).Shortlist);

    // ✅ Track si on vient d'envoyer le formulaire pour n'afficher le toast qu'après une vraie création
    const [submitted, setSubmitted] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // ✅ Le toast ne se déclenche QUE si submitted=true (bouton "Créer la Sélection" cliqué)
    // et que le Redux renvoie un msg de succès sans erreur
    useEffect(() => {
        if (submitted && msg && !shortlistError) {
            setSuccessMsg(msg);
            const t = setTimeout(() => {
                onClose();
            }, 1200);
            return () => clearTimeout(t);
        }
    }, [msg, shortlistError, submitted, onClose]);

    const [step, setStep] = useState<1 | 2 | 3>(startAtStep);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<PortfolioListItemDto[]>(preselected);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [clientName, setClientName] = useState('');
    const [expiresAt, setExpiresAt] = useState('');

    // Charger portfolios seulement si on commence au step 1
    useEffect(() => {
        if (startAtStep === 1) {
            dispatch(FilterPortfolios({ search: '' }));
        }
    }, [dispatch, startAtStep]);

    const filtered = portfolios.filter((p: PortfolioListItemDto) => {
        const q = search.toLowerCase();
        return (
            !q ||
            p.collaborator.firstName?.toLowerCase().includes(q) ||
            p.collaborator.lastName?.toLowerCase().includes(q) ||
            p.collaborator.jobTitle?.toLowerCase().includes(q) ||
            p.collaborator.primarySkills?.some((s: string) => s.toLowerCase().includes(q))
        );
    });

    const toggleSelect = useCallback((p: PortfolioListItemDto) => {
        setSelected((prev) => (prev.find((x) => x.portfolioId === p.portfolioId) ? prev.filter((x) => x.portfolioId !== p.portfolioId) : [...prev, p]));
    }, []);

    const isSelected = (p: PortfolioListItemDto) => selected.some((x) => x.portfolioId === p.portfolioId);

    const handleCreate = () => {
        if (!title.trim() || selected.length === 0) return;

        // ✅ Vérifie que chaque portfolioId est un nombre valide avant d'envoyer
        const invalidItems = selected.filter((p) => !p.portfolioId || typeof p.portfolioId !== 'number');
        if (invalidItems.length > 0) {
            console.error('[ShortlistBuilder] portfolioId invalide:', invalidItems);
            return;
        }

        const items: ShortlistItemInputDto[] = selected.map((p, i) => ({
            portfolioId: p.portfolioId,
            displayOrder: i + 1,
            switchedViewId: p.switchedViewId ?? undefined,
        }));

        const payload = {
            title: title.trim(),
            description: description.trim() || undefined,
            expiresAt: expiresAt || undefined,
            items,
        };

        // 🔍 Log exact du payload — vérifiez la console pour diagnostiquer le 500
        console.log('[ShortlistBuilder] Payload →', JSON.stringify(payload, null, 2));

        setSubmitted(true);
        dispatch(CreateShortlist(payload));
    };

    // Bouton retour : si on vient du switch (startAtStep=2), retour = fermer
    const handleBack = () => {
        if (step === 1 || (step === 2 && startAtStep === 2)) {
            onClose();
        } else {
            setStep((s) => (s - 1) as 1 | 2 | 3);
        }
    };

    return (
        <>
            {/* ── Toast succès — affiché uniquement après vraie création ── */}
            {successMsg && (
                <div className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700 flex items-center gap-2 animate-[fadeIn_0.2s_ease]">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {successMsg}
                </div>
            )}

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-[#0e1726] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-[#1b2e4b]">
                    {/* ── Header ─────────────────────────────────────────────── */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#1b2e4b] shrink-0">
                        <div>
                            <h2 className="text-lg font-bold dark:text-white">Créer une sélection</h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {step === 1 && `${selected.length} profil${selected.length !== 1 ? 's' : ''} sélectionné${selected.length !== 1 ? 's' : ''}`}
                                {step === 2 && `${selected.length} profil${selected.length !== 1 ? 's' : ''} · Renseignez les informations`}
                                {step === 3 && 'Vérifiez avant de créer'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#1b2e4b] transition">
                            <XIcon />
                        </button>
                    </div>

                    {/* ── Stepper ────────────────────────────────────────────── */}
                    <div className="flex items-center gap-0 px-6 pt-4 shrink-0">
                        {STEPS.map((s, idx) => (
                            <div key={s.id} className="flex items-center flex-1">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                            step > s.id ? 'bg-primary text-white' : step === s.id ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-gray-100 dark:bg-[#1b2e4b] text-gray-400'
                                        }`}
                                    >
                                        {step > s.id ? <CheckIcon /> : s.id}
                                    </div>
                                    <span className={`text-xs font-medium hidden sm:block ${step >= s.id ? 'text-gray-700 dark:text-white' : 'text-gray-400'}`}>{s.label}</span>
                                </div>
                                {idx < STEPS.length - 1 && <div className={`flex-1 h-px mx-3 transition-all ${step > s.id ? 'bg-primary' : 'bg-gray-200 dark:bg-[#1b2e4b]'}`} />}
                            </div>
                        ))}
                    </div>

                    {/* ── Content ────────────────────────────────────────────── */}
                    <div className="flex-1 overflow-hidden flex flex-col p-5 gap-4 min-h-0">
                        {/* ════ STEP 1 ════════════════════════════════════════════ */}
                        {step === 1 && (
                            <>
                                <div className="relative shrink-0">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <SearchIcon />
                                    </div>
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Rechercher par nom, poste ou compétence…"
                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-[#1b2e4b] rounded-xl bg-white dark:bg-[#1b2e4b] text-sm dark:text-white focus:outline-none focus:border-primary transition"
                                    />
                                </div>
                                <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
                                    <div className="flex-1 overflow-y-auto">
                                        {portfoliosLoading && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="h-20 bg-gray-100 dark:bg-[#1b2e4b] rounded-xl animate-pulse" />
                                                ))}
                                            </div>
                                        )}
                                        {!portfoliosLoading && filtered.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">Aucun profil trouvé</div>}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {filtered.map((p: PortfolioListItemDto) => {
                                                const sel = isSelected(p);
                                                const initials = `${p.collaborator.firstName?.charAt(0) ?? ''}${p.collaborator.lastName?.charAt(0) ?? ''}`.toUpperCase();
                                                const dot = AVAIL_COLOR[p.collaborator.availabilityStatus] ?? 'bg-gray-400';
                                                return (
                                                    <div
                                                        key={p.portfolioId}
                                                        onClick={() => toggleSelect(p)}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                                            sel
                                                                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                                : 'border-gray-200 dark:border-[#1b2e4b] hover:border-primary/40 bg-white dark:bg-[#0e1726]'
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${sel ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-gray-600'}`}
                                                        >
                                                            {sel && <CheckIcon />}
                                                        </div>
                                                        <div className="relative shrink-0">
                                                            {p.collaborator.avatarUrl ? (
                                                                <img src={p.collaborator.avatarUrl} alt={initials} className="w-9 h-9 rounded-full object-cover" />
                                                            ) : (
                                                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{initials}</div>
                                                            )}
                                                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0e1726] ${dot}`} />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-semibold text-xs dark:text-white truncate">
                                                                {p.collaborator.firstName} {p.collaborator.lastName}
                                                            </p>
                                                            <p className="text-[10px] text-gray-400 truncate">{p.collaborator.jobTitle}</p>
                                                            <div className="flex gap-1 mt-0.5 flex-wrap">
                                                                {p.collaborator.primarySkills?.slice(0, 2).map((s: string) => (
                                                                    <span key={s} className="text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-[#1b2e4b] text-gray-500 dark:text-gray-400 rounded-full">
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {selected.length > 0 && (
                                        <div className="w-52 shrink-0 flex flex-col gap-2 overflow-y-auto">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0">Sélection ({selected.length})</p>
                                            {selected.map((p, idx) => {
                                                const initials = `${p.collaborator.firstName?.charAt(0) ?? ''}${p.collaborator.lastName?.charAt(0) ?? ''}`.toUpperCase();
                                                return (
                                                    <div key={`${p.portfolioId}-${idx}`} className="flex items-center gap-2 p-2 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                                                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                                                            {initials}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-[10px] font-semibold dark:text-white truncate">
                                                                {p.collaborator.firstName} {p.collaborator.lastName}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleSelect(p);
                                                            }}
                                                            className="text-gray-400 hover:text-red-500 shrink-0"
                                                        >
                                                            <XIcon />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ════ STEP 2 ════════════════════════════════════════════ */}
                        {step === 2 && (
                            <div className="flex flex-col gap-4 max-w-lg mx-auto w-full overflow-y-auto">
                                {/* Récap profils */}
                                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-3">
                                    <p className="text-xs font-semibold text-primary mb-2">
                                        {selected.length} profil{selected.length > 1 ? 's' : ''} sélectionné{selected.length > 1 ? 's' : ''}
                                        {startAtStep === 2 && ' depuis le switch'}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selected.map((p, idx) => (
                                            <span
                                                key={`${p.portfolioId}-${idx}`}
                                                className="text-[10px] px-2 py-0.5 bg-white dark:bg-[#0e1726] border border-primary/20 rounded-full text-gray-700 dark:text-gray-300"
                                            >
                                                {p.collaborator.firstName} {p.collaborator.lastName}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Titre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Ex: Senior DevOps Engineering Squad - Q3"
                                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#1b2e4b] rounded-xl bg-white dark:bg-[#1b2e4b] text-sm dark:text-white focus:outline-none focus:border-primary transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        placeholder="Contexte du projet, critères de sélection…"
                                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#1b2e4b] rounded-xl bg-white dark:bg-[#1b2e4b] text-sm dark:text-white focus:outline-none focus:border-primary transition resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nom du client</label>
                                    <input
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="Ex: Continental Global"
                                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#1b2e4b] rounded-xl bg-white dark:bg-[#1b2e4b] text-sm dark:text-white focus:outline-none focus:border-primary transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Date d'expiration du lien</label>
                                    <input
                                        type="date"
                                        value={expiresAt}
                                        onChange={(e) => setExpiresAt(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#1b2e4b] rounded-xl bg-white dark:bg-[#1b2e4b] text-sm dark:text-white focus:outline-none focus:border-primary transition"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ════ STEP 3 ════════════════════════════════════════════ */}
                        {step === 3 && (
                            <div className="flex flex-col gap-4 overflow-y-auto">
                                <div className="bg-gray-50 dark:bg-[#1b2e4b] rounded-xl p-4">
                                    <h4 className="font-bold text-sm dark:text-white mb-1">{title}</h4>
                                    {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
                                    <div className="flex gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                                        {clientName && (
                                            <span>
                                                Client : <strong className="text-gray-700 dark:text-gray-200">{clientName}</strong>
                                            </span>
                                        )}
                                        {expiresAt && (
                                            <span>
                                                Expire le : <strong className="text-gray-700 dark:text-gray-200">{new Date(expiresAt).toLocaleDateString('fr-FR')}</strong>
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                        {selected.length} profil{selected.length !== 1 ? 's' : ''} sélectionné{selected.length !== 1 ? 's' : ''}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {selected.map((p, idx) => {
                                            const initials = `${p.collaborator.firstName?.charAt(0) ?? ''}${p.collaborator.lastName?.charAt(0) ?? ''}`.toUpperCase();
                                            return (
                                                <div
                                                    key={`${p.portfolioId}-${idx}`}
                                                    className="flex items-center gap-2 p-2.5 bg-white dark:bg-[#0e1726] rounded-xl border border-gray-200 dark:border-[#1b2e4b]"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">{initials}</div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold dark:text-white truncate">
                                                            {p.collaborator.firstName} {p.collaborator.lastName}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 truncate">{p.collaborator.jobTitle}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Footer ─────────────────────────────────────────────── */}
                    <div className="flex items-center justify-between p-5 border-t border-gray-100 dark:border-[#1b2e4b] shrink-0">
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#1b2e4b] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1b2e4b] transition"
                        >
                            {step === 1 || (step === 2 && startAtStep === 2) ? 'Annuler' : 'Retour'}
                        </button>
                        <div className="flex items-center gap-2">
                            {step === 1 && (
                                <button
                                    disabled={selected.length === 0}
                                    onClick={() => setStep(2)}
                                    className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                                >
                                    Continuer ({selected.length})
                                </button>
                            )}
                            {step === 2 && (
                                <button
                                    disabled={!title.trim()}
                                    onClick={() => setStep(3)}
                                    className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                                >
                                    Vérifier
                                </button>
                            )}
                            {step === 3 && (
                                <button
                                    disabled={creating}
                                    onClick={handleCreate}
                                    className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition shadow-sm"
                                >
                                    {creating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                    Créer la Sélection
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShortlistBuilder;