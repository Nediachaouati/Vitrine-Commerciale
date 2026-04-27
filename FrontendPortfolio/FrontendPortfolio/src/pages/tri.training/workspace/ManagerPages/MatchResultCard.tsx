// pages/tri.training/workspace/Manager/Matching/MatchResultCard.tsx
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

const ScoreCircle = ({ score }: { score: number }) => {
    const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
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
    onLoadCriteria: (collaboratorId: number) => void;
    onLoadSuggestions: (collaboratorId: number) => void;
    suggestionsLoading: boolean;
    criteria: any | null;
    suggestions: any | null;
    selectedCollabId: number | null;
}

const MatchResultCard = ({ result, needId, onLoadCriteria, onLoadSuggestions, suggestionsLoading, criteria, suggestions, selectedCollabId }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const isSelected = selectedCollabId === result.collaboratorId;
    const initials = `${result.firstName.charAt(0)}${result.lastName.charAt(0)}`.toUpperCase();

    return (
        <div
            className={`bg-white dark:bg-[#0e1726] border rounded-xl overflow-hidden transition-all duration-200 ${
                isSelected ? 'border-primary shadow-lg shadow-primary/10' : 'border-gray-100 dark:border-[#1b2e4b] hover:border-primary/40'
            }`}
        >
            {/* Header */}
            <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded((e) => !e)}>
                {/* Avatar */}
                <div className="relative shrink-0">
                    {result.avatarUrl ? (
                        <img src={result.avatarUrl} alt={initials} className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{initials}</div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm dark:text-white">
                        {result.firstName} {result.lastName}
                    </p>
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

                {/* Score */}
                <ScoreCircle score={result.matchScore} />

                <span className={`text-xs transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>▶</span>
            </div>

            {/* Skills matched/missing */}
            <div className="px-4 pb-3 flex flex-wrap gap-1 border-t border-gray-50 dark:border-[#1b2e4b] pt-2">
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

            {/* Expanded: Breakdown + Actions */}
            {expanded && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-[#1b2e4b] pt-3 space-y-4">
                    {/* Score bars */}
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
                                        {value}/{max}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-gray-100 dark:bg-[#1b2e4b] rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(value / max) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Criterion details */}
                    {result.breakdown.details.map((d) => (
                        <div key={d.criterion} className="flex items-start gap-2 text-xs">
                            <span className={`font-bold shrink-0 mt-0.5 ${STATUS_COLOR[d.status]}`}>{STATUS_ICON[d.status]}</span>
                            <div>
                                <span className="font-semibold dark:text-white">{d.criterion}</span>
                                <span className="text-gray-500 dark:text-gray-400"> — {d.detail}</span>
                            </div>
                        </div>
                    ))}

                    {/* Quick suggestions */}
                    {result.suggestions.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">💡 Suggestions rapides</p>
                            <ul className="space-y-1">
                                {result.suggestions.map((s, i) => (
                                    <li key={i} className="text-xs text-amber-600 dark:text-amber-400">
                                        • {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={() => onLoadCriteria(result.collaboratorId)}
                            className="flex-1 text-xs py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
                        >
                            Voir critères détaillés
                        </button>
                        <button
                            onClick={() => onLoadSuggestions(result.collaboratorId)}
                            disabled={suggestionsLoading && isSelected}
                            className="flex-1 text-xs py-2 border border-violet-500 text-violet-600 rounded-lg hover:bg-violet-500 hover:text-white transition disabled:opacity-50"
                        >
                            {suggestionsLoading && isSelected ? 'Chargement...' : 'Suggestions IA'}
                        </button>
                    </div>

                    {/* Suggestions détaillées IA */}
                    {isSelected && suggestions && (
                        <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">🤖 Suggestions IA détaillées</p>
                                <span className="text-[10px] text-violet-500">
                                    {suggestions.currentMatchScore}% → {suggestions.potentialMatchScore}%
                                </span>
                            </div>
                            <ul className="space-y-1">
                                {suggestions.suggestions.map((s: string, i: number) => (
                                    <li key={i} className="text-xs text-violet-600 dark:text-violet-400">
                                        • {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* bouton portfolio */}
                    {/* Bouton portfolio */}
                    {result.publicSlug && (
                        <button
                            onClick={() => window.open(`/portfolio/public/${result.publicSlug}`, '_blank')}
                            className="w-full text-xs py-2 border border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition"
                        >
                            Voir le portfolio →
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MatchResultCard;
