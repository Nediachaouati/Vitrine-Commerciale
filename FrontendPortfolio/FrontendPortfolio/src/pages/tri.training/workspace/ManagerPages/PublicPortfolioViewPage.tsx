import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { PublicPortfolioViewDto } from '../../../../helpers/model/dto/manager.dto';

// ── Même STYLES que MyPortfolioPage ──────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap');

  :root {
    --ink: #0a0a0f;
    --paper: #f5f2eb;
    --accent: #c41a1a;
    --accent2: #1a6b4a;
    --muted: #8a8578;
    --line: #d4cfc4;
    --card: #edeae1;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  .pf-root { background: var(--paper); color: var(--ink); font-family: 'DM Mono', monospace; font-size: 14px; overflow-x: hidden; min-height: 100vh; }

  .pf-nav { position: sticky; top: 0; left: 0; right: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; padding: 18px 60px; background: var(--paper); border-bottom: 1px solid var(--line); }
  .pf-nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px; letter-spacing: 3px; text-transform: uppercase; color: var(--ink); }
  .pf-nav-logo span { color: var(--accent); }
  .pf-nav-links { display: flex; gap: 32px; list-style: none; }
  .pf-nav-links a { text-decoration: none; color: var(--muted); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; transition: color .2s; }
  .pf-nav-links a:hover { color: var(--ink); }
  .pf-nav-badge { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; background: var(--ink); color: var(--paper); padding: 4px 12px; border-radius: 2px; }

  /* Bandeau repositionnement — visible uniquement pour le manager */
  .pf-reposition-banner {
    background: var(--ink); color: var(--paper);
    padding: 10px 60px; font-size: 11px; letter-spacing: 1px;
    display: flex; align-items: center; gap: 16px;
    border-bottom: 2px solid var(--accent);
  }
  .pf-reposition-banner strong { color: var(--accent); }
  .pf-reposition-score {
    margin-left: auto; font-family: 'Fraunces', serif; font-size: 18px; font-weight: 300;
  }
  .pf-reposition-score span { color: var(--accent2); }

  .pf-hero { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 57px); }
  .pf-hero-left { padding: 80px 60px; display: flex; flex-direction: column; justify-content: center; border-right: 1px solid var(--line); animation: fadeUp .7s ease forwards; }
  .pf-hero-right { padding: 80px 60px; display: flex; flex-direction: column; justify-content: center; animation: fadeUp .7s .2s ease both; }

  .pf-hero-tag { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
  .pf-hero-tag::before { content: ''; display: block; width: 30px; height: 1px; background: var(--accent); }

  .pf-hero-name { font-family: 'Fraunces', serif; font-size: clamp(52px, 6vw, 88px); font-weight: 300; line-height: 1.0; letter-spacing: -2px; margin-bottom: 8px; }
  .pf-hero-name em { font-style: italic; color: var(--accent); }
  .pf-hero-jobtitle { font-family: 'Syne', sans-serif; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; color: var(--muted); margin-bottom: 40px; margin-top: 12px; }
  .pf-hero-bio { font-size: 13px; line-height: 1.9; color: #3a3830; max-width: 440px; margin-bottom: 48px; }
  .pf-hero-cta { display: flex; gap: 16px; flex-wrap: wrap; }

  .pf-btn-primary { background: var(--ink); color: var(--paper); padding: 14px 32px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; border: none; cursor: pointer; text-decoration: none; transition: background .2s; display: inline-block; }
  .pf-btn-primary:hover { background: var(--accent); }
  .pf-btn-outline { border: 1px solid var(--ink); color: var(--ink); padding: 14px 32px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; text-decoration: none; background: transparent; transition: all .2s; display: inline-block; }
  .pf-btn-outline:hover { background: var(--ink); color: var(--paper); }

  .pf-avail-card { background: var(--ink); color: var(--paper); padding: 28px 32px; margin-bottom: 32px; }
  .pf-avail-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .pf-avail-status { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
  .pf-avail-sub { font-size: 11px; color: #888; margin-top: 10px; letter-spacing: 1px; }
  .pf-dot-green { width: 10px; height: 10px; border-radius: 50%; background: #4ade80; flex-shrink: 0; box-shadow: 0 0 0 3px rgba(74,222,128,.2); animation: pulse 2s infinite; }
  .pf-dot-orange { width: 10px; height: 10px; border-radius: 50%; background: #f97316; flex-shrink: 0; box-shadow: 0 0 0 3px rgba(249,115,22,.2); }
  .pf-dot-muted { width: 10px; height: 10px; border-radius: 50%; background: var(--muted); flex-shrink: 0; }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 3px rgba(74,222,128,.2); } 50% { box-shadow: 0 0 0 7px rgba(74,222,128,.08); } }

  .pf-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); border: 1px solid var(--line); }
  .pf-stat-box { background: var(--card); padding: 24px; display: flex; flex-direction: column; gap: 6px; }
  .pf-stat-num { font-family: 'Fraunces', serif; font-size: 40px; font-weight: 300; line-height: 1; color: var(--ink); }
  .pf-stat-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }

  .pf-avatar-wrapper { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 3px solid var(--line); margin-bottom: 24px; }
  .pf-avatar-wrapper img { width: 100%; height: 100%; object-fit: cover; }

  .pf-social-links { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
  .pf-social-link { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); text-decoration: none; border-bottom: 1px solid var(--line); padding-bottom: 2px; transition: all .2s; }
  .pf-social-link:hover { color: var(--accent); border-color: var(--accent); }

  .pf-section { padding: 80px 60px; }
  .pf-section + .pf-section { border-top: 1px solid var(--line); }
  .pf-section-header { display: flex; align-items: baseline; gap: 20px; margin-bottom: 56px; }
  .pf-section-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: 2px; }
  .pf-section-title { font-family: 'Fraunces', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 300; letter-spacing: -1px; }
  .pf-section-line { flex: 1; height: 1px; background: var(--line); }

  .pf-skills-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 2px; background: var(--line); }
  .pf-skill-card { background: var(--card); padding: 28px 24px; transition: background .2s, color .2s; cursor: default; }
  .pf-skill-card:hover { background: var(--ink); color: var(--paper); }
  .pf-skill-card:hover .pf-skill-cat { color: #999; }
  .pf-skill-card:hover .pf-skill-track { background: #333; }
  .pf-skill-card:hover .pf-skill-fill { background: var(--accent); }
  .pf-skill-card:hover .pf-skill-years { color: #999; }
  .pf-skill-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .pf-skill-cat { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
  .pf-skill-track { height: 2px; background: var(--line); border-radius: 1px; }
  .pf-skill-fill { height: 100%; border-radius: 1px; background: var(--accent2); transition: width .6s ease; }
  .pf-skill-years { font-size: 10px; color: var(--muted); margin-top: 8px; letter-spacing: 1px; }

  .pf-timeline { position: relative; padding-left: 40px; }
  .pf-timeline::before { content: ''; position: absolute; left: 8px; top: 12px; bottom: 0; width: 1px; background: var(--line); }
  .pf-tl-item { position: relative; margin-bottom: 52px; opacity: 1; }
  .pf-tl-dot { position: absolute; left: -40px; top: 6px; width: 16px; height: 16px; border: 1px solid var(--line); background: var(--paper); display: flex; align-items: center; justify-content: center; }
  .pf-tl-dot::after { content: ''; width: 6px; height: 6px; background: var(--accent); }
  .pf-tl-date { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
  .pf-tl-role { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 4px; }
  .pf-tl-company { font-size: 12px; color: var(--muted); margin-bottom: 14px; letter-spacing: 1px; }
  .pf-tl-desc { font-size: 13px; line-height: 1.8; color: #3a3830; max-width: 680px; margin-bottom: 14px; }
  .pf-tl-techs { display: flex; flex-wrap: wrap; gap: 6px; }
  .pf-tech-pill { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 10px; border: 1px solid var(--line); color: var(--muted); border-radius: 2px; }

  .pf-projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2px; background: var(--line); }
  .pf-project-card { background: var(--card); padding: 32px; display: flex; flex-direction: column; gap: 14px; transition: background .2s; position: relative; overflow: hidden; }
  .pf-project-card:hover { background: var(--ink); color: var(--paper); }
  .pf-project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
  .pf-project-card:hover::before { transform: scaleX(1); }
  .pf-project-card:hover .pf-project-desc { color: #aaa; }
  .pf-project-card:hover .pf-tech-pill { border-color: #333; color: #888; }
  .pf-project-screenshot { width: 100%; height: 180px; object-fit: cover; border: 1px solid var(--line); display: block; }
  .pf-project-screenshot-placeholder { width: 100%; height: 180px; background: var(--line); display: flex; align-items: center; justify-content: center; font-size: 11px; color: var(--muted); letter-spacing: 1px; }
  .pf-project-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: 2px; }
  .pf-project-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; line-height: 1.2; }
  .pf-project-desc { font-size: 12px; line-height: 1.8; color: #4a4640; }
  .pf-project-link { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); text-decoration: none; display: flex; align-items: center; gap: 6px; transition: gap .2s; border-bottom: 1px solid transparent; padding-bottom: 1px; }
  .pf-project-link::after { content: '→'; }
  .pf-project-link:hover { gap: 12px; border-color: var(--accent); }

  .pf-certs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 2px; background: var(--line); }
  .pf-cert-card { background: var(--card); padding: 28px; transition: all .2s; }
  .pf-cert-card:hover { background: var(--ink); color: var(--paper); }
  .pf-cert-card:hover .pf-cert-meta { color: #888; }
  .pf-cert-issuer { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; }
  .pf-cert-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 16px; line-height: 1.4; }
  .pf-cert-meta { font-size: 11px; color: var(--muted); letter-spacing: 1px; }
  .pf-cert-link { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--accent); text-decoration: none; margin-top: 8px; display: inline-block; border-bottom: 1px solid transparent; transition: border-color .2s; }
  .pf-cert-link:hover { border-color: var(--accent); }

  .pf-footer { border-top: 1px solid var(--line); padding: 32px 60px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
  .pf-footer-left { font-size: 11px; color: var(--muted); letter-spacing: 1px; }
  .pf-footer-right { font-size: 10px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }
  .pf-footer-right span { color: var(--accent); }

  .pf-spinner { display: flex; align-items: center; justify-content: center; height: 100vh; background: var(--paper); }
  .pf-spinner-ring { width: 36px; height: 36px; border: 2px solid var(--line); border-top-color: var(--accent); border-radius: 50%; animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .pf-no-data { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: var(--paper); color: var(--muted); text-align: center; padding: 2rem; }
  .pf-no-data h2 { font-family: 'Fraunces', serif; font-weight: 300; font-size: 2rem; color: var(--ink); margin-bottom: 1rem; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 768px) {
    .pf-hero { grid-template-columns: 1fr; }
    .pf-hero-left { border-right: none; border-bottom: 1px solid var(--line); }
    .pf-nav { padding: 16px 24px; }
    .pf-nav-links { display: none; }
    .pf-section { padding: 60px 24px; }
    .pf-footer { padding: 24px; }
    .pf-reposition-banner { padding: 10px 24px; flex-wrap: wrap; }
  }
`;

const avatarUrl = (first: string, last: string, url?: string) =>
  url || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${first}+${last}`)}&background=0a0a0f&color=f5f2eb&size=200`;

const levelPct = (level: string) => {
  const l = level?.toLowerCase() ?? '';
  if (l.includes('expert')) return 95;
  if (l.includes('avancé') || l.includes('senior')) return 80;
  if (l.includes('inter') || l.includes('mid')) return 65;
  return 40;
};

const fmtDate = (d?: string | null) => {
  if (!d) return '';
  const [y, m] = d.slice(0, 7).split('-');
  const months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
};

const SectionHeader = ({ num, title }: { num: string; title: string }) => (
  <div className="pf-section-header">
    <span className="pf-section-num">{num} —</span>
    <h2 className="pf-section-title">{title}</h2>
    <div className="pf-section-line" />
  </div>
);

// ── Page principale ───────────────────────────────────────────────
const PublicPortfolioViewPage = () => {
  const { shareSlug } = useParams<{ shareSlug: string }>();
  const [data, setData] = useState<PublicPortfolioViewDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shareSlug) return;
    fetch(`/api/public/portfolio-view/${shareSlug}`)
      .then(r => {
        console.log('📡 Response status:', r.status);
        if (!r.ok) throw new Error('Portfolio introuvable');
        return r.json();
      })
      .then(raw => {
        console.log('📦 Raw data:', JSON.stringify(raw, null, 2)); // ← voit exactement les clés
        // Normalisation défensive pendant le debug
        const normalized = {
            targetTech:     raw.targetTech     ?? raw.TargetTech     ?? '',
            generatedTitle: raw.generatedTitle ?? raw.GeneratedTitle ?? '',
            generatedBio:   raw.generatedBio   ?? raw.GeneratedBio   ?? '',
            missionContext: raw.missionContext  ?? raw.MissionContext,
            relevanceScore: raw.relevanceScore  ?? raw.RelevanceScore,
            collaborator:   raw.collaborator    ?? raw.Collaborator,
            projects:       raw.projects        ?? raw.Projects       ?? [],
            skills:         raw.skills          ?? raw.Skills         ?? [],
            experiences:    raw.experiences     ?? raw.Experiences    ?? [],
            certifications: raw.certifications  ?? raw.Certifications ?? [],
        };
        console.log('✅ Collaborator:', normalized.collaborator);
        if (!normalized.collaborator) {
            throw new Error('Données collaborateur manquantes');
        }
        setData(normalized as PublicPortfolioViewDto);
      })
      .catch(e => {
        console.error('❌ Erreur:', e.message);
        setError(e.message);
      })
      .finally(() => setLoading(false));
}, [shareSlug]);

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="pf-spinner"><div className="pf-spinner-ring" /></div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="pf-no-data">
          <h2>Portfolio introuvable</h2>
          <p style={{ fontSize: 13, marginTop: 8 }}>Ce lien est invalide ou a expiré.</p>
        </div>
      </>
    );
  }

  const { collaborator: c, projects, skills, experiences, certifications } = data;
  const av = avatarUrl(c.firstName, c.lastName, c.avatarUrl);

  const availLabel =
    c.availabilityStatus === 'available' ? 'Disponible' :
    c.availabilityStatus === 'soon'      ? 'Bientôt disponible' : 'Non disponible';
  const availDot =
    c.availabilityStatus === 'available' ? 'pf-dot-green' :
    c.availabilityStatus === 'soon'      ? 'pf-dot-orange' : 'pf-dot-muted';

  const navLinks = [
    { href: '#skills',         label: 'Compétences',    show: skills.length > 0 },
    { href: '#experience',     label: 'Parcours',       show: experiences.length > 0 },
    { href: '#projects',       label: 'Projets',        show: projects.length > 0 },
    { href: '#certifications', label: 'Certifications', show: certifications.length > 0 },
  ].filter(l => l.show);

  const TECH_LABELS: Record<string, string> = {
    java: 'Java / Spring Boot', dotnet: '.NET / C#', python: 'Python',
    vue: 'Vue.js', angular: 'Angular', nextjs: 'Next.js',
    nodejs: 'Node.js', wordpress: 'WordPress / PHP', mobile: 'React Native',
    devops: 'DevOps / Cloud',
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="pf-root">

        {/* NAV */}
        <nav className="pf-nav">
          <div className="pf-nav-logo"><span>TRIWEB</span></div>
          <ul className="pf-nav-links">
            {navLinks.map(l => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
            {c.linkedinUrl && (
              <li><a href={c.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a></li>
            )}
          </ul>
          <div className="pf-nav-badge">{TECH_LABELS[data.targetTech] ?? data.targetTech}</div>
        </nav>

        {/* HERO */}
        <div className="pf-hero">
          {/* LEFT */}
          <div className="pf-hero-left">
            <div className="pf-hero-tag">
              {data.missionContext ? `Mission : ${data.missionContext}` : 'Profil repositionné'}
            </div>

            <h1 className="pf-hero-name">
              {c.firstName}<br />
              <em>{c.lastName}</em>
            </h1>

            {/* Titre repositionné par l'IA */}
            <div className="pf-hero-jobtitle">
              {data.generatedTitle || c.jobTitle}
              {c.yearsExperience > 0 && ` · ${c.yearsExperience} ans exp.`}
            </div>

            {/* Bio repositionnée par l'IA */}
            {data.generatedBio && <p className="pf-hero-bio">{data.generatedBio}</p>}

            <div className="pf-hero-cta">
              {projects.length > 0 && (
                <a href="#projects" className="pf-btn-primary">Voir les réalisations</a>
              )}
              {c.linkedinUrl && (
                <a href={c.linkedinUrl} target="_blank" rel="noreferrer" className="pf-btn-outline">
                  Contacter
                </a>
              )}
            </div>

            {(c.githubUrl || c.linkedinUrl) && (
              <div className="pf-social-links">
                {c.githubUrl && (
                  <a href={c.githubUrl} target="_blank" rel="noreferrer" className="pf-social-link">
                    GitHub ↗
                  </a>
                )}
                {c.linkedinUrl && (
                  <a href={c.linkedinUrl} target="_blank" rel="noreferrer" className="pf-social-link">
                    LinkedIn ↗
                  </a>
                )}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="pf-hero-right">
            <div className="pf-avatar-wrapper">
              <img
                src={av}
                alt={`${c.firstName} ${c.lastName}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://ui-avatars.com/api/?name=?&background=0a0a0f&color=f5f2eb&size=200';
                }}
              />
            </div>

            <div className="pf-avail-card">
              <div className="pf-avail-label">Disponibilité</div>
              <div className="pf-avail-status">
                <div className={availDot} />
                {availLabel}
              </div>
              <div className="pf-avail-sub">
                Profil orienté {TECH_LABELS[data.targetTech] ?? data.targetTech}
              </div>
            </div>

            <div className="pf-stats-grid">
              {c.yearsExperience > 0 && (
                <div className="pf-stat-box">
                  <div className="pf-stat-num">{c.yearsExperience}</div>
                  <div className="pf-stat-label">Ans d'exp.</div>
                </div>
              )}
              {projects.length > 0 && (
                <div className="pf-stat-box">
                  <div className="pf-stat-num">{projects.length}</div>
                  <div className="pf-stat-label">Projets {data.targetTech}</div>
                </div>
              )}
              {skills.length > 0 && (
                <div className="pf-stat-box">
                  <div className="pf-stat-num">{skills.length}</div>
                  <div className="pf-stat-label">Compétences</div>
                </div>
              )}
              {certifications.length > 0 && (
                <div className="pf-stat-box">
                  <div className="pf-stat-num">{certifications.length}</div>
                  <div className="pf-stat-label">Certifications</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── SKILLS ── */}
        {skills.length > 0 && (
          <section className="pf-section" id="skills">
            <SectionHeader num="01" title="Compétences" />
            <div className="pf-skills-layout">
              {skills.map(s => (
                <div key={s.collabSkillId} className="pf-skill-card">
                  <div className="pf-skill-name">{s.name}</div>
                  <div className="pf-skill-cat">
                    {s.isPrimary ? 'Primaire' : 'Secondaire'}
                    {s.level ? ` · ${s.level}` : ''}
                  </div>
                  <div className="pf-skill-track">
                    <div className="pf-skill-fill" style={{ width: `${levelPct(s.level)}%` }} />
                  </div>
                  {s.yearsUsed > 0 && (
                    <div className="pf-skill-years">{s.yearsUsed} an{s.yearsUsed > 1 ? 's' : ''}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── EXPÉRIENCES ── */}
        {experiences.length > 0 && (
          <section className="pf-section" id="experience">
            <SectionHeader num="02" title="Parcours" />
            <div className="pf-timeline">
              {experiences.map(e => (
                <div key={e.experienceId} className="pf-tl-item">
                  <div className="pf-tl-dot" />
                  <div className="pf-tl-date">
                    {fmtDate(e.startDate)} — {e.isCurrent ? 'Présent' : fmtDate(e.endDate)}
                  </div>
                  <div className="pf-tl-role">{e.jobTitle}</div>
                  <div className="pf-tl-company">{e.companyName}</div>
                  {e.description && <div className="pf-tl-desc">{e.description}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── PROJETS ── */}
        {projects.length > 0 && (
          <section className="pf-section" id="projects">
            <SectionHeader num="03" title="Projets réalisés" />
            <div className="pf-projects-grid">
              {projects.map((p, idx) => (
                <div key={p.projectId} className="pf-project-card">
                  {p.screenshotUrl ? (
                    <img
                      src={p.screenshotUrl}
                      alt={p.title}
                      className="pf-project-screenshot"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="pf-project-screenshot-placeholder">Aperçu non disponible</div>
                  )}
                  <div className="pf-project-num">{String(idx + 1).padStart(2, '0')}</div>
                  <div className="pf-project-title">{p.title}</div>
                  {p.technologies && (
                    <div className="pf-tl-techs">
                      {p.technologies.split(',').map(t => (
                        <span key={t.trim()} className="pf-tech-pill">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                  {p.description && <div className="pf-project-desc">{p.description}</div>}
                  {p.projectUrl && (
                    <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                      <a href={p.projectUrl} target="_blank" rel="noreferrer" className="pf-project-link">
                        Démo live
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CERTIFICATIONS ── */}
        {certifications.length > 0 && (
          <section className="pf-section" id="certifications">
            <SectionHeader num="04" title="Certifications" />
            <div className="pf-certs-grid">
              {certifications.map(cert => (
                <div key={cert.certificationId} className="pf-cert-card">
                  <div className="pf-cert-issuer">{cert.issuer}</div>
                  <div className="pf-cert-name">{cert.name}</div>
                  <div className="pf-cert-meta">{fmtDate(cert.issueDate)}</div>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="pf-cert-link">
                      Voir le credential →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="pf-footer">
          <div className="pf-footer-left">
            {c.firstName} {c.lastName} · Profil {TECH_LABELS[data.targetTech] ?? data.targetTech}
          </div>
          <div className="pf-footer-right">
            Présenté par <span>TRIWEB</span>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PublicPortfolioViewPage;