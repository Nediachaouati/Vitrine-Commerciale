import { useEffect, useRef, useState } from 'react';
import { useRedux } from '../../../../hooks';
import {
  LoadMyRealisations,
  DeleteRealisation,
  OpenRealisationForm,
  ClearRealisationMsg,
} from '../../../../Redux/realisation/actions';
import type { RealisationResponseDto } from '../../../../helpers/model/dto/realisation.dto';
import RealisationForm from './RealisationForm';


const Icon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-icons-round ${className}`} style={{ fontSize: 'inherit' }}>
    {name}
  </span>
);

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  redaction:         { label: 'Rédaction',         color: '#3b82f6', bg: '#eff6ff', icon: 'edit_note' },
  seo:               { label: 'SEO',               color: '#10b981', bg: '#ecfdf5', icon: 'trending_up' },
  web_design:        { label: 'Web Design',        color: '#f97316', bg: '#fff7ed', icon: 'palette' },
  developpement:     { label: 'Développement',     color: '#8b5cf6', bg: '#f5f3ff', icon: 'code' },
  integration:       { label: 'Intégration',       color: '#06b6d4', bg: '#ecfeff', icon: 'integration_instructions' },
  community_manager: { label: 'Community Manager', color: '#ec4899', bg: '#fdf2f8', icon: 'groups' },
};

const Realisations = () => {
  const { dispatch, appSelector } = useRedux();
  const hasFetched = useRef(false);
  const [search, setSearch]                   = useState('');
  const [filterCat, setFilterCat]             = useState('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const realisations: RealisationResponseDto[] = appSelector((s: any) => s.Realisation?.realisations ?? []);
  const loading  = appSelector((s: any) => s.Realisation?.loading ?? false);
  const formOpen = appSelector((s: any) => s.Realisation?.formOpen ?? false);
  const msg      = appSelector((s: any) => s.Realisation?.msg ?? '');
  const error    = appSelector((s: any) => s.Realisation?.error ?? '');

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    dispatch(LoadMyRealisations());
  }, []); // eslint-disable-line

  useEffect(() => {
    if (msg || error) {
      const t = setTimeout(() => dispatch(ClearRealisationMsg()), 3500);
      return () => clearTimeout(t);
    }
  }, [msg, error, dispatch]);

  const filtered = realisations.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.clientName ?? '').toLowerCase().includes(q) ||
      r.technologies.some((t) => t.toLowerCase().includes(q));
    const matchCat = filterCat === 'all' || r.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleDelete = (id: number) => {
    dispatch(DeleteRealisation(id));
    setConfirmDeleteId(null);
  };

  if (loading && realisations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filterButtons = [
    { key: 'all', label: 'Tout', icon: 'apps' },
    ...Object.entries(CATEGORY_CONFIG).map(([k, v]) => ({ key: k, label: v.label, icon: v.icon })),
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white tracking-tight">Réalisations</h1>
          <p className="text-sm text-gray-400 mt-1">
            {realisations.length} projet{realisations.length !== 1 ? 's' : ''} réalisé{realisations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => dispatch(OpenRealisationForm())}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-95 transition-all text-sm font-semibold shadow-md shadow-primary/20"
        >
          <Icon name="add" className="text-[20px]" />
          Nouvelle réalisation
        </button>
      </div>

      {/* ── Toasts ──────────────────────────────────────────────── */}
      {msg && (
        <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm">
          <Icon name="check_circle" className="text-[20px]" />
          {msg}
        </div>
      )}
      {error && (
        <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm">
          <Icon name="error" className="text-[20px]" />
          {error}
        </div>
      )}

      {/* ── Filtres ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-[#1b2e4b] rounded-xl text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterButtons.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilterCat(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filterCat === key
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white dark:bg-[#0e1726] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-[#1b2e4b] hover:border-primary hover:text-primary'
              }`}
            >
              <Icon name={icon} className="text-[14px]" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          
          <p className="text-base font-semibold text-gray-500 dark:text-gray-400">Aucune réalisation trouvée</p>
          
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <RealisationCard
              key={r.realisationId}
              realisation={r}
              onEdit={() => dispatch(OpenRealisationForm(r.realisationId))}
              onDelete={() => setConfirmDeleteId(r.realisationId)}
            />
          ))}
        </div>
      )}

      {formOpen && <RealisationForm />}

      {/* ── Confirm suppression ──────────────────────────────────── */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0e1726] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <Icon name="delete_forever" className="text-[24px] text-red-500" />
            </div>
            <h3 className="text-lg font-bold dark:text-white mb-1">Supprimer la réalisation ?</h3>
            <p className="text-sm text-gray-400 mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-[#1b2e4b] dark:text-white hover:bg-gray-50 dark:hover:bg-[#1b2e4b] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 px-4 py-2 text-sm rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-semibold"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Card ──────────────────────────────────────────────────────────
const RealisationCard = ({
  realisation: r,
  onEdit,
  onDelete,
}: {
  realisation: RealisationResponseDto;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const cat = CATEGORY_CONFIG[r.category ?? ''] ?? CATEGORY_CONFIG['redaction'];
  const date = r.deliveredAt
    ? new Date(r.deliveredAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="group bg-white dark:bg-[#0e1726] border border-gray-100 dark:border-[#1b2e4b] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300">

      {/* ── Visuel ──────────────────────────────────────────────── */}
      <div className="relative h-44 overflow-hidden bg-gray-50 dark:bg-[#1b2e4b]">
        {r.screenshotUrl ? (
          <>
            <img
              src={r.screenshotUrl}
              alt={r.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Icon name="web" className="text-[48px] text-gray-200 dark:text-gray-700" />
            <span className="text-xs text-gray-300 dark:text-gray-600">Aucun aperçu</span>
          </div>
        )}

        {/* Badge catégorie */}
        <div
          className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm"
          style={{ background: cat.bg, color: cat.color }}
        >
          <Icon name={cat.icon} className="text-[12px]" />
          {cat.label}
        </div>

        {/* Badge privé */}
        {!r.isPublic && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-semibold">
            <Icon name="lock" className="text-[11px]" />
            Privé
          </div>
        )}

        {/* Boutons action — visibles au hover sur l'image */}
        <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          <button
            onClick={onEdit}
            title="Modifier"
            className="w-8 h-8 rounded-lg bg-white/95 dark:bg-[#0e1726]/95 backdrop-blur-sm inline-flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary shadow-md transition-colors"
          >
            <Icon name="edit" className="text-[16px]" />
          </button>
          <button
            onClick={onDelete}
            title="Supprimer"
            className="w-8 h-8 rounded-lg bg-white/95 dark:bg-[#0e1726]/95 backdrop-blur-sm inline-flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-500 shadow-md transition-colors"
          >
            <Icon name="delete" className="text-[16px]" />
          </button>
        </div>
      </div>

      {/* ── Contenu ─────────────────────────────────────────────── */}
      <div className="p-4">
        <h3 className="font-bold text-sm dark:text-white truncate mb-2">{r.title}</h3>

        {/* Client + date */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          {r.clientName && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Icon name="business" className="text-[13px]" />
              {r.clientName}
            </span>
          )}
          {date && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Icon name="calendar_today" className="text-[13px]" />
              {date}
            </span>
          )}
        </div>

        {/* Description */}
        {r.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
            {r.description}
          </p>
        )}

        {/* Technologies */}
        {r.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {r.technologies.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[10px] font-medium bg-gray-100 dark:bg-[#1b2e4b] text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md"
              >
                {t}
              </span>
            ))}
            {r.technologies.length > 4 && (
              <span className="text-[10px] text-gray-400 self-center">
                +{r.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        {r.siteUrl ? (
          <a
            href={r.siteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-primary/30 text-primary text-xs font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
          >
            <Icon name="open_in_new" className="text-[14px]" />
            Voir le site
          </a>
        ) : (
          <div className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-gray-100 dark:border-[#1b2e4b] text-gray-300 dark:text-gray-600 text-xs cursor-default">
            <Icon name="link_off" className="text-[14px]" />
            Aucun lien
          </div>
        )}
      </div>
    </div>
  );
};

export default Realisations;