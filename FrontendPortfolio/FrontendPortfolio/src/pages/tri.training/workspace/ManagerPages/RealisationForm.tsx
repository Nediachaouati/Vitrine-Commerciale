import { useEffect, useState } from 'react';
import { useRedux } from '../../../../hooks';
import {
  CreateRealisation,
  UpdateRealisation,
  CloseRealisationForm,
} from '../../../../Redux/realisation/actions';
import type {
  RealisationResponseDto,
  UpsertRealisationDto,
} from '../../../../helpers/model/dto/realisation.dto';

const CATEGORIES = ['redaction', 'seo', 'web_design', 'developpement', 'integration', 'community_manager'];

const EMPTY_FORM: UpsertRealisationDto = {
  title: '',
  description: '',
  clientName: '',
  siteUrl: '',
  screenshotUrl: '',
  technologies: [],
  category: '',
  deliveredAt: '',
  isPublic: true,
  collaboratorId: undefined,
};

const CATEGORY_LABELS: Record<string, string> = {
  redaction:         'Rédaction',
  seo:               'SEO',
  web_design:        'Web Design',
  developpement:     'Développement',
  integration:       'Intégration',
  community_manager: 'Community Manager',
};
const RealisationForm = () => {
  const { dispatch, appSelector } = useRedux();

  const editingId: number | null       = appSelector((s: any) => s.Realisation?.editingId ?? null);
  const saving: boolean                = appSelector((s: any) => s.Realisation?.saving ?? false);
  const realisations: RealisationResponseDto[] = appSelector((s: any) => s.Realisation?.realisations ?? []);

  const [form, setForm] = useState<UpsertRealisationDto>(EMPTY_FORM);
  const [techInput, setTechInput] = useState('');

  // Pré-remplir si édition
  useEffect(() => {
    if (editingId !== null) {
      const existing = realisations.find((r) => r.realisationId === editingId);
      if (existing) {
        setForm({
          title:         existing.title,
          description:   existing.description ?? '',
          clientName:    existing.clientName ?? '',
          siteUrl:       existing.siteUrl ?? '',
          screenshotUrl: existing.screenshotUrl ?? '',
          technologies:  existing.technologies ?? [],
          category:      existing.category ?? '',
          deliveredAt:   existing.deliveredAt ?? '',
          isPublic:      existing.isPublic,
          collaboratorId: existing.collaboratorId,
        });
      }
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingId]); // eslint-disable-line

  const set = (field: keyof UpsertRealisationDto, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies?.includes(t)) {
      set('technologies', [...(form.technologies ?? []), t]);
    }
    setTechInput('');
  };

  const removeTech = (tech: string) =>
    set('technologies', form.technologies?.filter((t) => t !== tech) ?? []);

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const dto: UpsertRealisationDto = {
      ...form,
      deliveredAt: form.deliveredAt || undefined,
      collaboratorId: form.collaboratorId || undefined,
    };

    if (editingId !== null) {
      dispatch(UpdateRealisation(editingId, dto));
    } else {
      dispatch(CreateRealisation(dto));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[#0e1726] rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#1b2e4b]">
          <h2 className="text-lg font-bold dark:text-white">
            {editingId !== null ? 'Modifier la réalisation' : 'Nouvelle réalisation'}
          </h2>
          <button
            onClick={() => dispatch(CloseRealisationForm())}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Ex: Site TRIWEB"
              className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Description courte du projet..."
              className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Client + Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Nom du client
              </label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => set('clientName', e.target.value)}
                placeholder="Ex: TechCorp SARL"
                className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Catégorie
              </label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sélectionner...</option>
                {CATEGORIES.map((c) => (
  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
))}
              </select>
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                URL du site
              </label>
              <input
                type="url"
                value={form.siteUrl}
                onChange={(e) => set('siteUrl', e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                URL screenshot
              </label>
              <input
                type="url"
                value={form.screenshotUrl}
                onChange={(e) => set('screenshotUrl', e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Date + isPublic */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Date de livraison
              </label>
              <input
                type="date"
                value={form.deliveredAt}
                onChange={(e) => set('deliveredAt', e.target.value)}
                className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => set('isPublic', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm dark:text-white">Visible par les clients</span>
              </label>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Technologies
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                placeholder="Ex: React, ASP.NET..."
                className="flex-1 border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={addTech}
                className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
              >
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {(form.technologies ?? []).map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-[#1b2e4b] text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTech(t)}
                    className="text-gray-400 hover:text-red-500 leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-[#1b2e4b]">
          <button
            onClick={() => dispatch(CloseRealisationForm())}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1b2e4b] dark:text-white hover:bg-gray-50 dark:hover:bg-[#1b2e4b] disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.title.trim()}
            className="px-5 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {editingId !== null ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealisationForm;