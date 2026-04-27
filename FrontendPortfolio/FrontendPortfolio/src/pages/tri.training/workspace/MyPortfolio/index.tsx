// pages/MyPortfolio/index.tsx
import { useEffect, useRef, useState } from 'react';
import { useRedux } from '../../../../hooks';
import { LoadMyPortfolios, LoadPortfolio, LoadPortfolioBySlug, SelectPortfolio } from '../../../../Redux/portfolio/actions';
import { GetMe } from '../../../../Redux/collaborator/actions';
import { useParams } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
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

  .pf-root {
    background: var(--paper);
    color: var(--ink);
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* ── NAV ── */
  .pf-nav {
    position: sticky; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px 60px;
    background: var(--paper);
    border-bottom: 1px solid var(--line);
  }
  .pf-nav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 15px; letter-spacing: 3px;
    text-transform: uppercase; color: var(--ink);
  }
  .pf-nav-logo span { color: var(--accent); }
  .pf-nav-links { display: flex; gap: 32px; list-style: none; }
  .pf-nav-links a {
    text-decoration: none; color: var(--muted); font-size: 11px;
    letter-spacing: 2px; text-transform: uppercase; transition: color .2s;
  }
  .pf-nav-links a:hover { color: var(--ink); }
  .pf-nav-badge {
    font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
    background: var(--ink); color: var(--paper);
    padding: 4px 12px; border-radius: 2px;
  }

  /* ── HERO ── */
  .pf-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: calc(100vh - 57px);
  }
  .pf-hero-left {
    padding: 80px 60px;
    display: flex; flex-direction: column; justify-content: center;
    border-right: 1px solid var(--line);
    animation: fadeUp .7s ease forwards;
  }
  .pf-hero-right {
    padding: 80px 60px;
    display: flex; flex-direction: column; justify-content: center;
    animation: fadeUp .7s .2s ease both;
  }

  .pf-hero-tag {
    font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 24px;
    display: flex; align-items: center; gap: 10px;
  }
  .pf-hero-tag::before {
    content: ''; display: block;
    width: 30px; height: 1px; background: var(--accent);
  }

  .pf-hero-name {
    font-family: 'Fraunces', serif;
    font-size: clamp(52px, 6vw, 88px);
    font-weight: 300; line-height: 1.0;
    letter-spacing: -2px;
    margin-bottom: 8px;
  }
  .pf-hero-name em { font-style: italic; color: var(--accent); }

  .pf-hero-jobtitle {
    font-family: 'Syne', sans-serif;
    font-size: 13px; letter-spacing: 4px;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 40px; margin-top: 12px;
  }

  .pf-hero-bio {
    font-size: 13px; line-height: 1.9;
    color: #3a3830; max-width: 440px;
    margin-bottom: 48px;
  }

  .pf-hero-cta { display: flex; gap: 16px; flex-wrap: wrap; }

  .pf-btn-primary {
    background: var(--ink); color: var(--paper);
    padding: 14px 32px; font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    border: none; cursor: pointer; text-decoration: none;
    transition: background .2s, transform .1s; display: inline-block;
  }
  .pf-btn-primary:hover { background: var(--accent); transform: translateY(-1px); }

  .pf-btn-outline {
    border: 1px solid var(--ink); color: var(--ink);
    padding: 14px 32px; font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; text-decoration: none; background: transparent;
    transition: all .2s; display: inline-block;
  }
  .pf-btn-outline:hover { background: var(--ink); color: var(--paper); }

  /* Availability card */
  .pf-avail-card {
    background: var(--ink); color: var(--paper);
    padding: 28px 32px; margin-bottom: 32px;
  }
  .pf-avail-label {
    font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--muted); margin-bottom: 10px;
  }
  .pf-avail-status {
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 700;
    display: flex; align-items: center; gap: 10px;
  }
  .pf-avail-sub {
    font-size: 11px; color: #888; margin-top: 10px; letter-spacing: 1px;
  }
  .pf-dot-green {
    width: 10px; height: 10px; border-radius: 50%;
    background: #4ade80; flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(74,222,128,.2);
    animation: pulse 2s infinite;
  }
  .pf-dot-orange {
    width: 10px; height: 10px; border-radius: 50%;
    background: #f97316; flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(249,115,22,.2);
  }
  .pf-dot-muted {
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--muted); flex-shrink: 0;
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(74,222,128,.2); }
    50%      { box-shadow: 0 0 0 7px rgba(74,222,128,.08); }
  }

  /* Stats grid */
  .pf-stats-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
    background: var(--line); border: 1px solid var(--line);
  }
  .pf-stat-box {
    background: var(--card); padding: 24px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .pf-stat-num {
    font-family: 'Fraunces', serif;
    font-size: 40px; font-weight: 300; line-height: 1;
    color: var(--ink);
  }
  .pf-stat-label {
    font-size: 10px; letter-spacing: 2px;
    text-transform: uppercase; color: var(--muted);
  }

  /* Avatar in hero-right */
  .pf-avatar-wrapper {
    width: 120px; height: 120px; border-radius: 50%;
    overflow: hidden; border: 3px solid var(--line);
    margin-bottom: 24px; flex-shrink: 0;
  }
  .pf-avatar-wrapper img { width: 100%; height: 100%; object-fit: cover; }

  /* Social links */
  .pf-social-links {
    display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px;
  }
  .pf-social-link {
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--muted); text-decoration: none; border-bottom: 1px solid var(--line);
    padding-bottom: 2px; transition: all .2s;
  }
  .pf-social-link:hover { color: var(--accent); border-color: var(--accent); }

  /* ── SECTION LAYOUT ── */
  .pf-section { padding: 80px 60px; }
  .pf-section + .pf-section { border-top: 1px solid var(--line); }

  .pf-section-header {
    display: flex; align-items: baseline; gap: 20px;
    margin-bottom: 56px;
  }
  .pf-section-num {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: var(--accent); letter-spacing: 2px;
  }
  .pf-section-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 300; letter-spacing: -1px;
  }
  .pf-section-line { flex: 1; height: 1px; background: var(--line); }

  /* ── SKILLS ── */
  .pf-skills-layout {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 2px; background: var(--line);
  }
  .pf-skill-card {
    background: var(--card); padding: 28px 24px;
    transition: background .2s, color .2s; cursor: default;
  }
  .pf-skill-card:hover { background: var(--ink); color: var(--paper); }
  .pf-skill-card:hover .pf-skill-cat { color: #999; }
  .pf-skill-card:hover .pf-skill-track { background: #333; }
  .pf-skill-card:hover .pf-skill-fill { background: var(--accent); }
  .pf-skill-card:hover .pf-skill-years { color: #999; }
  .pf-skill-card:hover .pf-badge-expert { border-color: var(--accent); color: var(--accent); }

  .pf-skill-name {
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700; margin-bottom: 4px;
  }
  .pf-skill-cat {
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--muted); margin-bottom: 16px;
  }
  .pf-skill-track {
    height: 2px; background: var(--line); border-radius: 1px;
  }
  .pf-skill-fill {
    height: 100%; border-radius: 1px;
    background: var(--accent2); transition: width .6s ease;
  }
  .pf-skill-years {
    font-size: 10px; color: var(--muted); margin-top: 8px; letter-spacing: 1px;
  }
  .pf-badge-expert {
    display: inline-block; margin-top: 6px;
    font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
    padding: 3px 8px;
    border: 1px solid var(--accent);
    color: var(--accent); border-radius: 2px;
  }

  /* ── TIMELINE ── */
  .pf-timeline { position: relative; padding-left: 40px; }
  .pf-timeline::before {
    content: ''; position: absolute;
    left: 8px; top: 12px; bottom: 0;
    width: 1px; background: var(--line);
  }
  .pf-tl-item {
    position: relative; margin-bottom: 52px;
    opacity: 0; transform: translateY(20px);
    transition: opacity .5s ease, transform .5s ease;
  }
  .pf-tl-item.visible { opacity: 1; transform: none; }
  .pf-tl-dot {
    position: absolute; left: -40px; top: 6px;
    width: 16px; height: 16px;
    border: 1px solid var(--line);
    background: var(--paper);
    display: flex; align-items: center; justify-content: center;
  }
  .pf-tl-dot::after {
    content: ''; width: 6px; height: 6px; background: var(--accent);
  }
  .pf-tl-date {
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px;
  }
  .pf-tl-role {
    font-family: 'Syne', sans-serif;
    font-size: 17px; font-weight: 700; margin-bottom: 4px;
  }
  .pf-tl-company {
    font-size: 12px; color: var(--muted); margin-bottom: 14px; letter-spacing: 1px;
  }
  .pf-tl-desc {
    font-size: 13px; line-height: 1.8;
    color: #3a3830; max-width: 680px; margin-bottom: 14px;
  }
  .pf-tl-techs { display: flex; flex-wrap: wrap; gap: 6px; }
  .pf-tech-pill {
    font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 4px 10px;
    border: 1px solid var(--line);
    color: var(--muted); border-radius: 2px;
  }
  .pf-contract-badge {
    display: inline-block; font-size: 9px; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 3px 8px;
    border: 1px solid rgba(196,26,26,.3);
    color: var(--accent); border-radius: 2px; margin-left: 10px;
  }

  /* ── PROJECTS ── */
  .pf-projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 2px; background: var(--line);
  }
  .pf-project-card {
    background: var(--card); padding: 32px;
    display: flex; flex-direction: column; gap: 14px;
    transition: background .2s; position: relative; overflow: hidden;
  }
  .pf-project-card:hover { background: var(--ink); color: var(--paper); }
  .pf-project-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--accent);
    transform: scaleX(0); transform-origin: left;
    transition: transform .3s ease;
  }
  .pf-project-card:hover::before { transform: scaleX(1); }
  .pf-project-card:hover .pf-project-desc { color: #aaa; }
  .pf-project-card:hover .pf-project-link { color: var(--accent); }
  .pf-project-card:hover .pf-tech-pill { border-color: #333; color: #888; }
  .pf-project-screenshot {
    width: 100%; height: 180px; object-fit: cover;
    border: 1px solid var(--line); display: block;
  }
  .pf-project-screenshot-placeholder {
    width: 100%; height: 180px;
    background: var(--line);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: var(--muted); letter-spacing: 1px;
  }
  .pf-project-num {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: var(--accent); letter-spacing: 2px;
  }
  .pf-project-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 700; line-height: 1.2;
  }
  .pf-project-desc {
    font-size: 12px; line-height: 1.8;
    color: #4a4640;
  }
  .pf-project-links { display: flex; gap: 10px; flex-wrap: wrap; margin-top: auto; }
  .pf-project-link {
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--accent); text-decoration: none;
    display: flex; align-items: center; gap: 6px;
    transition: gap .2s;
    border-bottom: 1px solid transparent;
    padding-bottom: 1px;
  }
  .pf-project-link::after { content: '→'; }
  .pf-project-link:hover { gap: 12px; border-color: var(--accent); }
  .pf-featured-tag {
    display: inline-block; font-size: 9px; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 3px 8px;
    border: 1px solid rgba(196,26,26,.3);
    color: var(--accent); border-radius: 2px; white-space: nowrap;
  }

  /* ── EDUCATION ── */
  /* reuses .pf-timeline */

  /* ── CERTIFICATIONS ── */
  .pf-certs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 2px; background: var(--line);
  }
  .pf-cert-card {
    background: var(--card); padding: 28px;
    transition: all .2s;
  }
  .pf-cert-card:hover { background: var(--ink); color: var(--paper); }
  .pf-cert-card:hover .pf-cert-meta { color: #888; }
  .pf-cert-card:hover .pf-cert-score { color: #4ade80; }
  .pf-cert-issuer {
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 10px;
  }
  .pf-cert-name {
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700; margin-bottom: 16px; line-height: 1.4;
  }
  .pf-cert-meta {
    font-size: 11px; color: var(--muted); letter-spacing: 1px;
  }
  .pf-cert-score {
    font-family: 'Fraunces', serif;
    font-size: 32px; font-weight: 300;
    margin-top: 12px; color: var(--accent2);
  }
  .pf-cert-link {
    font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--accent); text-decoration: none; margin-top: 8px;
    display: inline-block;
    border-bottom: 1px solid transparent;
    transition: border-color .2s;
  }
  .pf-cert-link:hover { border-color: var(--accent); }

  /* ── PORTFOLIO SWITCHER ── */
  .pf-switcher {
    position: fixed; bottom: 1.5rem; right: 1.5rem;
    background: var(--paper);
    border: 1px solid var(--line);
    padding: 10px 14px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,.12);
    z-index: 200;
  }
  .pf-switcher-label {
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--muted);
  }
  .pf-switcher select {
    background: var(--card);
    border: 1px solid var(--line);
    color: var(--ink);
    font-size: 11px;
    padding: 4px 8px;
    font-family: 'DM Mono', monospace;
    cursor: pointer;
  }
  .pf-switcher-edit {
    font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    border-bottom: 1px solid var(--line);
    padding-bottom: 1px; transition: color .2s, border-color .2s;
  }
  .pf-switcher-edit:hover { color: var(--accent); border-color: var(--accent); }

  /* ── FOOTER ── */
  .pf-footer {
    border-top: 1px solid var(--line);
    padding: 32px 60px;
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 12px;
  }
  .pf-footer-left { font-size: 11px; color: var(--muted); letter-spacing: 1px; }
  .pf-footer-right {
    font-size: 10px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase;
  }
  .pf-footer-right span { color: var(--accent); }

  /* ── EMPTY / LOADING ── */
  .pf-spinner {
    display: flex; align-items: center; justify-content: center;
    height: 100vh; background: var(--paper);
  }
  .pf-spinner-ring {
    width: 36px; height: 36px;
    border: 2px solid var(--line);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .pf-no-data {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; height: 100vh; background: var(--paper);
    color: var(--muted); text-align: center; padding: 2rem;
  }
  .pf-no-data h2 {
    font-family: 'Fraunces', serif; font-weight: 300; font-size: 2rem;
    color: var(--ink); margin-bottom: 1rem; letter-spacing: -1px;
  }
  .pf-no-data a {
    display: inline-block; margin-top: 1.5rem; padding: 14px 32px;
    background: var(--ink); color: var(--paper); text-decoration: none;
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    font-family: 'DM Mono', monospace; transition: background .2s;
  }
  .pf-no-data a:hover { background: var(--accent); }

  .pf-empty {
    text-align: center; padding: 5rem 2rem;
    font-size: 13px; color: var(--muted); letter-spacing: 1px;
  }
  .pf-empty-icon { font-size: 2.5rem; margin-bottom: 1rem; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .pf-hero { grid-template-columns: 1fr; }
    .pf-hero-left { border-right: none; border-bottom: 1px solid var(--line); }
    .pf-nav { padding: 16px 24px; }
    .pf-section { padding: 60px 24px; }
    .pf-footer { padding: 24px; }
    .pf-nav-links { display: none; }
  }
`;

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const fmtDate = (d?: string | null) => {
  if (!d) return '';
  const [y, m] = d.slice(0, 7).split('-');
  const months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
};

const levelPct = (level: string) => {
  const l = level?.toLowerCase() ?? '';
  if (l.includes('expert')) return 95;
  if (l.includes('avancé') || l.includes('avance') || l.includes('senior')) return 80;
  if (l.includes('inter') || l.includes('mid')) return 65;
  return 40;
};

const avatarUrl = (first: string, last: string, url?: string) =>
  url || `https://ui-avatars.com/api/?name=${encodeURIComponent(first + '+' + last)}&background=0a0a0f&color=f5f2eb&size=200`;

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const SectionHeader = ({ num, title }: { num: string; title: string }) => (
  <div className="pf-section-header">
    <span className="pf-section-num">{num} —</span>
    <h2 className="pf-section-title">{title}</h2>
    <div className="pf-section-line" />
  </div>
);

const SkillsSection = ({ visibleSkills, collab }: { visibleSkills: any[]; collab: any }) => {
  if (!visibleSkills.length) return null;
  const skillMap = new Map(collab.collaboratorSkills.map((s: any) => [s.collabSkillId, s]));

  return (
    <section className="pf-section" id="skills">
      <SectionHeader num="01" title="Compétences" />
      <div className="pf-skills-layout">
        {visibleSkills.map((ps: any) => {
          const s = skillMap.get(ps.collabSkillId) as any;
          if (!s) return null;
          const pct = levelPct(s.level);
          const isExpert = s.level?.toLowerCase().includes('expert');
          return (
            <div key={ps.collabSkillId} className="pf-skill-card">
              <div className="pf-skill-name">{s.skill?.name ?? '?'}</div>
              <div className="pf-skill-cat">
                {s.isPrimary ? 'Primaire' : 'Secondaire'}
                {s.level ? ` · ${s.level}` : ''}
              </div>
              <div className="pf-skill-track">
                <div className="pf-skill-fill" style={{ width: `${pct}%` }} />
              </div>
              {s.yearsUsed > 0 && (
                <div className="pf-skill-years">{s.yearsUsed} an{s.yearsUsed > 1 ? 's' : ''}</div>
              )}
              {isExpert && <span className="pf-badge-expert">Expert</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const ExperiencesSection = ({ visibleExperiences, collab }: { visibleExperiences: any[]; collab: any }) => {
  if (!visibleExperiences.length) return null;
  const expMap = new Map(collab.experiences.map((e: any) => [e.experienceId, e]));

  return (
    <section className="pf-section" id="experience">
      <SectionHeader num="02" title="Parcours" />
      <div className="pf-timeline">
        {[...visibleExperiences]
          .sort((a: any, b: any) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0))
          .map((pe: any) => {
            const e = expMap.get(pe.experienceId) as any;
            if (!e) return null;
            const dateStr = [fmtDate(e.startDate), e.isCurrent ? 'Présent' : fmtDate(e.endDate)]
              .filter(Boolean).join(' — ');
            return (
              <div key={pe.experienceId} className="pf-tl-item visible">
                <div className="pf-tl-dot" />
                <div className="pf-tl-date">
                  {dateStr}{e.location ? ` · ${e.location}` : ''}
                </div>
                <div className="pf-tl-role">
                  {e.jobTitle}
                  {e.contractType && <span className="pf-contract-badge">{e.contractType}</span>}
                </div>
                <div className="pf-tl-company">{e.companyName}</div>
                {e.description && <div className="pf-tl-desc">{e.description}</div>}
                {e.technologies && (
                  <div className="pf-tl-techs">
                    {e.technologies.split(',').map((t: string) => (
                      <span key={t.trim()} className="pf-tech-pill">{t.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
};

const ProjectsSection = ({ visibleProjects, collab }: { visibleProjects: any[]; collab: any }) => {
  if (!visibleProjects.length) return null;
  const projMap = new Map(collab.projects.map((p: any) => [p.projectId, p]));

  return (
    <section className="pf-section" id="projects">
      <SectionHeader num="03" title="Projets réalisés" />
      <div className="pf-projects-grid">
        {visibleProjects.map((pp: any, idx: number) => {
          const p = projMap.get(pp.projectId) as any;
          if (!p) return null;
          return (
            <div key={pp.projectId} className="pf-project-card">
              {/* Screenshot */}
              {p.screenshotUrl ? (
                <img
                  src={p.screenshotUrl}
                  alt={p.title}
                  className="pf-project-screenshot"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="pf-project-screenshot-placeholder">
                  Aperçu non disponible
                </div>
              )}

              <div className="pf-project-num">{String(idx + 1).padStart(2, '0')}</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="pf-project-title">{p.title}</div>
                {p.isFeatured && <span className="pf-featured-tag">Featured</span>}
              </div>

              {p.technologies && (
                <div className="pf-tl-techs">
                  {p.technologies.split(',').map((t: string) => (
                    <span key={t.trim()} className="pf-tech-pill">{t.trim()}</span>
                  ))}
                </div>
              )}

              {p.description && <div className="pf-project-desc">{p.description}</div>}

              {(p.projectUrl || p.githubUrl) && (
                <div className="pf-project-links">
                  {p.projectUrl && (
                    <a href={p.projectUrl} target="_blank" rel="noreferrer" className="pf-project-link">
                      Démo live
                    </a>
                  )}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" className="pf-project-link">
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const EducationSection = ({ visibleEducations, collab }: { visibleEducations: any[]; collab: any }) => {
  if (!visibleEducations.length) return null;
  const eduMap = new Map(collab.educations.map((e: any) => [e.educationId, e]));

  return (
    <section className="pf-section" id="education">
      <SectionHeader num="04" title="Formation" />
      <div className="pf-timeline">
        {visibleEducations.map((pe: any) => {
          const ed = eduMap.get(pe.educationId) as any;
          if (!ed) return null;
          const dateStr = [fmtDate(ed.startDate), ed.isCurrent ? 'Présent' : fmtDate(ed.endDate)]
            .filter(Boolean).join(' — ');
          return (
            <div key={pe.educationId} className="pf-tl-item visible">
              <div className="pf-tl-dot" />
              <div className="pf-tl-date">{dateStr}</div>
              <div className="pf-tl-role">{ed.degree}{ed.field ? ` — ${ed.field}` : ''}</div>
              <div className="pf-tl-company">{ed.school}</div>
              {ed.grade && (
                <div style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 24, fontWeight: 300, color: 'var(--accent2)', marginTop: 8
                }}>{ed.grade}</div>
              )}
              {ed.description && <div className="pf-tl-desc" style={{ marginTop: 8 }}>{ed.description}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const CertificationsSection = ({ visibleCerts, collab }: { visibleCerts: any[]; collab: any }) => {
  if (!visibleCerts.length) return null;
  const certMap = new Map(collab.certifications.map((c: any) => [c.certificationId, c]));

  return (
    <section className="pf-section" id="certifications">
      <SectionHeader num="05" title="Certifications" />
      <div className="pf-certs-grid">
        {visibleCerts.map((pc: any) => {
          const c = certMap.get(pc.certificationId) as any;
          if (!c) return null;
          return (
            <div key={pc.certificationId} className="pf-cert-card">
              <div className="pf-cert-issuer">{c.issuer}</div>
              <div className="pf-cert-name">{c.name}</div>
              <div className="pf-cert-meta">{fmtDate(c.issueDate)}</div>
              {c.score != null && (
                <div className="pf-cert-score">
                  {c.score}<span style={{ fontSize: 16 }}>%</span>
                </div>
              )}
              {c.credentialUrl && (
                <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="pf-cert-link">
                  Voir le credential →
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   Main portfolio view
───────────────────────────────────────────── */
const PortfolioView = ({ portfolio, collab }: { portfolio: any; collab: any }) => {
  const visibleSkills      = portfolio.portfolioSkills?.filter((ps: any) => ps.isVisible) ?? [];
  const visibleExperiences = portfolio.portfolioExperiences?.filter((pe: any) => pe.isVisible) ?? [];
  const visibleEducations  = portfolio.portfolioEducations?.filter((pe: any) => pe.isVisible) ?? [];
  const visibleCerts       = portfolio.portfolioCertifications?.filter((pc: any) => pc.isVisible) ?? [];
  const visibleProjects    = portfolio.portfolioProjects?.filter((pp: any) => pp.isVisible) ?? [];

  const user = collab.user;
  const av   = avatarUrl(user?.firstName ?? '', user?.lastName ?? '', user?.avatarUrl);

  const navLinks = [
    { href: '#skills',          label: 'Compétences',   show: visibleSkills.length > 0 },
    { href: '#experience',      label: 'Parcours',      show: visibleExperiences.length > 0 },
    { href: '#projects',        label: 'Projets',       show: visibleProjects.length > 0 },
    { href: '#education',       label: 'Formation',     show: visibleEducations.length > 0 },
    { href: '#certifications',  label: 'Certifications',show: visibleCerts.length > 0 },
  ].filter(l => l.show);

  const availStatus = collab.availabilityStatus;
  const availLabel  =
    availStatus === 'available' ? 'Disponible' :
    availStatus === 'soon'      ? 'Bientôt disponible' :
                                  'Non disponible';
  const availDot    =
    availStatus === 'available' ? 'pf-dot-green' :
    availStatus === 'soon'      ? 'pf-dot-orange' : 'pf-dot-muted';

  // Intersection observer for timeline items
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 120);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.pf-tl-item:not(.visible)').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const hasAnything = visibleSkills.length || visibleExperiences.length ||
    visibleProjects.length || visibleCerts.length || visibleEducations.length;

  const firstNameLower = user?.firstName?.toLowerCase().replace(/\s/g, '') ?? 'dev';
  const lastNameParts  = user?.lastName?.split(' ') ?? [];

  return (
    <div className="pf-root">

      {/* NAV */}
      <nav className="pf-nav">
        <div className="pf-nav-logo">
          <span>TRIWEB</span>
        </div>
        <ul className="pf-nav-links">
          {navLinks.map(l => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
          {collab.linkedinUrl && (
            <li><a href={collab.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a></li>
          )}
        </ul>
        <div className="pf-nav-badge">{portfolio.title}</div>
      </nav>

      {/* HERO */}
      <div className="pf-hero">

        {/* Left */}
        <div className="pf-hero-left">
          <div className="pf-hero-tag">
            {portfolio.targetClient ? `Pour ${portfolio.targetClient}` : 'Portfolio professionnel'}
          </div>

          <h1 className="pf-hero-name">
            {user?.firstName}<br />
            <em>{user?.lastName}</em>
          </h1>

          <div className="pf-hero-jobtitle">
            {collab.jobTitle ?? 'Développeur'}
            {collab.yearsExperience > 0 && ` · ${collab.yearsExperience} ans exp.`}
          </div>

          {collab.bio && <p className="pf-hero-bio">{collab.bio}</p>}

          <div className="pf-hero-cta">
            {visibleProjects.length > 0 && (
              <a href="#projects" className="pf-btn-primary">Voir les projets</a>
            )}
            {collab.linkedinUrl && (
              <a href={collab.linkedinUrl} target="_blank" rel="noreferrer" className="pf-btn-outline">
                Contacter
              </a>
            )}
          </div>

          {(collab.githubUrl || collab.linkedinUrl || portfolio.publicSlug) && (
            <div className="pf-social-links">
              {collab.githubUrl && (
                <a href={collab.githubUrl} target="_blank" rel="noreferrer" className="pf-social-link">
                  GitHub ↗
                </a>
              )}
              {collab.linkedinUrl && (
                <a href={collab.linkedinUrl} target="_blank" rel="noreferrer" className="pf-social-link">
                  LinkedIn ↗
                </a>
              )}
              {portfolio.publicSlug && (
                <a
                  href={`${window.location.origin}/api/portfolio/public/${portfolio.publicSlug}`}
                  target="_blank" rel="noreferrer" className="pf-social-link"
                >
                  Vue publique ↗
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="pf-hero-right">
          {/* Avatar */}
          <div className="pf-avatar-wrapper">
            <img
              src={av}
              alt={`${user?.firstName} ${user?.lastName}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://ui-avatars.com/api/?name=?&background=0a0a0f&color=f5f2eb&size=200';
              }}
            />
          </div>

          {/* Availability */}
          <div className="pf-avail-card">
            <div className="pf-avail-label">Disponibilité</div>
            <div className="pf-avail-status">
              <div className={availDot} />
              {availLabel}
            </div>
            <div className="pf-avail-sub">
              {portfolio.targetClient ? `Dossier : ${portfolio.targetClient}` : 'Ouvert aux opportunités'}
            </div>
          </div>

          {/* Stats */}
          <div className="pf-stats-grid">
            {collab.yearsExperience > 0 && (
              <div className="pf-stat-box">
                <div className="pf-stat-num">{collab.yearsExperience}</div>
                <div className="pf-stat-label">Ans d'exp.</div>
              </div>
            )}
            {visibleProjects.length > 0 && (
              <div className="pf-stat-box">
                <div className="pf-stat-num">{visibleProjects.length}</div>
                <div className="pf-stat-label">Projets</div>
              </div>
            )}
            {visibleCerts.length > 0 && (
              <div className="pf-stat-box">
                <div className="pf-stat-num">{visibleCerts.length}</div>
                <div className="pf-stat-label">Certifications</div>
              </div>
            )}
            <div className="pf-stat-box">
              <div className="pf-stat-num" style={{ color: 'var(--accent2)', fontSize: 28 }}>
                {portfolio.viewCount ?? 0}
              </div>
              <div className="pf-stat-label">Vues</div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTIONS */}
      {hasAnything ? (
        <>
          <SkillsSection visibleSkills={visibleSkills} collab={collab} />
          <ExperiencesSection visibleExperiences={visibleExperiences} collab={collab} />
          <ProjectsSection visibleProjects={visibleProjects} collab={collab} />
          <EducationSection visibleEducations={visibleEducations} collab={collab} />
          <CertificationsSection visibleCerts={visibleCerts} collab={collab} />
        </>
      ) : (
        <div className="pf-empty">
          <div className="pf-empty-icon">📭</div>
          <p>Aucun élément à afficher.</p>
          <p style={{ marginTop: 8 }}>
            Va dans{' '}
            <a href="/portfolio-builder" style={{ color: 'var(--accent)' }}>
              Portfolio Builder
            </a>{' '}
            pour sélectionner ce qui s'affiche.
          </p>
        </div>
      )}

      {/* FOOTER */}
      <footer className="pf-footer">
        <div className="pf-footer-left">
          © {new Date().getFullYear()} {user?.firstName} {user?.lastName} · {portfolio.title}
        </div>
        <div className="pf-footer-right">
          {portfolio.viewCount ?? 0} vue(s) · <span>{portfolio.publicSlug ?? 'privé'}</span>
        </div>
      </footer>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Page wrapper
───────────────────────────────────────────── */
const MyPortfolioPage = () => {
  const { dispatch, appSelector } = useRedux();
  const { slug } = useParams<{ slug?: string }>(); // ✅ lire le slug si présent
  const hasFetched = useRef(false);

  const collab           = appSelector((state: any) => state.Collaborator?.collab ?? null);
  const portfolios       = appSelector((state: any) => state.Portfolio?.portfolios ?? []);
  const selectedPortfolioId = appSelector((state: any) => state.Portfolio?.selectedPortfolioId ?? null);
  const currentPortfolio = appSelector((state: any) => state.Portfolio?.currentPortfolio ?? null);
  const loading          = appSelector((state: any) => state.Portfolio?.loading ?? false);

  const isPublicMode = !!slug; // ✅ mode public si slug dans l'URL

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (isPublicMode) {
      // ✅ Mode manager — charger via slug directement
      dispatch(LoadPortfolioBySlug(slug!));
    } else {
      // ✅ Mode collab — charger ses propres portfolios
      dispatch(GetMe());
      dispatch(LoadMyPortfolios());
    }
  }, [slug]); // eslint-disable-line

  useEffect(() => {
    if (isPublicMode) return; // pas besoin en mode public
    if (!selectedPortfolioId) return;
    if (currentPortfolio?.portfolioId === selectedPortfolioId) return;
    dispatch(LoadPortfolio(selectedPortfolioId));
  }, [selectedPortfolioId]); // eslint-disable-line

  const isInitialLoad = loading && !currentPortfolio && portfolios.length === 0;

  if (isInitialLoad) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="pf-spinner"><div className="pf-spinner-ring" /></div>
      </>
    );
  }

  if (!loading && !currentPortfolio && (isPublicMode || portfolios.length === 0)) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="pf-no-data">
          <h2>{isPublicMode ? 'Portfolio introuvable' : 'Aucun portfolio trouvé'}</h2>
          <p style={{ maxWidth: 400, fontSize: 13, marginTop: 8 }}>
            {isPublicMode
              ? 'Ce portfolio n\'existe pas ou n\'est plus disponible.'
              : 'Tu n\'as pas encore de portfolio. Crée-en un dans le Portfolio Builder.'}
          </p>
          {!isPublicMode && <a href="/portfolio-builder">Créer mon portfolio →</a>}
        </div>
      </>
    );
  }

  // ✅ En mode public, collab vient du portfolio chargé
  const effectiveCollab = isPublicMode
    ? currentPortfolio?.collaborator
    : collab;

  return (
    <>
      <style>{STYLES}</style>

      {currentPortfolio && effectiveCollab ? (
        <PortfolioView portfolio={currentPortfolio} collab={effectiveCollab} />
      ) : (
        <div className="pf-spinner"><div className="pf-spinner-ring" /></div>
      )}

      {/* Switcher seulement en mode collab avec plusieurs portfolios */}
      {!isPublicMode && portfolios.length > 1 && (
        <div className="pf-switcher">
          <span className="pf-switcher-label">Portfolio</span>
          <select
            value={selectedPortfolioId ?? ''}
            onChange={(e) => dispatch(SelectPortfolio(Number(e.target.value)))}
          >
            {portfolios.map((p: any) => (
              <option key={p.portfolioId} value={p.portfolioId}>
                {p.title}{p.targetClient ? ` — ${p.targetClient}` : ''}
              </option>
            ))}
          </select>
          <a href="/portfolio-builder" className="pf-switcher-edit">✏ Éditer</a>
        </div>
      )}
    </>
  );
};

export default MyPortfolioPage;