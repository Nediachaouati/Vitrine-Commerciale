// pages/tri.training/workspace/UserProfile/index.tsx
import React, { useEffect, useRef, useState } from 'react';

import { GetMe, AddSkill, UpdateSkill, DeleteSkill, AddExperience, UpdateExperience, DeleteExperience, AddEducation, UpdateEducation, DeleteEducation, AddCertification, UpdateCertification, DeleteCertification, AddProject, UpdateProject, DeleteProject } from '../../../Redux/collaborator/actions';
import { SkillCatalogItem } from '../../../helpers/model/dto/collaborator.dto';
import { useRedux } from '../../../hooks';
import { GetMyProfile, UpdateMyProfile, UploadAvatar } from '../../../Redux/profile/actions';
import { GetSkillCatalogApi } from '../../../helpers/api/SkillCatalogApi';


// ── Types locaux ──────────────────────────────────────────────────────────
type Tab = 'profile' | 'skills' | 'experiences' | 'education' | 'certifications' | 'projects';

const AVAILABILITY_OPTIONS = ['available', 'unavailable', 'soon'];
const CONTRACT_OPTIONS = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'];
const REMOTE_OPTIONS = ['remote', 'onsite', 'hybrid'];
const SKILL_LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
const DEGREE_OPTIONS = ['Licence', 'Master', 'Ingénieur', 'BTS', 'Doctorat', 'Autre'];

// ── Helpers ───────────────────────────────────────────────────────────────
const avatar = (first: string, last: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(first + ' ' + last)}&background=e7515a&color=fff&size=200`;

const formatDate = (d?: string | null) => d?.slice(0, 10) ?? '';

// ── Composant principal ───────────────────────────────────────────────────
const UserProfile = () => {
  const { dispatch, appSelector } = useRedux();
  const hasFetched = useRef(false);
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Redux state
  const profile = appSelector((state: any) => state.Profile?.profile ?? null);
  const profileLoading = appSelector((state: any) => state.Profile?.loading ?? false);
  const profileMsg = appSelector((state: any) => state.Profile?.msg ?? '');
  const profileError = appSelector((state: any) => state.Profile?.error ?? '');

  const collab = appSelector((state: any) => state.Collaborator?.collab ?? null);
  const collabLoading = appSelector((state: any) => state.Collaborator?.loading ?? false);
  const collabMsg = appSelector((state: any) => state.Collaborator?.msg ?? '');

  // Charger les données au montage
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    dispatch(GetMyProfile());
    dispatch(GetMe());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Profil de base' },
    { key: 'skills', label: 'Compétences'},
    { key: 'experiences', label: 'Expériences' },
    { key: 'education', label: 'Formation' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'projects', label: 'Projets' },
  ];

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-danger border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const isCollab = profile?.role === 'COLLABORATEUR';

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Notifications */}
      {(profileMsg || collabMsg) && (
        <div className="mb-4 px-4 py-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm font-semibold">
          ✓ {profileMsg || collabMsg}
        </div>
      )}
      {profileError && (
        <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm">
          ✗ {profileError}
        </div>
      )}

      {/* Header avatar + nom */}
      <div className="flex items-center gap-5 mb-6 p-5 bg-white dark:bg-black rounded-2xl border border-white-light dark:border-[#1b2e4b]">
        <AvatarSection profile={profile} dispatch={dispatch} />
        <div>
          <h1 className="text-xl font-bold dark:text-white">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-sm text-danger font-semibold">{isCollab ? (profile.jobTitle || 'Collaborateur') : profile.role}</p>
          <p className="text-xs text-gray-400">{profile.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          if (!isCollab && tab.key !== 'profile') return null;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.key
                  ? 'bg-danger text-white'
                  : 'bg-white-light dark:bg-[#1b2e4b] text-gray-500 dark:text-gray-400 hover:text-danger'
              }`}
            >
             {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="bg-white dark:bg-black rounded-2xl border border-white-light dark:border-[#1b2e4b] p-5">
        {activeTab === 'profile' && (
          <ProfileTab profile={profile} loading={profileLoading} dispatch={dispatch} />
        )}
        {activeTab === 'skills' && collab && (
          <SkillsTab collab={collab} loading={collabLoading} dispatch={dispatch} />
        )}
        {activeTab === 'experiences' && collab && (
          <ExperiencesTab collab={collab} loading={collabLoading} dispatch={dispatch} />
        )}
        {activeTab === 'education' && collab && (
          <EducationTab collab={collab} loading={collabLoading} dispatch={dispatch} />
        )}
        {activeTab === 'certifications' && collab && (
          <CertificationsTab collab={collab} loading={collabLoading} dispatch={dispatch} />
        )}
        {activeTab === 'projects' && collab && (
          <ProjectsTab collab={collab} loading={collabLoading} dispatch={dispatch} />
        )}
      </div>
    </div>
  );
};

// ── Avatar ────────────────────────────────────────────────────────────────
const AvatarSection = ({ profile, dispatch }: any) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append('avatar', file);
    dispatch(UploadAvatar(fd));
  };

  const src = preview || profile?.avatarUrl || avatar(profile?.firstName ?? '', profile?.lastName ?? '');

  return (
    <div className="relative shrink-0">
      <img
        src={src}
        alt="avatar"
        className="w-20 h-20 rounded-full object-cover border-4 border-danger/20"
        onError={(e) => { (e.target as HTMLImageElement).src = avatar(profile?.firstName ?? '?', profile?.lastName ?? '?'); }}
      />
      <label className="absolute bottom-0 right-0 w-7 h-7 bg-danger rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition">
        <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" />
        </svg>
      </label>
    </div>
  );
};

// ── Onglet Profil de base ─────────────────────────────────────────────────
const ProfileTab = ({ profile, loading, dispatch }: any) => {
  const [form, setForm] = useState<any>({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (profile) setForm({ ...profile });
  }, [profile]);

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleSave = () => {
    dispatch(UpdateMyProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      newPassword: form.newPassword || undefined,
      jobTitle: form.jobTitle,
      bio: form.bio,
      yearsExperience: Number(form.yearsExperience) || 0,
      linkedinUrl: form.linkedinUrl,
      githubUrl: form.githubUrl,
      availabilityStatus: form.availabilityStatus,
      isPublic: form.isPublic,
    }));
    setEditing(false);
  };

  const isCollab = profile?.role === 'COLLABORATEUR';

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold dark:text-white">Informations personnelles</h3>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn btn-danger btn-sm text-xs">
            ✏️ Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { setEditing(false); setForm({ ...profile }); }} className="btn btn-outline-danger btn-sm text-xs">
              Annuler
            </button>
            <button onClick={handleSave} disabled={loading} className="btn btn-success btn-sm text-xs text-white">
              {loading ? '...' : '✓ Enregistrer'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Prénom" value={form.firstName} editing={editing} onChange={(v) => set('firstName', v)} />
        <Field label="Nom" value={form.lastName} editing={editing} onChange={(v) => set('lastName', v)} />
        <Field label="Email" value={form.email} editing={editing} onChange={(v) => set('email', v)} type="email" />
        {editing && (
          <Field label="Nouveau mot de passe" value={form.newPassword || ''} editing={editing} onChange={(v) => set('newPassword', v)} type="password" placeholder="Laisser vide pour ne pas changer" />
        )}

        {isCollab && (
          <>
            <div className="md:col-span-2 mt-3 pb-1 border-b border-white-light dark:border-[#1b2e4b]">
              <p className="text-xs font-bold text-danger uppercase tracking-wide">Détails collaborateur</p>
            </div>

            <Field label="Titre du poste" value={form.jobTitle} editing={editing} onChange={(v) => set('jobTitle', v)} />
            <Field label="Années d'expérience" value={form.yearsExperience} editing={editing} onChange={(v) => set('yearsExperience', v)} type="number" />

            <div className="md:col-span-2">
              <Field label="Bio" value={form.bio} editing={editing} onChange={(v) => set('bio', v)} multiline />
            </div>

            <Field label="LinkedIn URL" value={form.linkedinUrl} editing={editing} onChange={(v) => set('linkedinUrl', v)} />
            <Field label="GitHub URL" value={form.githubUrl} editing={editing} onChange={(v) => set('githubUrl', v)} />

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400 uppercase">Disponibilité</label>
              {editing ? (
                <select className="form-select text-sm w-full" value={form.availabilityStatus || ''} onChange={(e) => set('availabilityStatus', e.target.value)}>
                  {AVAILABILITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <p className={`text-sm font-semibold ${form.availabilityStatus === 'available' ? 'text-success' : form.availabilityStatus === 'soon' ? 'text-warning' : 'text-danger'}`}>
                  {form.availabilityStatus || '—'}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={form.isPublic || false}
                onChange={(e) => set('isPublic', e.target.checked)}
                disabled={!editing}
                className="form-checkbox text-danger"
              />
              <label htmlFor="isPublic" className="text-sm dark:text-white">Profil visible par les managers</label>
            </div>
          </>
        )}

        {profile?.role === 'MANAGER' && (
          <Field label="Département" value={form.department} editing={editing} onChange={(v) => set('department', v)} />
        )}
      </div>
    </div>
  );
};

// ── Onglet Skills ─────────────────────────────────────────────────────────
const SkillsTab = ({ collab, loading, dispatch }: any) => {
  const [catalog, setCatalog] = useState<SkillCatalogItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ skillId: 0, level: 'Intermédiaire', yearsUsed: 1, isPrimary: false });
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    GetSkillCatalogApi().then((r) => setCatalog(r.data ?? [])).catch(() => {});
  }, []);

  const handleAdd = () => {
    if (!form.skillId) return;
    dispatch(AddSkill({ ...form }));
    setShowForm(false);
    setForm({ skillId: 0, level: 'Intermédiaire', yearsUsed: 1, isPrimary: false });
  };

  const handleUpdate = (collabSkillId: number) => {
    dispatch(UpdateSkill(collabSkillId, editForm));
    setEditingId(null);
  };

  return (
    <div>
      <SectionHeader title="Compétences" count={collab.collaboratorSkills?.length} onAdd={() => setShowForm(true)} />

      {showForm && (
        <FormCard onCancel={() => setShowForm(false)} onSave={handleAdd} loading={loading}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="field-label">Compétence *</label>
              <select className="form-select text-sm w-full" value={form.skillId} onChange={(e) => setForm({ ...form, skillId: Number(e.target.value) })}>
                <option value={0}>-- Choisir --</option>
                {catalog.map((s) => <option key={s.skillId} value={s.skillId}>{s.name} ({s.category})</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Niveau</label>
              <select className="form-select text-sm w-full" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                {SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Années d'utilisation</label>
              <input type="number" className="form-input text-sm w-full" min={0} value={form.yearsUsed} onChange={(e) => setForm({ ...form, yearsUsed: Number(e.target.value) })} />
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <input type="checkbox" checked={form.isPrimary} onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })} className="form-checkbox text-danger" />
              <span className="text-sm dark:text-white">Compétence principale</span>
            </div>
          </div>
        </FormCard>
      )}

      <div className="space-y-2 mt-3">
        {collab.collaboratorSkills?.map((s: any) => (
          <div key={s.collabSkillId} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white-light dark:border-[#1b2e4b] hover:border-danger/30 transition">
            {editingId === s.collabSkillId ? (
              <div className="flex-1 grid grid-cols-3 gap-2 mr-3">
                <select className="form-select text-xs" value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}>
                  {SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
                <input type="number" className="form-input text-xs" value={editForm.yearsUsed} onChange={(e) => setEditForm({ ...editForm, yearsUsed: Number(e.target.value) })} />
                <label className="flex items-center gap-1 text-xs dark:text-white">
                  <input type="checkbox" checked={editForm.isPrimary} onChange={(e) => setEditForm({ ...editForm, isPrimary: e.target.checked })} />
                  Principal
                </label>
              </div>
            ) : (
              <div>
                <span className="font-semibold text-sm dark:text-white">{s.skill?.name}</span>
                <span className="ml-2 text-xs text-gray-400">{s.level} · {s.yearsUsed} an(s)</span>
                {s.isPrimary && <span className="ml-2 text-xs text-warning">★</span>}
                <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 dark:bg-[#1b2e4b] rounded">{s.skill?.category}</span>
              </div>
            )}
            <div className="flex gap-2 shrink-0">
              {editingId === s.collabSkillId ? (
                <>
                  <button onClick={() => handleUpdate(s.collabSkillId)} className="text-xs text-success hover:underline">✓</button>
                  <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:underline">✕</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setEditingId(s.collabSkillId); setEditForm({ level: s.level, yearsUsed: s.yearsUsed, isPrimary: s.isPrimary }); }} className="text-xs text-primary hover:underline">Modifier</button>
                  <button onClick={() => dispatch(DeleteSkill(s.collabSkillId))} className="text-xs text-danger hover:underline">Suppr.</button>
                </>
              )}
            </div>
          </div>
        ))}
        {!collab.collaboratorSkills?.length && <EmptyState label="Aucune compétence ajoutée." />}
      </div>
    </div>
  );
};

// ── Onglet Expériences ────────────────────────────────────────────────────
const ExperiencesTab = ({ collab, loading, dispatch }: any) => {
  const EMPTY = { companyName: '', jobTitle: '', description: '', startDate: '', endDate: '', isCurrent: false, location: '', technologies: '', contractType: '' };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>({ ...EMPTY });
  const [editForm, setEditForm] = useState<any>({});

  const parseExp = (f: any) => ({
    companyName: f.companyName,
    jobTitle: f.jobTitle,
    description: f.description || undefined,
    startDate: f.startDate,
    endDate: f.isCurrent ? undefined : (f.endDate || undefined),
    isCurrent: !!f.isCurrent,
    location: f.location || undefined,
    technologies: f.technologies || undefined,
    contractType: f.contractType || undefined,
  });

  const handleAdd = () => {
    if (!form.companyName || !form.jobTitle || !form.startDate) return;
    dispatch(AddExperience(parseExp(form)));
    setForm({ ...EMPTY });
    setShowForm(false);
  };

  const handleUpdate = (id: number) => {
    dispatch(UpdateExperience(id, parseExp(editForm)));
    setEditingId(null);
  };

  return (
    <div>
      <SectionHeader title="Expériences professionnelles" count={collab.experiences?.length} onAdd={() => setShowForm(true)} />

      {showForm && (
        <FormCard onCancel={() => setShowForm(false)} onSave={handleAdd} loading={loading}>
          <ExpForm form={form} setForm={setForm} />
        </FormCard>
      )}

      <div className="space-y-3 mt-3">
        {collab.experiences?.map((e: any) => (
          <div key={e.experienceId} className="p-4 rounded-xl border border-white-light dark:border-[#1b2e4b] hover:border-danger/30 transition">
            {editingId === e.experienceId ? (
              <>
                <ExpForm form={editForm} setForm={setEditForm} />
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleUpdate(e.experienceId)} className="btn btn-success btn-sm text-xs text-white">✓ Enregistrer</button>
                  <button onClick={() => setEditingId(null)} className="btn btn-outline-danger btn-sm text-xs">Annuler</button>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold dark:text-white text-sm">{e.jobTitle}</p>
                  <p className="text-xs text-danger">{e.companyName} {e.location ? `· ${e.location}` : ''}</p>
                  <p className="text-xs text-gray-400">{e.startDate} → {e.isCurrent ? 'Présent' : (e.endDate ?? 'N/A')}</p>
                  {e.contractType && <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded mt-1 inline-block">{e.contractType}</span>}
                  {e.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{e.description}</p>}
                  {e.technologies && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {e.technologies.split(',').map((t: string) => (
                        <span key={t.trim()} className="text-[10px] bg-gray-100 dark:bg-[#1b2e4b] px-1.5 py-0.5 rounded">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-2 shrink-0">
                  <button onClick={() => { setEditingId(e.experienceId); setEditForm({ companyName: e.companyName, jobTitle: e.jobTitle, description: e.description || '', startDate: formatDate(e.startDate), endDate: formatDate(e.endDate), isCurrent: e.isCurrent, location: e.location || '', technologies: e.technologies || '', contractType: e.contractType || '' }); }} className="text-xs text-primary hover:underline">Modifier</button>
                  <button onClick={() => dispatch(DeleteExperience(e.experienceId))} className="text-xs text-danger hover:underline">Suppr.</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!collab.experiences?.length && <EmptyState label="Aucune expérience ajoutée." />}
      </div>
    </div>
  );
};

const ExpForm = ({ form, setForm }: any) => (
  <div className="grid grid-cols-2 gap-3">
    <div><label className="field-label">Entreprise *</label><input className="form-input text-sm w-full" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
    <div><label className="field-label">Poste *</label><input className="form-input text-sm w-full" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} /></div>
    <div><label className="field-label">Date début *</label><input type="date" className="form-input text-sm w-full" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
    <div>
      <label className="field-label">Date fin</label>
      <input type="date" className="form-input text-sm w-full" value={form.endDate} disabled={form.isCurrent} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
    </div>
    <div className="flex items-center gap-2"><input type="checkbox" checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: '' })} className="form-checkbox text-danger" /><span className="text-sm dark:text-white">Poste actuel</span></div>
    <div>
      <label className="field-label">Type contrat</label>
      <select className="form-select text-sm w-full" value={form.contractType} onChange={(e) => setForm({ ...form, contractType: e.target.value })}>
        <option value="">--</option>
        {CONTRACT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
    <div><label className="field-label">Lieu</label><input className="form-input text-sm w-full" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
    <div><label className="field-label">Technologies</label><input className="form-input text-sm w-full" placeholder="React, .NET, ..." value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} /></div>
    <div className="col-span-2"><label className="field-label">Description</label><textarea className="form-textarea text-sm w-full" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
  </div>
);

// ── Onglet Education ──────────────────────────────────────────────────────
const EducationTab = ({ collab, loading, dispatch }: any) => {
  const EMPTY = { school: '', degree: 'Licence', field: '', startDate: '', endDate: '', isCurrent: false, grade: '', description: '' };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>({ ...EMPTY });
  const [editForm, setEditForm] = useState<any>({});

  const parseEd = (f: any) => ({
    school: f.school, degree: f.degree, field: f.field,
    startDate: f.startDate, endDate: f.isCurrent ? undefined : (f.endDate || undefined),
    isCurrent: !!f.isCurrent, grade: f.grade || undefined, description: f.description || undefined,
  });

  const handleAdd = () => {
    if (!form.school || !form.field || !form.startDate) return;
    dispatch(AddEducation(parseEd(form)));
    setForm({ ...EMPTY }); setShowForm(false);
  };

  return (
    <div>
      <SectionHeader title="Formation" count={collab.educations?.length} onAdd={() => setShowForm(true)} />
      {showForm && (
        <FormCard onCancel={() => setShowForm(false)} onSave={handleAdd} loading={loading}>
          <EduForm form={form} setForm={setForm} />
        </FormCard>
      )}
      <div className="space-y-3 mt-3">
        {collab.educations?.map((ed: any) => (
          <div key={ed.educationId} className="p-4 rounded-xl border border-white-light dark:border-[#1b2e4b] hover:border-danger/30 transition">
            {editingId === ed.educationId ? (
              <>
                <EduForm form={editForm} setForm={setEditForm} />
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { dispatch(UpdateEducation(ed.educationId, parseEd(editForm))); setEditingId(null); }} className="btn btn-success btn-sm text-xs text-white">✓ Enregistrer</button>
                  <button onClick={() => setEditingId(null)} className="btn btn-outline-danger btn-sm text-xs">Annuler</button>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold dark:text-white text-sm">{ed.degree} en {ed.field}</p>
                  <p className="text-xs text-danger">{ed.school}</p>
                  <p className="text-xs text-gray-400">{formatDate(ed.startDate)} → {ed.isCurrent ? 'En cours' : (formatDate(ed.endDate) || 'N/A')}</p>
                  {ed.grade && <span className="text-xs text-success">{ed.grade}</span>}
                </div>
                <div className="flex gap-2 ml-2">
                  <button onClick={() => { setEditingId(ed.educationId); setEditForm({ school: ed.school, degree: ed.degree, field: ed.field, startDate: formatDate(ed.startDate), endDate: formatDate(ed.endDate), isCurrent: ed.isCurrent, grade: ed.grade || '', description: ed.description || '' }); }} className="text-xs text-primary hover:underline">Modifier</button>
                  <button onClick={() => dispatch(DeleteEducation(ed.educationId))} className="text-xs text-danger hover:underline">Suppr.</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!collab.educations?.length && <EmptyState label="Aucune formation ajoutée." />}
      </div>
    </div>
  );
};

const EduForm = ({ form, setForm }: any) => (
  <div className="grid grid-cols-2 gap-3">
    <div><label className="field-label">École *</label><input className="form-input text-sm w-full" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} /></div>
    <div>
      <label className="field-label">Diplôme</label>
      <select className="form-select text-sm w-full" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })}>
        {DEGREE_OPTIONS.map((d) => <option key={d}>{d}</option>)}
      </select>
    </div>
    <div><label className="field-label">Domaine *</label><input className="form-input text-sm w-full" placeholder="Informatique" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} /></div>
    <div><label className="field-label">Mention / Note</label><input className="form-input text-sm w-full" placeholder="ex: Mention Bien" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} /></div>
    <div><label className="field-label">Date début *</label><input type="date" className="form-input text-sm w-full" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
    <div><label className="field-label">Date fin</label><input type="date" className="form-input text-sm w-full" value={form.endDate} disabled={form.isCurrent} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
    <div className="flex items-center gap-2"><input type="checkbox" checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })} className="form-checkbox text-danger" /><span className="text-sm dark:text-white">En cours</span></div>
  </div>
);

// ── Onglet Certifications ─────────────────────────────────────────────────
const CertificationsTab = ({ collab, loading, dispatch }: any) => {
  const EMPTY = { name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '', score: '' };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>({ ...EMPTY });
  const [editForm, setEditForm] = useState<any>({});

  const parseCert = (f: any) => ({
    name: f.name, issuer: f.issuer, issueDate: f.issueDate,
    expiryDate: f.expiryDate || undefined, credentialUrl: f.credentialUrl || undefined,
    score: f.score ? Number(f.score) : undefined,
  });

  const handleAdd = () => {
    if (!form.name || !form.issuer || !form.issueDate) return;
    dispatch(AddCertification(parseCert(form)));
    setForm({ ...EMPTY }); setShowForm(false);
  };

  return (
    <div>
      <SectionHeader title="Certifications" count={collab.certifications?.length} onAdd={() => setShowForm(true)} />
      {showForm && (
        <FormCard onCancel={() => setShowForm(false)} onSave={handleAdd} loading={loading}>
          <CertForm form={form} setForm={setForm} />
        </FormCard>
      )}
      <div className="space-y-3 mt-3">
        {collab.certifications?.map((c: any) => (
          <div key={c.certificationId} className="p-4 rounded-xl border border-white-light dark:border-[#1b2e4b] hover:border-danger/30 transition">
            {editingId === c.certificationId ? (
              <>
                <CertForm form={editForm} setForm={setEditForm} />
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { dispatch(UpdateCertification(c.certificationId, parseCert(editForm))); setEditingId(null); }} className="btn btn-success btn-sm text-xs text-white">✓ Enregistrer</button>
                  <button onClick={() => setEditingId(null)} className="btn btn-outline-danger btn-sm text-xs">Annuler</button>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold dark:text-white text-sm">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.issuer} · {formatDate(c.issueDate)}</p>
                  {c.score != null && <span className="text-xs text-success font-bold">{c.score}/100</span>}
                  {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-primary ml-2 hover:underline">Voir</a>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(c.certificationId); setEditForm({ name: c.name, issuer: c.issuer, issueDate: formatDate(c.issueDate), expiryDate: formatDate(c.expiryDate), credentialUrl: c.credentialUrl || '', score: c.score ?? '' }); }} className="text-xs text-primary hover:underline">Modifier</button>
                  <button onClick={() => dispatch(DeleteCertification(c.certificationId))} className="text-xs text-danger hover:underline">Suppr.</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!collab.certifications?.length && <EmptyState label="Aucune certification ajoutée." />}
      </div>
    </div>
  );
};

const CertForm = ({ form, setForm }: any) => (
  <div className="grid grid-cols-2 gap-3">
    <div className="col-span-2"><label className="field-label">Nom *</label><input className="form-input text-sm w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
    <div><label className="field-label">Organisme *</label><input className="form-input text-sm w-full" placeholder="AWS, Microsoft..." value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} /></div>
    <div><label className="field-label">Score (/100)</label><input type="number" min={0} max={100} className="form-input text-sm w-full" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} /></div>
    <div><label className="field-label">Date obtention *</label><input type="date" className="form-input text-sm w-full" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} /></div>
    <div><label className="field-label">Date expiration</label><input type="date" className="form-input text-sm w-full" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></div>
    <div className="col-span-2"><label className="field-label">URL credential</label><input className="form-input text-sm w-full" placeholder="https://..." value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} /></div>
  </div>
);

// ── Onglet Projets ────────────────────────────────────────────────────────
const ProjectsTab = ({ collab, loading, dispatch }: any) => {
  const EMPTY = { title: '', description: '', technologies: '', projectUrl: '', githubUrl: '', screenshotUrl: '', startDate: '', endDate: '', roleInProject: '', isFeatured: false };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>({ ...EMPTY });
  const [editForm, setEditForm] = useState<any>({});

  const parseProj = (f: any) => ({
    title: f.title, description: f.description || undefined, technologies: f.technologies || undefined,
    projectUrl: f.projectUrl || undefined, githubUrl: f.githubUrl || undefined,
    screenshotUrl: f.screenshotUrl || undefined,
    startDate: f.startDate || undefined, endDate: f.endDate || undefined,
    roleInProject: f.roleInProject || undefined, isFeatured: !!f.isFeatured,
  });

  const handleAdd = () => {
    if (!form.title) return;
    dispatch(AddProject(parseProj(form)));
    setForm({ ...EMPTY }); setShowForm(false);
  };

  return (
    <div>
      <SectionHeader title="Projets" count={collab.projects?.length} onAdd={() => setShowForm(true)} />
      {showForm && (
        <FormCard onCancel={() => setShowForm(false)} onSave={handleAdd} loading={loading}>
          <ProjForm form={form} setForm={setForm} />
        </FormCard>
      )}
      <div className="space-y-3 mt-3">
        {collab.projects?.map((p: any) => (
          <div key={p.projectId} className="p-4 rounded-xl border border-white-light dark:border-[#1b2e4b] hover:border-danger/30 transition">
            {editingId === p.projectId ? (
              <>
                <ProjForm form={editForm} setForm={setEditForm} />
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { dispatch(UpdateProject(p.projectId, parseProj(editForm))); setEditingId(null); }} className="btn btn-success btn-sm text-xs text-white">✓ Enregistrer</button>
                  <button onClick={() => setEditingId(null)} className="btn btn-outline-danger btn-sm text-xs">Annuler</button>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold dark:text-white text-sm">{p.title} {p.isFeatured && <span className="text-warning">⭐</span>}</p>
                  {p.roleInProject && <p className="text-xs text-primary">{p.roleInProject}</p>}
                  {p.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>}
                  {p.technologies && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {p.technologies.split(',').map((t: string) => (
                        <span key={t.trim()} className="text-[10px] bg-gray-100 dark:bg-[#1b2e4b] px-1.5 py-0.5 rounded">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3 mt-1">
                    {p.projectUrl && <a href={p.projectUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Demo</a>}
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:underline">GitHub</a>}
                  {p.screenshotUrl && <a href={p.screenshotUrl} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:underline">Screenshot</a>}
                  </div>
                </div>
                <div className="flex gap-2 ml-2 shrink-0">
                  <button onClick={() => { setEditingId(p.projectId); setEditForm({ title: p.title, description: p.description || '', technologies: p.technologies || '', projectUrl: p.projectUrl || '', githubUrl: p.githubUrl || '', screenshotUrl: p.screenshotUrl || '', startDate: formatDate(p.startDate), endDate: formatDate(p.endDate), roleInProject: p.roleInProject || '', isFeatured: p.isFeatured }); }} className="text-xs text-primary hover:underline">Modifier</button>
                  <button onClick={() => dispatch(DeleteProject(p.projectId))} className="text-xs text-danger hover:underline">Suppr.</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!collab.projects?.length && <EmptyState label="Aucun projet ajouté." />}
      </div>
    </div>
  );
};

const ProjForm = ({ form, setForm }: any) => (
  <div className="grid grid-cols-2 gap-3">
    <div className="col-span-2"><label className="field-label">Titre *</label><input className="form-input text-sm w-full" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
    <div><label className="field-label">Rôle dans le projet</label><input className="form-input text-sm w-full" placeholder="Lead Dev, Frontend..." value={form.roleInProject} onChange={(e) => setForm({ ...form, roleInProject: e.target.value })} /></div>
    <div><label className="field-label">Technologies</label><input className="form-input text-sm w-full" placeholder="React, .NET, ..." value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} /></div>
    <div><label className="field-label">Date début</label><input type="date" className="form-input text-sm w-full" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
    <div><label className="field-label">Date fin</label><input type="date" className="form-input text-sm w-full" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
    <div><label className="field-label">URL projet</label><input className="form-input text-sm w-full" placeholder="https://..." value={form.projectUrl} onChange={(e) => setForm({ ...form, projectUrl: e.target.value })} /></div>
    <div><label className="field-label">GitHub URL</label><input className="form-input text-sm w-full" placeholder="https://github.com/..." value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} /></div>
    <div><label className="field-label">Screenshot Url</label><input className="form-input text-sm w-full" placeholder="https://..." value={form.screenshotUrl} onChange={(e) => setForm({ ...form, screenshotUrl: e.target.value })} /></div>
    <div className="col-span-2"><label className="field-label">Description</label><textarea className="form-textarea text-sm w-full" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
    <div className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="form-checkbox text-warning" /><span className="text-sm dark:text-white">⭐ Projet mis en avant</span></div>
  </div>
);

// ── Composants utilitaires ────────────────────────────────────────────────
const Field = ({ label, value, editing, onChange, type = 'text', multiline = false, placeholder = '' }: {
  label: string;
  value: any;
  editing: boolean;
  onChange: (v: string) => void;  // ← type ici une seule fois
  type?: string;
  multiline?: boolean;
  placeholder?: string;
}) => ( 
  <div>
    <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</label>
    {editing ? (
      multiline ? (
        <textarea rows={3} className="form-textarea text-sm w-full" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input type={type} className="form-input text-sm w-full" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )
    ) : (
      <p className="text-sm dark:text-white py-1">{value || <span className="text-gray-300">—</span>}</p>
    )}
  </div>
);

const SectionHeader = ({ title, count, onAdd }: { title: string; count?: number; onAdd: () => void }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-bold dark:text-white">
      {title} {count !== undefined && <span className="text-xs text-gray-400 font-normal">({count})</span>}
    </h3>
    <button onClick={onAdd} className="btn btn-danger btn-sm text-xs">+ Ajouter</button>
  </div>
);

const FormCard = ({ children, onCancel, onSave, loading }: any) => (
  <div className="mb-4 p-4 rounded-xl border border-danger/30 bg-danger/5">
    {children}
    <div className="flex gap-2 justify-end mt-3">
      <button onClick={onCancel} className="btn btn-outline-danger btn-sm text-xs">Annuler</button>
      <button onClick={onSave} disabled={loading} className="btn btn-danger btn-sm text-xs">
        {loading ? '...' : '+ Ajouter'}
      </button>
    </div>
  </div>
);

const EmptyState = ({ label }: { label: string }) => (
  <div className="text-center py-8 text-gray-400 text-sm">{label}</div>
);

export default UserProfile;