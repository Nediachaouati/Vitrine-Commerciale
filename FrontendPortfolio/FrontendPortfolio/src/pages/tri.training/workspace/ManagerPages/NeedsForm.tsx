import { useState } from 'react';
import type { CreateClientNeedDto } from '../../../../helpers/model/dto/manager.dto';

interface Props {
  onSubmit: (dto: CreateClientNeedDto) => void;
  loading: boolean;
}

const CONTRACT_TYPES = ['CDI', 'freelance', 'stage', 'CDD'];
const AVAIL_OPTIONS = [
  { value: 'available', label: 'Disponible immédiatement' },
  { value: 'soon',      label: 'Disponible bientôt' },
  { value: 'any',       label: 'Peu importe' },
];

const TagInput = ({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) => {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInput('');
  };

  const remove = (v: string) => onChange(values.filter(x => x !== v));

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder ?? 'Ajouter et appuyer Entrée'}
          className="flex-1 border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-text"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 cursor-pointer"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {values.map(v => (
          <span
            key={v}
            className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              className="hover:text-red-500 font-bold cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

const NeedsForm = ({ onSubmit, loading }: Props) => {
  const [form, setForm] = useState<CreateClientNeedDto>({
    title: '',
    description: '',
    requiredSkills: [],
    preferredSkills: [],
    minYearsExperience: undefined,
    availabilityRequired: 'any',
    requiredCertifications: [],
    contractType: undefined,
  });

  const set = (key: keyof CreateClientNeedDto, value: any) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || form.requiredSkills.length === 0) return;
    onSubmit(form);
  };

  const isDisabled = loading || !form.title || form.requiredSkills.length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-6 bg-white dark:bg-[#0e1726] rounded-xl border border-gray-100 dark:border-[#1b2e4b]"
    >
      <h2 className="text-lg font-bold dark:text-white">Nouveau besoin client</h2>

      {/* Titre */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
          Titre *
        </label>
        <input
          required
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Ex: Développeur React senior"
          className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-text"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
          Description
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Contexte du poste, missions..."
          className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none cursor-text"
        />
      </div>

      {/* Skills requis */}
      <TagInput
        label="Compétences requises *"
        values={form.requiredSkills}
        onChange={v => set('requiredSkills', v)}
        placeholder="Ex: React, TypeScript..."
      />

      {/* Skills préférés */}
      <TagInput
        label="Compétences préférées"
        values={form.preferredSkills ?? []}
        onChange={v => set('preferredSkills', v)}
        placeholder="Ex: Docker, Kubernetes..."
      />

      {/* Certifications */}
      <TagInput
        label="Certifications requises"
        values={form.requiredCertifications ?? []}
        onChange={v => set('requiredCertifications', v)}
        placeholder="Ex: AWS Solutions Architect..."
      />

      {/* Expérience + Contrat + Dispo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Exp. min (ans)
          </label>
          <input
            type="number"
            min={0}
            max={30}
            value={form.minYearsExperience ?? ''}
            onChange={e => set('minYearsExperience', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
            className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-text"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Type de contrat
          </label>
          <select
            value={form.contractType ?? ''}
            onChange={e => set('contractType', e.target.value || undefined)}
            className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="">Tous</option>
            {CONTRACT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Disponibilité
          </label>
          <select
            value={form.availabilityRequired ?? 'any'}
            onChange={e => set('availabilityRequired', e.target.value)}
            className="w-full border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#0e1726] dark:text-white focus:outline-none cursor-pointer"
          >
            {AVAIL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Bouton centré — blanc par défaut, rouge au hover/active ── */}
      <div className="flex justify-center pt-1">
        <button
          type="submit"
          disabled={isDisabled}
          className={`
            px-8 py-2.5 rounded-lg font-semibold text-sm border transition-all duration-200
            ${isDisabled
              ? 'border-red-200 dark:border-[#1b2e4b] text-red-300 dark:text-gray-600 bg-white dark:bg-[#0e1726] cursor-not-allowed'
              : 'border-red-400 text-red-500 bg-white dark:bg-[#0e1726] hover:bg-red-500 hover:text-white active:bg-red-600 active:border-red-600 cursor-pointer'
            }
          `}
        >
          {loading ? 'Enregistrement...' : 'Lancer le matching'}
        </button>
      </div>
    </form>
  );
};

export default NeedsForm;