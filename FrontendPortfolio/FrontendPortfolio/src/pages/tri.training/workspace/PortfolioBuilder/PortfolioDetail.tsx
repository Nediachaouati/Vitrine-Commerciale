import { useEffect, useState } from 'react';
import { useRedux } from '../../../../hooks';
import {
  LoadPortfolio,
  SetPortfolioSkills,
  SetPortfolioExperiences,
  SetPortfolioEducation,
  SetPortfolioCertifications,
  SetPortfolioProjects,
} from '../../../../Redux/portfolio/actions';
import type { CollaboratorFull, PortfolioItem, PortfolioItemDto } from '../../../../helpers/model/dto/collaborator.dto';

interface Props {
  collab: CollaboratorFull;
  portfolio: PortfolioItem;
}

type Tab = 'skills' | 'experiences' | 'education' | 'certifications' | 'projects';

const PortfolioDetail = ({ collab, portfolio }: Props) => {
  const { dispatch, appSelector } = useRedux();
  const [activeTab, setActiveTab] = useState<Tab>('skills');

  const { currentPortfolio, loading, isSaving } = appSelector((state: any) => state.Portfolio);

  useEffect(() => {
    dispatch(LoadPortfolio(portfolio.portfolioId));
  }, [portfolio.portfolioId, dispatch]);

  const getVisibleMap = (type: Tab): Map<number, boolean> => {
    if (!currentPortfolio) return new Map();
    const map = new Map<number, boolean>();
    switch (type) {
      case 'skills':
        currentPortfolio.portfolioSkills?.forEach((ps: any) => map.set(ps.collabSkillId, ps.isVisible));
        break;
      case 'experiences':
        currentPortfolio.portfolioExperiences?.forEach((pe: any) => map.set(pe.experienceId, pe.isVisible));
        break;
      case 'education':
        currentPortfolio.portfolioEducations?.forEach((pe: any) => map.set(pe.educationId, pe.isVisible));
        break;
      case 'certifications':
        currentPortfolio.portfolioCertifications?.forEach((pc: any) => map.set(pc.certificationId, pc.isVisible));
        break;
      case 'projects':
        currentPortfolio.portfolioProjects?.forEach((pp: any) => map.set(pp.projectId, pp.isVisible));
        break;
    }
    return map;
  };

  const getPortfolioItems = (type: Tab): PortfolioItemDto[] => {
    if (!currentPortfolio) return [];
    switch (type) {
      case 'skills':
        return currentPortfolio.portfolioSkills?.map((ps: any) => ({ id: ps.collabSkillId, isVisible: ps.isVisible, displayOrder: ps.displayOrder })) ?? [];
      case 'experiences':
        return currentPortfolio.portfolioExperiences?.map((pe: any) => ({ id: pe.experienceId, isVisible: pe.isVisible, displayOrder: pe.displayOrder })) ?? [];
      case 'education':
        return currentPortfolio.portfolioEducations?.map((pe: any) => ({ id: pe.educationId, isVisible: pe.isVisible, displayOrder: pe.displayOrder })) ?? [];
      case 'certifications':
        return currentPortfolio.portfolioCertifications?.map((pc: any) => ({ id: pc.certificationId, isVisible: pc.isVisible, displayOrder: pc.displayOrder })) ?? [];
      case 'projects':
        return currentPortfolio.portfolioProjects?.map((pp: any) => ({ id: pp.projectId, isVisible: pp.isVisible, displayOrder: pp.displayOrder })) ?? [];
    }
  };

  const handleToggle = (type: Tab, id: number) => {
    const items = getPortfolioItems(type);
    const exists = items.findIndex((i) => i.id === id);
    let updated: PortfolioItemDto[];
    if (exists === -1) {
      updated = [...items, { id, isVisible: true, displayOrder: items.length }];
    } else {
      updated = items.map((i) => i.id === id ? { ...i, isVisible: !i.isVisible } : i);
    }
    const dto = { items: updated };
    switch (type) {
      case 'skills':         dispatch(SetPortfolioSkills(portfolio.portfolioId, dto)); break;
      case 'experiences':    dispatch(SetPortfolioExperiences(portfolio.portfolioId, dto)); break;
      case 'education':      dispatch(SetPortfolioEducation(portfolio.portfolioId, dto)); break;
      case 'certifications': dispatch(SetPortfolioCertifications(portfolio.portfolioId, dto)); break;
      case 'projects':       dispatch(SetPortfolioProjects(portfolio.portfolioId, dto)); break;
    }
  };

  const initAllItems = (type: Tab) => {
    let items: PortfolioItemDto[] = [];
    switch (type) {
      case 'skills':
        items = collab.collaboratorSkills.map((s, i) => ({ id: s.collabSkillId, isVisible: true, displayOrder: i }));
        dispatch(SetPortfolioSkills(portfolio.portfolioId, { items })); break;
      case 'experiences':
        items = collab.experiences.map((e, i) => ({ id: e.experienceId, isVisible: true, displayOrder: i }));
        dispatch(SetPortfolioExperiences(portfolio.portfolioId, { items })); break;
      case 'education':
        items = collab.educations.map((e, i) => ({ id: e.educationId, isVisible: true, displayOrder: i }));
        dispatch(SetPortfolioEducation(portfolio.portfolioId, { items })); break;
      case 'certifications':
        items = collab.certifications.map((c, i) => ({ id: c.certificationId, isVisible: true, displayOrder: i }));
        dispatch(SetPortfolioCertifications(portfolio.portfolioId, { items })); break;
      case 'projects':
        items = collab.projects.map((p, i) => ({ id: p.projectId, isVisible: true, displayOrder: i }));
        dispatch(SetPortfolioProjects(portfolio.portfolioId, { items })); break;
    }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'skills',         label: 'Skills',      count: collab.collaboratorSkills.length },
    { key: 'experiences',    label: 'Expériences', count: collab.experiences.length },
    { key: 'education',      label: 'Formation',   count: collab.educations.length },
    { key: 'certifications', label: 'Certifs',     count: collab.certifications.length },
    { key: 'projects',       label: 'Projets',     count: collab.projects.length },
  ];

  const visibleMap     = getVisibleMap(activeTab);
  const portfolioItems = getPortfolioItems(activeTab);
  const isInitialized  = portfolioItems.length > 0;
  const publicUrl      = `${window.location.origin}/api/portfolio/public/${portfolio.publicSlug}`;

  if (loading && !currentPortfolio) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-danger border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold dark:text-white text-base">{portfolio.title}</h2>
          {portfolio.targetClient && (
            <p className="text-xs text-gray-400">Pour : {portfolio.targetClient}</p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {isSaving && (
            <span className="text-xs text-warning animate-pulse">Sauvegarde...</span>
          )}
          <a href={publicUrl} target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm text-xs">
            👁 Voir public
          </a>
          <span className="text-xs text-gray-400 my-auto">{portfolio.viewCount} vues</span>
        </div>
      </div>

      <div className="flex gap-1 mb-4 border-b border-white-light dark:border-[#1b2e4b] pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 text-xs rounded-t font-semibold transition ${
              activeTab === tab.key ? 'bg-danger text-white' : 'text-gray-400 hover:text-danger'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {!isInitialized && !loading && (
        <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-xl flex items-center justify-between">
          <p className="text-xs text-warning">Ce portfolio n'a pas encore de {activeTab} sélectionnés.</p>
          <button onClick={() => initAllItems(activeTab)} className="btn btn-warning btn-sm text-xs ml-3">
            Tout ajouter
          </button>
        </div>
      )}

      <div className="space-y-2">

        {/* SKILLS */}
        {activeTab === 'skills' && collab.collaboratorSkills.map((s) => {
          const isVisible = visibleMap.get(s.collabSkillId) ?? false;
          return (
            <div key={s.collabSkillId} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition ${
              isVisible ? 'border-success/40 bg-success/5' : 'border-white-light dark:border-[#1b2e4b] opacity-50'
            }`}>
              <div>
                <span className="font-semibold text-sm dark:text-white">{s.skill.name}</span>
                <span className="text-xs text-gray-400 ml-2">{s.level} · {s.yearsUsed} an(s)</span>
                {s.isPrimary && <span className="ml-2 text-xs text-warning">★ Principal</span>}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isVisible} disabled={isSaving}
                  onChange={() => handleToggle('skills', s.collabSkillId)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-danger rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-danger" />
              </label>
            </div>
          );
        })}

        {/* EXPERIENCES */}
        {activeTab === 'experiences' && collab.experiences.map((e) => {
          const isVisible = visibleMap.get(e.experienceId) ?? false;
          return (
            <div key={e.experienceId} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition ${
              isVisible ? 'border-success/40 bg-success/5' : 'border-white-light dark:border-[#1b2e4b] opacity-50'
            }`}>
              <div>
                <span className="font-semibold text-sm dark:text-white">{e.jobTitle}</span>
                <span className="text-xs text-gray-400 ml-2">@ {e.companyName}</span>
                <p className="text-xs text-gray-400">{e.startDate} → {e.isCurrent ? 'Présent' : e.endDate}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isVisible} disabled={isSaving}
                  onChange={() => handleToggle('experiences', e.experienceId)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-danger" />
              </label>
            </div>
          );
        })}

        {/* EDUCATION */}
        {activeTab === 'education' && collab.educations.map((ed) => {
          const isVisible = visibleMap.get(ed.educationId) ?? false;
          return (
            <div key={ed.educationId} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition ${
              isVisible ? 'border-success/40 bg-success/5' : 'border-white-light dark:border-[#1b2e4b] opacity-50'
            }`}>
              <div>
                <span className="font-semibold text-sm dark:text-white">{ed.degree} — {ed.field}</span>
                <p className="text-xs text-gray-400">{ed.school} · {ed.startDate} → {ed.isCurrent ? 'En cours' : ed.endDate}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isVisible} disabled={isSaving}
                  onChange={() => handleToggle('education', ed.educationId)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-danger" />
              </label>
            </div>
          );
        })}

        {/* CERTIFICATIONS */}
        {activeTab === 'certifications' && collab.certifications.map((c) => {
          const isVisible = visibleMap.get(c.certificationId) ?? false;
          return (
            <div key={c.certificationId} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition ${
              isVisible ? 'border-success/40 bg-success/5' : 'border-white-light dark:border-[#1b2e4b] opacity-50'
            }`}>
              <div>
                <span className="font-semibold text-sm dark:text-white">{c.name}</span>
                <p className="text-xs text-gray-400">{c.issuer} · {c.issueDate}{c.score ? ` · Score: ${c.score}` : ''}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isVisible} disabled={isSaving}
                  onChange={() => handleToggle('certifications', c.certificationId)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-danger" />
              </label>
            </div>
          );
        })}

        {/* PROJECTS */}
        {activeTab === 'projects' && collab.projects.map((p) => {
          const isVisible = visibleMap.get(p.projectId) ?? false;
          return (
            <div key={p.projectId} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition ${
              isVisible ? 'border-success/40 bg-success/5' : 'border-white-light dark:border-[#1b2e4b] opacity-50'
            }`}>
              <div>
                <span className="font-semibold text-sm dark:text-white">{p.title}</span>
                {p.isFeatured && <span className="ml-2 text-xs text-warning">⭐ Featured</span>}
                <p className="text-xs text-gray-400">{p.technologies}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isVisible} disabled={isSaving}
                  onChange={() => handleToggle('projects', p.projectId)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-danger" />
              </label>
            </div>
          );
        })}

        {activeTab === 'skills' && collab.collaboratorSkills.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">
            Aucun skill dans ton profil. Va dans "Mon Profil" pour en ajouter.
          </p>
        )}

      </div>
    </div>
  );
};

export default PortfolioDetail;