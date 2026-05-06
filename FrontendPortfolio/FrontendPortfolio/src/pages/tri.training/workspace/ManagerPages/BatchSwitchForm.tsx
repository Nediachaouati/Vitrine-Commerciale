import { useState, useRef, useEffect } from 'react';
import type { PortfolioListItemDto, BatchSwitchRequestDto } from '../../../../helpers/model/dto/manager.dto';

const TECH_SUGGESTIONS = [
    'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js-Express',
    'Python-Django', 'Java-Spring', 'Go', 'Kotlin', '.NET-C#',
    'PHP-Laravel', 'Ruby on Rails', 'Flutter', 'React Native',
    'DevOps-Cloud', 'Kubernetes', 'Terraform', 'Salesforce', 'SAP', 'Data-ML',
];

interface Props {
    portfolios: PortfolioListItemDto[];
    loading: boolean;
    onSubmit: (dto: BatchSwitchRequestDto) => void;
}

const BatchSwitchForm = ({ portfolios, loading, onSubmit }: Props) => {
    const [step, setStep] = useState<'tech' | 'portfolios' | 'ready'>('tech');
    const [targetTech, setTargetTech] = useState('');
    const [missionCtx, setMissionCtx] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [techInput, setTechInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [promptInput, setPromptInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [step, loading]);

    const filteredSuggestions = techInput
        ? TECH_SUGGESTIONS.filter(s => s.toLowerCase().includes(techInput.toLowerCase()))
        : TECH_SUGGESTIONS;

    const initials = (name: string) =>
        name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    const togglePortfolio = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedIds(prev =>
            prev.length === portfolios.length ? [] : portfolios.map(p => p.portfolioId)
        );
    };

    const confirmTech = (tech: string) => {
        if (!tech.trim()) return;
        setTargetTech(tech.trim());
        setStep('portfolios');
    };

    const handlePromptKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && promptInput.trim()) {
            if (step === 'tech') {
                confirmTech(promptInput.trim());
                setPromptInput('');
            } else if (step === 'portfolios' && selectedIds.length > 0) {
                setMissionCtx(promptInput.trim());
                setStep('ready');
                setPromptInput('');
            }
        }
    };

    const handleLaunch = () => {
        if (!selectedIds.length || !targetTech) return;
        onSubmit({
            portfolioIds: selectedIds,
            targetTech,
            missionContext: missionCtx.trim() || undefined,
        });
    };

    const reset = () => {
        setStep('tech');
        setTargetTech('');
        setMissionCtx('');
        setSelectedIds([]);
        setTechInput('');
        setPromptInput('');
    };

    const placeholderByStep = () => {
        if (step === 'tech') return 'Entrez une technologie cible ';
        if (step === 'portfolios') return 'Contexte mission optionnel, puis Entrée pour continuer…';
        return 'Switch prêt à lancer…';
    };

    return (
        <div className="flex flex-col h-full" style={{ minHeight: '520px' }}>

            {/* ── Fil de conversation ── */}
            <div className="flex-1 overflow-y-auto space-y-5 pb-4 pr-1">

                {/* Message accueil IA */}
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-danger mb-1">Assistant Switch</p>
                        <div className="bg-white-light dark:bg-[#1b2e4b] rounded-2xl rounded-tl-sm px-4 py-3 text-sm dark:text-white leading-relaxed max-w-md">
                            Bonjour ! Je vais switcher les portfolios de vos collaborateurs vers une nouvelle technologie.
                            <br /><br />
                            <span className="font-semibold">Quelle est la technologie cible ?</span>
                        </div>

                        {/* Suggestions tech */}
                        {step === 'tech' && (
                            <div className="mt-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={techInput}
                                    onChange={e => { setTechInput(e.target.value); setShowSuggestions(true); }}
                                    placeholder="Filtrer les suggestions…"
                                    className="form-input text-xs rounded-xl w-full mb-2 max-w-md"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && techInput.trim()) confirmTech(techInput);
                                    }}
                                />
                                <div className="flex flex-wrap gap-2 max-w-md">
                                    {filteredSuggestions.slice(0, 12).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => confirmTech(s)}
                                            className="px-3 py-1.5 rounded-full text-xs border border-white-light dark:border-[#1b2e4b] text-gray-500 dark:text-gray-400 hover:border-danger/50 hover:text-danger hover:bg-danger/5 transition-all"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Réponse utilisateur : tech choisie */}
                {targetTech && (
                    <div className="flex justify-end">
                        <div className="bg-danger text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-xs">
                            {targetTech}
                        </div>
                    </div>
                )}

                {/* IA demande les portfolios */}
                {(step === 'portfolios' || step === 'ready') && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-danger mb-1">Assistant Switch </p>
                            <div className="bg-white-light dark:bg-[#1b2e4b] rounded-2xl rounded-tl-sm px-4 py-3 text-sm dark:text-white leading-relaxed max-w-md">
                                Parfait ! Sélectionnez maintenant les collaborateurs à switcher.
                                {missionCtx && (
                                    <span className="block mt-1 text-xs text-gray-400">Contexte : <em>"{missionCtx}"</em></span>
                                )}
                            </div>

                            {/* Liste portfolios */}
                            {step === 'portfolios' && (
                                <div className="mt-3 max-w-md">
                                    {portfolios.length === 0 ? (
                                        <div className="text-xs text-gray-400 border border-dashed border-white-light dark:border-[#1b2e4b] rounded-xl p-4 text-center">
                                            Aucun portfolio disponible.
                                        </div>
                                    ) : (
                                        <>
                                            {/* Select all */}
                                            <button
                                                onClick={toggleAll}
                                                className="text-xs text-gray-400 hover:text-danger mb-2 flex items-center gap-1.5 transition-colors"
                                            >
                                                <span className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedIds.length === portfolios.length ? 'bg-danger border-danger' : 'border-gray-300 dark:border-gray-600'}`}>
                                                    {selectedIds.length === portfolios.length && (
                                                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                                                            <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                        </svg>
                                                    )}
                                                </span>
                                                Tout sélectionner ({portfolios.length})
                                            </button>

                                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                                {portfolios.map(p => {
                                                    const checked = selectedIds.includes(p.portfolioId);
                                                    return (
                                                        <label
                                                            key={p.portfolioId}
                                                            onClick={() => togglePortfolio(p.portfolioId)}
                                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
                                                                checked
                                                                    ? 'border-danger bg-danger/5 dark:bg-danger/10'
                                                                    : 'border-white-light dark:border-[#1b2e4b] hover:border-danger/30'
                                                            }`}
                                                        >
                                                            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-danger border-danger' : 'border-gray-300 dark:border-gray-600'}`}>
                                                                {checked && (
                                                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                                                                        <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0 text-xs font-bold text-danger uppercase">
                                                                {initials(`${p.collaborator.firstName} ${p.collaborator.lastName}`)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium dark:text-white truncate">
                                                                    {p.collaborator.firstName} {p.collaborator.lastName}
                                                                </p>
                                                                <p className="text-xs text-gray-400 truncate">
                                                                    {p.collaborator.jobTitle}
                                                                </p>
                                                            </div>
                                                            <div className="hidden sm:flex gap-1 shrink-0">
                                                                {p.collaborator.primarySkills.slice(0, 2).map(s => (
                                                                    <span key={s} className="px-2 py-0.5 bg-white-light dark:bg-[#1b2e4b] text-gray-500 dark:text-gray-400 text-[10px] rounded-full">
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>

                                            {selectedIds.length > 0 && (
                                                <button
                                                    onClick={() => setStep('ready')}
                                                    className="mt-3 w-full px-4 py-2 rounded-xl text-xs border border-danger/40 text-danger hover:bg-danger/5 transition-all"
                                                >
                                                    Confirmer {selectedIds.length} collaborateur(s) →
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Réponse utilisateur : portfolios confirmés */}
                {step === 'ready' && selectedIds.length > 0 && (
                    <div className="flex justify-end">
                        <div className="bg-danger text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-xs">
                            {selectedIds.length} collaborateur(s) sélectionné(s)
                        </div>
                    </div>
                )}

                {/* Résumé final + bouton lancer */}
                {step === 'ready' && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="flex-1 max-w-md">
                            <p className="text-xs font-semibold text-danger mb-1">Assistant Switch </p>
                            <div className="bg-white-light dark:bg-[#1b2e4b] rounded-2xl rounded-tl-sm px-4 py-3 text-sm dark:text-white leading-relaxed">
                                Tout est prêt. Je vais switcher{' '}
                                <span className="font-semibold text-danger">{selectedIds.length} portfolio(s)</span>{' '}
                                vers{' '}
                                <span className="font-semibold text-danger">{targetTech}</span>
                                {missionCtx && (
                                    <> pour <em className="text-gray-400">"{missionCtx}"</em></>
                                )}{' '}
                               
                            </div>

                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={handleLaunch}
                                    disabled={loading}
                                    className="btn btn-danger gap-2 disabled:opacity-40 disabled:cursor-not-allowed flex-1"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            switch en cours…
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Lancer le switch IA
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={reset}
                                    className="px-3 py-2 rounded-xl text-xs border border-white-light dark:border-[#1b2e4b] text-gray-400 hover:text-danger hover:border-danger/30 transition-all"
                                    title="Recommencer"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* ── Barre de saisie style prompt ── */}
            {step !== 'ready' && (
                <div className="border-t border-white-light dark:border-[#1b2e4b] pt-4 mt-2">
                    <div className="flex items-center gap-2 bg-white-light dark:bg-[#1b2e4b] rounded-2xl px-4 py-2.5 border border-white-light dark:border-[#1b2e4b] focus-within:border-danger/40 transition-all">
                        <input
                            type="text"
                            value={promptInput}
                            onChange={e => setPromptInput(e.target.value)}
                            onKeyDown={handlePromptKey}
                            placeholder={placeholderByStep()}
                            className="flex-1 bg-transparent text-sm dark:text-white outline-none placeholder-gray-400"
                        />
                        <button
                            onClick={() => {
                                if (step === 'tech' && promptInput.trim()) {
                                    confirmTech(promptInput.trim());
                                    setPromptInput('');
                                } else if (step === 'portfolios' && selectedIds.length > 0) {
                                    setMissionCtx(promptInput.trim());
                                    setStep('ready');
                                    setPromptInput('');
                                }
                            }}
                            className="w-7 h-7 rounded-full bg-danger flex items-center justify-center shrink-0 hover:bg-danger/80 transition-colors disabled:opacity-30"
                            disabled={step === 'portfolios' ? selectedIds.length === 0 : !promptInput.trim()}
                        >
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                        {step === 'tech' ? 'Appuyez sur Entrée ou choisissez une suggestion ci-dessus' : 'Entrée pour confirmer · champ optionnel'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BatchSwitchForm;