import { useState } from 'react';
import type { MatchedCollaboratorDto } from '../../../../helpers/model/dto/manager.dto';

const BADGE_COLOR: Record<string, string> = {
    expert: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    disponible: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    bientot_disponible: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    senior: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    certifie: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    top_profil: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

const STATUS_COLOR: Record<string, string> = {
    matched: 'text-emerald-600 dark:text-emerald-400',
    partial: 'text-amber-600 dark:text-amber-400',
    missing: 'text-red-500 dark:text-red-400',
};

const STATUS_ICON: Record<string, string> = {
    matched: '✓',
    partial: '~',
    missing: '✗',
};

const EyeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 2C4.5 2 2 4.5 1 7.5C2 10.5 4.5 13 7.5 13C10.5 13 13 10.5 14 7.5C13 4.5 10.5 2 7.5 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
);
// ── Calcul du tier à partir du score ──────────────────────────────────────
type Tier = 'ideal' | 'risk' | 'backup';

const getTier = (score: number): Tier => {
    if (score >= 85) return 'ideal';
    if (score >= 60) return 'risk';
    return 'backup';
};

const TIER_CONFIG: Record<Tier, { label: string; badgeClass: string; borderClass: string; dotClass: string }> = {
    ideal: {
        label: 'PROFIL IDÉAL',
        badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        borderClass: 'border-emerald-200 dark:border-emerald-800',
        dotClass: 'bg-emerald-500',
    },
    risk: {
        label: 'RISQUE FAIBLE',
        badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        borderClass: 'border-amber-200 dark:border-amber-700',
        dotClass: 'bg-amber-500',
    },
    backup: {
        label: 'PROFIL DE SECOURS',
        badgeClass: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
        borderClass: 'border-red-200 dark:border-red-800',
        dotClass: 'bg-red-500',
    },
};

const ScoreCircle = ({ score }: { score: number }) => {
    const color = score >= 85 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
    const r = 20;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;

    return (
        <svg width="56" height="56" className="shrink-0">
            <circle cx="28" cy="28" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" className="dark:stroke-[#1b2e4b]" />
            <circle
                cx="28"
                cy="28"
                r={r}
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
                style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
            <text x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>
                {Math.round(score)}
            </text>
        </svg>
    );
};

interface Props {
    result: MatchedCollaboratorDto;
    needId: number;
    onLoadCriteria?: (collaboratorId: number) => void;
    onLoadSuggestions?: (collaboratorId: number) => void;
    suggestionsLoading?: boolean;
    criteria?: any | null;
    suggestions?: any | null;
    selectedCollabId?: number | null;

    isChecked?: boolean;
    onCheck?: (result: MatchedCollaboratorDto) => void;
}

const MatchResultCard = ({ result, onLoadCriteria, onLoadSuggestions, suggestionsLoading, criteria, suggestions, selectedCollabId, isChecked = false, onCheck }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const isSelected = selectedCollabId === result.collaboratorId;
    const initials = `${result.firstName.charAt(0)}${result.lastName.charAt(0)}`.toUpperCase();

    const tier = getTier(result.matchScore);
    const tierCfg = TIER_CONFIG[tier];

    // La phrase narrative vient de suggestions[0] (générée par l'IA côté backend)
    const narrative: string | null = result.suggestions?.[0] ?? null;

    return (
        <div
            className={`bg-white dark:bg-[#0e1726] border rounded-xl overflow-hidden transition-all duration-200 ${
                isSelected ? 'border-primary shadow-lg shadow-primary/10' : `${tierCfg.borderClass} hover:border-primary/40`
            }`}
        >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded((e) => !e)}>
                {/* Checkbox de sélection */}
                {onCheck && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onCheck(result);
                        }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                            isChecked ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                        }`}
                    >
                        {isChecked && (
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </div>
                )}
                {/* Avatar */}
                <div className="relative shrink-0">
                    {result.avatarUrl ? (
                        <img src={result.avatarUrl} alt={initials} className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{initials}</div>
                    )}
                    {/* Dot de tier */}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#0e1726] ${tierCfg.dotClass}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm dark:text-white">
                            {result.firstName} {result.lastName}
                        </p>
                        {/* Badge de tier */}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wide ${tierCfg.badgeClass}`}>{tierCfg.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.jobTitle}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                        {result.badges.slice(0, 3).map((b) => {
                            const cls = BADGE_COLOR[b] ?? 'bg-gray-100 text-gray-600';
                            return (
                                <span key={b} className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${cls}`}>
                                    {b}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {/* ── Icône œil : ouvre le portfolio ── */}
                    {result.publicSlug && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(`/portfolio/public/${result.publicSlug}`, '_blank');
                            }}
                            title="Voir le portfolio"
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                            <EyeIcon />
                        </button>
                    )}
                    {/* Score */}
                    <ScoreCircle score={result.matchScore} />

                    <span className={`text-xs transition-transform duration-200 text-gray-400 ${expanded ? 'rotate-90' : ''}`}>▶</span>
                </div>
            </div>
            {/* ── Skills matched/missing ──────────────────────────────────── */}
            <div className="px-4 pb-2 flex flex-wrap gap-1 border-t border-gray-50 dark:border-[#1b2e4b] pt-2">
                {result.matchedSkills.map((s) => (
                    <span
                        key={s}
                        className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800"
                    >
                        ✓ {s}
                    </span>
                ))}
                {result.missingSkills.map((s) => (
                    <span key={s} className="text-[10px] bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                        ✗ {s}
                    </span>
                ))}
            </div>

            {/* ── Score compact (Skills X/40 — Exp Y/25) ─────────────────── */}
            <div className="px-4 pb-2 flex gap-3 text-[10px] text-gray-400 dark:text-gray-500">
                <span>Skills {Math.round(result.breakdown.skillScore)}/50</span>
                <span>·</span>
                <span>Exp {Math.round(result.breakdown.experienceScore)}/25</span>
                <span>·</span>
                <span>Cert {Math.round(result.breakdown.certificationScore)}/20</span>
                <span>·</span>
                <span>Dispo {Math.round(result.breakdown.availabilityScore)}/15</span>
            </div>

            {/* ── Phrase narrative IA (toujours visible) ─────────────────── */}
            {narrative && (
                <div className="px-4 pb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">{narrative}</p>
                </div>
            )}

            {/* ── Expanded: détail complet ────────────────────────────────── */}
            {expanded && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-[#1b2e4b] pt-3 space-y-4">
                    {/* Barres de score */}
                    <div className="space-y-2">
                        {[
                            { label: 'Compétences', value: result.breakdown.skillScore, max: 50 },
                            { label: 'Expérience', value: result.breakdown.experienceScore, max: 25 },
                            { label: 'Certifications', value: result.breakdown.certificationScore, max: 20 },
                            { label: 'Disponibilité', value: result.breakdown.availabilityScore, max: 15 },
                        ].map(({ label, value, max }) => (
                            <div key={label}>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <span>{label}</span>
                                    <span>
                                        {Math.round(value)}/{max}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-gray-100 dark:bg-[#1b2e4b] rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(value / max) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Détail des critères */}
                    <div className="space-y-1">
                        {result.breakdown.details.map((d) => (
                            <div key={d.criterion} className="flex items-start gap-2 text-xs">
                                <span className={`font-bold shrink-0 mt-0.5 ${STATUS_COLOR[d.status]}`}>{STATUS_ICON[d.status]}</span>
                                <div>
                                    <span className="font-semibold dark:text-white">{d.criterion}</span>
                                    <span className="text-gray-500 dark:text-gray-400"> — {d.detail}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchResultCard;
