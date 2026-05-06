import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../Redux/store';
import { ViewShortlistByTokenApi } from '../../../../helpers/api/ShortlistApi';
import type { ClientShortlistViewDto, ShortlistItemDto } from '../../../../helpers/model/dto/Shortlist.dto';

// ── Icons ─────────────────────────────────────────────────────────
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" />
    <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clipRule="evenodd" />
  </svg>
);

// ── Availability config ────────────────────────────────────────────
const AVAIL: Record<string, { label: string; dot: string; badge: string }> = {
  available:      { label: 'Disponible',         dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  soon_available: { label: 'Bientôt disponible', dot: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  not_available:  { label: 'Non disponible',     dot: 'bg-red-500',     badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
};

// ── Profile Card ──────────────────────────────────────────────────
const ProfileCard = ({ item, index }: { item: ShortlistItemDto; index: number }) => {
  const avail    = AVAIL[item.availabilityStatus] ?? AVAIL.not_available;
  const initials = `${item.firstName.charAt(0)}${item.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="bg-white dark:bg-[#0e1726] rounded-2xl border border-gray-200 dark:border-[#1b2e4b] p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 group">
      <div className="flex items-start gap-4">
        {/* Numéro + Avatar */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg overflow-hidden">
            {item.avatarUrl
              ? <img src={item.avatarUrl} alt={initials} className="w-full h-full object-cover" />
              : initials
            }
          </div>
          <div className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white bg-primary shadow`}>
            {index + 1}
          </div>
          <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-[#0e1726] ${avail.dot}`} />
        </div>

        {/* Infos principales */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-bold text-base dark:text-white">
                {item.firstName} {item.lastName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <BriefcaseIcon />
                {item.jobTitle}
              </p>
            </div>
            {/* Score */}
            {item.relevanceScore != null && (
              <div className="text-right shrink-0">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 rounded-lg">
                  <StarIcon />
                  <span className="text-sm font-bold text-primary">{Math.round(item.relevanceScore)}%</span>
                </div>
                <p className="text-[9px] text-gray-400 mt-0.5 text-right">Score de pertinence</p>
              </div>
            )}
          </div>

          {/* Expérience + Dispo */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon />
              {item.yearsExperience} an{item.yearsExperience > 1 ? 's' : ''} d'expérience
            </span>
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${avail.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
              {avail.label}
            </span>
          </div>

          {/* Barre de score */}
          {item.relevanceScore != null && (
            <div className="mt-3">
              <div className="h-1.5 w-full bg-gray-100 dark:bg-[#1b2e4b] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700"
                  style={{ width: `${item.relevanceScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Compétences */}
          {item.primarySkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.primarySkills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] px-2 py-0.5 bg-gray-100 dark:bg-[#1b2e4b] text-gray-600 dark:text-gray-300 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Note du manager */}
          {item.managerNote && (
            <div className="mt-3 px-3 py-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-lg">
              <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium mb-0.5">Note du manager</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 italic">{item.managerNote}</p>
            </div>
          )}

          {/* Vue switchée */}
          {item.switchedTitle && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#1b2e4b]">
              <p className="text-xs font-semibold text-primary mb-1">{item.switchedTitle}</p>
              {item.switchedBio && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.switchedBio}</p>
              )}
              {item.transferableSkills && item.transferableSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.transferableSkills.slice(0, 4).map((s) => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bouton voir portfolio */}
      {item.publicSlug && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#1b2e4b]">
          <a
            href={`/portfolio/public/${item.publicSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-primary text-primary rounded-xl text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-200"
          >
            <EyeIcon />
            Voir le portfolio complet
          </a>
        </div>
      )}
    </div>
  );
};

// ── Page principale ────────────────────────────────────────────────
const ShortlistClientView = () => {
  const { token } = useParams<{ token: string }>();
  const navigate   = useNavigate();

  const { userLoggedIn } = useSelector((state: IRootState) => ({
    userLoggedIn: state.Auth.userLoggedIn ?? false,
  }));

  const [data, setData]       = useState<ClientShortlistViewDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    // Rediriger vers login si pas connecté
    if (!userLoggedIn) {
      navigate(`/login?redirect=/shortlist/${token}`, { replace: true });
      return;
    }

    if (!token) {
      setError('Token invalide.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
  try {
    const res: any = await ViewShortlistByTokenApi(token);
    setData(res.data);
    // Sauvegarder le token pour le menu
    localStorage.setItem('lastShortlistToken', token!);
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 404) setError('Cette shortlist est introuvable ou a expiré.');
    else if (status === 401) setError('Vous devez être connecté pour accéder à cette page.');
    else setError("Une erreur s'est produite lors du chargement.");
  } finally {
    setLoading(false);
  }
};

    fetchData();
  }, [token, userLoggedIn, navigate]);

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#060818] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Chargement de votre shortlist…</p>
        </div>
      </div>
    );
  }

  // ── Erreur ───────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#060818] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-red-500">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">Accès impossible</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const availableCount = data.items.filter(i => i.availabilityStatus === 'available').length;
  const avgScore = data.items.some(i => i.relevanceScore != null)
    ? Math.round(data.items.filter(i => i.relevanceScore != null).reduce((a, i) => a + (i.relevanceScore ?? 0), 0) / data.items.filter(i => i.relevanceScore != null).length)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060818]">

      {/* ── Banner ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-3 opacity-80">
            <ShieldIcon />
            <span className="text-sm font-medium">Shortlist confidentielle · Accès sécurisé</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{data.title}</h1>
          {data.description && (
            <p className="opacity-85 text-sm md:text-base max-w-2xl">{data.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-sm opacity-75 flex-wrap">
            <span>Préparé par <strong className="opacity-100">{data.managerName}</strong></span>
            <span>·</span>
            <span>{new Date(data.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      

      {/* ── Liste des profils ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg dark:text-white">
            Profils recommandés
          </h2>
          <span className="text-xs text-gray-400 bg-white dark:bg-[#0e1726] border border-gray-200 dark:border-[#1b2e4b] px-3 py-1.5 rounded-full">
            {data.items.length} candidat{data.items.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.items.map((item, index) => (
            <ProfileCard key={item.itemId} item={item} index={index} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-[#1b2e4b] text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
            <ShieldIcon />
            <span>Document confidentiel préparé par <strong>{data.managerName}</strong> </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortlistClientView;