// pages/tri.training/workspace/Manager/Dashboard/index.tsx
import { useEffect, useRef, useState } from 'react';
import { useRedux } from '../../../../hooks';
import { LoadDashboard, SelectCollab } from '../../../../Redux/manager/actions';
import type { CollaboratorSummaryDto } from '../../../../helpers/model/dto/manager.dto';

const BADGE_CONFIG: Record<string, { label: string; color: string }> = {
    expert: { label: 'Expert', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
    disponible: { label: 'Disponible', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    bientot_disponible: { label: 'Bientôt dispo', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    senior: { label: 'Senior', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    certifie: { label: 'Certifié', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' },
    top_profil: { label: 'Top Profil', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
};

const AVAIL_COLOR: Record<string, string> = {
    available: 'bg-emerald-400',
    soon: 'bg-amber-400',
    busy: 'bg-red-400',
};

const Dashboard = () => {
    const { dispatch, appSelector } = useRedux();
    const hasFetched = useRef(false);
    const [search, setSearch] = useState('');
    const [filterAvail, setFilterAvail] = useState('all');

    const collaborators: CollaboratorSummaryDto[] = appSelector((s: any) => s.Manager?.collaborators ?? []);
    const loading: boolean = appSelector((s: any) => s.Manager?.loading ?? false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        dispatch(LoadDashboard());
    }, []); // eslint-disable-line

    const filtered = collaborators.filter((c) => {
        const q = search.toLowerCase();
        const matchSearch =
            !q || c.firstName.toLowerCase().includes(q) || c.lastName.toLowerCase().includes(q) || c.jobTitle.toLowerCase().includes(q) || c.primarySkills.some((s) => s.toLowerCase().includes(q));
        const matchAvail = filterAvail === 'all' || c.availabilityStatus === filterAvail;
        return matchSearch && matchAvail;
    });

    if (loading && collaborators.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Dashboard collaborateurs</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {collaborators.length} profil{collaborators.length !== 1 ? 's' : ''} disponible{collaborators.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-[200px] border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-4 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                    value={filterAvail}
                    onChange={(e) => setFilterAvail(e.target.value)}
                    className="border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-4 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none"
                >
                    <option value="all">Toutes disponibilités</option>
                    <option value="available">Disponible</option>
                    <option value="soon">Bientôt dispo</option>
                    <option value="busy">Occupé</option>
                </select>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <div className="text-4xl mb-3">🔍</div>
                    <p>Aucun collaborateur trouvé</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((c) => (
                        <CollabCard key={c.collaboratorId} collab={c} onSelect={() => dispatch(SelectCollab(c.collaboratorId))} />
                    ))}
                </div>
            )}
        </div>
    );
};

const CollabCard = ({ collab, onSelect }: { collab: CollaboratorSummaryDto; onSelect: () => void }) => {
    const initials = `${collab.firstName.charAt(0)}${collab.lastName.charAt(0)}`.toUpperCase();
    const dotColor = AVAIL_COLOR[collab.availabilityStatus] ?? 'bg-gray-400';

    const handleViewPortfolio = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (collab.publicSlug) {
            window.open(`/portfolio/public/${collab.publicSlug}`, '_blank');
        }
    };

    return (
        <div
            onClick={onSelect}
            className="group cursor-pointer bg-white dark:bg-[#0e1726] border border-gray-100 dark:border-[#1b2e4b] rounded-xl p-4 hover:shadow-lg hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-200"
        >
            {/* Avatar + status */}
            <div className="flex items-start justify-between mb-3">
                <div className="relative">
                    {collab.avatarUrl ? (
                        <img src={collab.avatarUrl} alt={initials} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{initials}</div>
                    )}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0e1726] ${dotColor}`} />
                </div>
                <div className="flex gap-1 flex-wrap justify-end max-w-[120px]">
                    {collab.badges.slice(0, 2).map((b) => {
                        const cfg = BADGE_CONFIG[b];
                        return cfg ? (
                            <span key={b} className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${cfg.color}`}>
                                {cfg.label}
                            </span>
                        ) : null;
                    })}
                </div>
            </div>

            {/* Info */}
            <div className="mb-2">
                <p className="font-semibold text-sm dark:text-white truncate">
                    {collab.firstName} {collab.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{collab.jobTitle}</p>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-3">
                {collab.primarySkills.slice(0, 3).map((s) => (
                    <span key={s} className="text-[10px] bg-gray-100 dark:bg-[#1b2e4b] text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                        {s}
                    </span>
                ))}
                {collab.primarySkills.length > 3 && <span className="text-[10px] text-gray-400">+{collab.primarySkills.length - 3}</span>}
            </div>

            {/* Stats */}
            <div className="flex justify-between text-[11px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-[#1b2e4b] pt-2 mt-auto">
                <span>
                    {collab.yearsExperience} an{collab.yearsExperience !== 1 ? 's' : ''} exp.
                </span>
                <span>
                    {collab.portfolioCount} portfolio{collab.portfolioCount !== 1 ? 's' : ''}
                </span>
                <span>{collab.viewCount} vues</span>
            </div>
            {/*  Bouton portfolio — visible au hover */}
            {collab.publicSlug ? (
                <button
                    onClick={handleViewPortfolio}
                    className="mt-3 w-full text-[11px] py-1.5 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
                >
                    Voir le portfolio →
                </button>
            ) : collab.portfolioCount > 0 ? (
                <div className="mt-3 w-full text-[11px] py-1.5 text-center text-gray-300 dark:text-gray-600">Portfolio non public</div>
            ) : null}
        </div>
    );
};

export default Dashboard;
