import { useState } from 'react';
import type { ShortlistDetailDto } from '../../../../../helpers/model/dto/Shortlist.dto';
import { SendShortlistApi } from '../../../../../helpers/api/ShortlistApi';
import type { SendShortlistOptionsDto } from '../../../../../helpers/model/dto/Shortlist.dto';

// ── Icons ─────────────────────────────────────────────────────────
const XIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);
const CopyIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-emerald-400">
    <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.435c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.939 11.107a.519.519 0 01-.322 0C5.26 16.573 2 12.172 2 7.01c0-.539.035-1.07.104-1.589a.5.5 0 01.48-.435 11.947 11.947 0 007.077-2.749z" clipRule="evenodd" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);
const PdfIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);
const LinkIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
    <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v1.764l-1.664 2.496A1 1 0 003.2 14H7a3 3 0 006 0h3.8a1 1 0 00.864-1.496L16 9.764V8a6 6 0 00-6-6zm0 14a1 1 0 01-1-1h2a1 1 0 01-1 1z" clipRule="evenodd" />
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────
type Mode = 'email' | 'lien' | 'pdf' | 'notification';

interface Props {
  shortlist: ShortlistDetailDto;
  shareUrl: string;
  shareToken: string;
  onClose: () => void;
  onSent?: () => void; // callback après envoi réussi
}

// ── Composant principal ────────────────────────────────────────────
const SharePanel = ({ shortlist, shareUrl, shareToken, onClose, onSent }: Props) => {
  const [mode, setMode]               = useState<Mode>('email');
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName]   = useState(shortlist.clientName ?? '');
  const [subject, setSubject]         = useState(`Profils recommandés — ${shortlist.title}`);
  const [messageBody, setMessageBody] = useState(
    `Bonjour,\n\nVeuillez trouver ci-dessous les profils recommandés pour votre projet.\n\nAccédez à votre liste de sélection sécurisée :\n${shareUrl}\n\nCordialement`
  );
  const [copied, setCopied]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errMsg, setErrMsg]   = useState('');

  const displayUrl = shareUrl
    ? shareUrl.replace(/^https?:\/\//, '').slice(0, 42) + (shareUrl.length > 55 ? '…' : '')
    : `vitrine.app/shortlist/${shareToken?.slice(0, 8)}…`;

  const daysLeft = shortlist.expiresAt
    ? Math.max(0, Math.ceil((new Date(shortlist.expiresAt).getTime() - Date.now()) / 86_400_000))
    : null;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  // ── Envoi principal ────────────────────────────────────────────
 const handleSend = async () => {
  setErrMsg('');
  setSuccess('');

  if (mode === 'email' && !clientEmail.trim()) {
    setErrMsg("Veuillez saisir l'adresse email du client.");
    return;
  }
  if (mode === 'lien') {
    await handleCopy();
    setSuccess('Lien copié dans le presse-papiers !');
    return;
  }

  setLoading(true);
  try {
    const dto: SendShortlistOptionsDto = {
      mode:        mode === 'pdf' ? 'pdf' : mode === 'notification' ? 'notification' : 'email',
      clientEmail: clientEmail.trim() || undefined,
      clientName:  clientName.trim()  || undefined,
      subject:     subject.trim()     || undefined,
      messageBody: messageBody.trim() || undefined,
    };

    const response: any = await SendShortlistApi(shortlist.shortlistId, dto);

    if (mode === 'pdf') {
      // Le backend retourne du HTML → ouvrir dans un nouvel onglet
      const blob = new Blob([response.data], { type: 'text/html' });
      const url  = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
      setSuccess('Rapport PDF généré avec succès !');
    } else {
      setSuccess('Email envoyé avec succès au client !');
    }

    onSent?.();
  } catch (e: any) {
    const msg = e?.response?.data?.message ?? e?.message ?? 'Une erreur est survenue.';
    setErrMsg(msg);
  } finally {
    setLoading(false);
  }
};

  // ── Tab config ─────────────────────────────────────────────────
  const TABS: { id: Mode; label: string; icon: JSX.Element; description: string }[] = [
    { id: 'email',        label: 'Email',          icon: <MailIcon />,  description: 'Envoi direct par email avec lien sécurisé' },
    { id: 'lien',         label: 'Copier le lien', icon: <LinkIcon />,  description: 'Copier le lien et le partager manuellement' },
    { id: 'pdf',          label: 'Rapport PDF',    icon: <PdfIcon />,   description: 'Générer et télécharger un rapport PDF' },
    { id: 'notification', label: 'Notification',   icon: <BellIcon />,  description: 'Notifier le client sur la plateforme' },
  ];

  const sendLabel: Record<Mode, string> = {
    email:        'Envoyer l\'email au client',
    lien:         'Copier le lien sécurisé',
    pdf:          'Télécharger le rapport PDF',
    notification: 'Envoyer la notification',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#0e1726] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col border border-gray-200 dark:border-[#1b2e4b] overflow-hidden">

        {/* ── En-tête ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#1b2e4b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <SendIcon />
            </div>
            <div>
              <h2 className="font-bold text-base dark:text-white">Partager la liste de sélection</h2>
              <p className="text-xs text-gray-400 mt-0.5">Choisissez comment envoyer cette sélection au client</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#1b2e4b] transition">
            <XIcon />
          </button>
        </div>

        {/* ── Corps ────────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* Colonne gauche */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 border-r border-gray-100 dark:border-[#1b2e4b]">

            {/* Alertes */}
            {success && (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl text-sm text-emerald-700 dark:text-emerald-300">
                <CheckIcon />
                {success}
              </div>
            )}
            {errMsg && (
              <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-sm text-red-700 dark:text-red-300">
                {errMsg}
              </div>
            )}

            {/* ── Mode d'envoi ──────────────────────────────────────── */}
            <section>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Mode d'envoi</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setMode(t.id); setSuccess(''); setErrMsg(''); }}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${
                      mode === t.id
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary shadow-sm'
                        : 'border-gray-200 dark:border-[#1b2e4b] text-gray-500 dark:text-gray-400 hover:border-primary/40 bg-white dark:bg-[#0e1726]'
                    }`}
                  >
                    <span className={mode === t.id ? 'text-primary' : 'text-gray-400'}>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-2 ml-1">
                {TABS.find(t => t.id === mode)?.description}
              </p>
            </section>

            {/* ── Informations du client (email / notification) ────── */}
            {(mode === 'email' || mode === 'notification') && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-red-500">
                      <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 00-11.215 0c-.22.578.254 1.139.872 1.139h9.47z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold dark:text-white">Informations du client</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Nom du client</label>
                    <input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Nom du client"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-[#1b2e4b] rounded-lg bg-white dark:bg-[#0e1726] text-sm dark:text-white focus:outline-none focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Adresse email {mode === 'email' && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@entreprise.com"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-[#1b2e4b] rounded-lg bg-white dark:bg-[#0e1726] text-sm dark:text-white focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ── Rédaction du message (mode email) ────────────────── */}
            {mode === 'email' && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                    <MailIcon />
                  </div>
                  <h3 className="text-sm font-bold dark:text-white">Rédaction de l'email</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Objet</label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-[#1b2e4b] rounded-lg bg-white dark:bg-[#0e1726] text-sm dark:text-white focus:outline-none focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Corps du message</label>
                    <textarea
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-[#1b2e4b] rounded-lg bg-white dark:bg-[#0e1726] text-sm dark:text-white focus:outline-none focus:border-primary transition resize-none"
                    />
                  </div>
                  
                </div>
              </section>
            )}

            {/* ── Mode PDF ──────────────────────────────────────────── */}
            {mode === 'pdf' && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                    <PdfIcon />
                  </div>
                  <h3 className="text-sm font-bold dark:text-white">Rapport PDF</h3>
                </div>
                <div className="bg-gray-50 dark:bg-[#1b2e4b] rounded-xl p-4 space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Un rapport HTML complet sera généré avec tous les profils de la liste de sélection, prêt à être imprimé ou partagé.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <CheckIcon />
                    <span>Nom, poste, expérience de chaque candidat</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <CheckIcon />
                    <span>Score de pertinence et compétences</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <CheckIcon />
                    <span>Notes du manager incluses</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-[#0e1726]">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Envoyer aussi par email (optionnel)
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@entreprise.com"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-[#1b2e4b] rounded-lg bg-white dark:bg-[#0e1726] text-sm dark:text-white focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ── Mode Lien ─────────────────────────────────────────── */}
            {mode === 'lien' && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                    <LinkIcon />
                  </div>
                  <h3 className="text-sm font-bold dark:text-white">Lien sécurisé</h3>
                </div>
                <div className="bg-gray-50 dark:bg-[#1b2e4b] rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Copiez ce lien et partagez-le directement avec votre client par le canal de votre choix.
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white dark:bg-[#0e1726] border border-gray-200 dark:border-[#1b2e4b] rounded-lg px-3 py-2 text-sm text-gray-500 dark:text-gray-400 font-mono truncate">
                      {shareUrl}
                    </div>
                    <button
                      onClick={handleCopy}
                      className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                        copied ? 'bg-emerald-600 text-white' : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                      {copied ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Le client devra s'authentifier pour accéder aux profils des candidats.
                  </p>
                </div>
              </section>
            )}

            {/* ── Mode Notification ──────────────────────────────────── */}
            {mode === 'notification' && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500">
                    <BellIcon />
                  </div>
                  <h3 className="text-sm font-bold dark:text-white">Notification plateforme</h3>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                  <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mb-1">Fonctionnalité à venir</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    La notification en temps réel via la plateforme sera disponible prochainement (SignalR / Firebase).
                    En attendant, utilisez l'email ou le lien sécurisé.
                  </p>
                </div>
              </section>
            )}

            {/* ── Récapitulatif de la shortlist ─────────────────────── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
                    <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM2 7.5a1 1 0 011-1h10a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1zM3 12a1 1 0 100 2h10a1 1 0 100-2H3z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold dark:text-white">List sélectionnée</h3>
              </div>
              <div className="border border-gray-200 dark:border-[#1b2e4b] rounded-xl p-3 bg-gray-50 dark:bg-[#0e1726]">
                <p className="font-semibold text-sm dark:text-white">{shortlist.title}</p>
                <div className="flex items-center gap-6 mt-2 text-[10px] text-gray-500 dark:text-gray-400 font-medium flex-wrap">
                  <span className="flex flex-col">
                    <span className="text-gray-400 uppercase tracking-wider">Profils</span>
                    <span className="text-sm font-bold dark:text-white mt-0.5">{shortlist.items.length} candidat{shortlist.items.length > 1 ? 's' : ''}</span>
                  </span>
                  <span className="flex flex-col">
                    <span className="text-gray-400 uppercase tracking-wider">Créée le</span>
                    <span className="text-sm font-bold dark:text-white mt-0.5">
                      {new Date(shortlist.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </span>
                  {daysLeft !== null && (
                    <span className="flex flex-col">
                      <span className="text-gray-400 uppercase tracking-wider">Expiration</span>
                      <span className={`text-sm font-bold mt-0.5 ${daysLeft < 7 ? 'text-red-500' : 'text-amber-500'}`}>
                        Dans {daysLeft} jour{daysLeft > 1 ? 's' : ''}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Colonne droite — Aperçu + profils inclus */}
          <div className="w-72 shrink-0 overflow-y-auto px-5 py-5 space-y-4 bg-gray-50 dark:bg-[#080f1e]">

            {/* Carte URL sécurisée */}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Aperçu du lien sécurisé</p>
              <div className="bg-gray-900 rounded-xl p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex-1 bg-gray-800 rounded px-2 py-0.5 flex items-center gap-1">
                    <ShieldIcon />
                    <p className="text-[9px] text-gray-400 font-mono truncate">{displayUrl}</p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] text-emerald-400 font-bold tracking-wider">● ACCÈS SÉCURISÉ ACTIF</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">{shortlist.title}</p>
                  <div className="flex -space-x-1.5 mt-2">
                    {shortlist.items.slice(0, 4).map((item) => {
                      const initials = `${item.firstName.charAt(0)}${item.lastName.charAt(0)}`;
                      return (
                        <div key={item.itemId} className="w-6 h-6 rounded-full bg-primary/40 border-2 border-gray-800 flex items-center justify-center text-[8px] text-white font-bold shrink-0 overflow-hidden">
                          {item.avatarUrl ? <img src={item.avatarUrl} className="w-full h-full rounded-full object-cover" alt="" /> : initials}
                        </div>
                      );
                    })}
                    {shortlist.items.length > 4 && (
                      <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-[8px] text-gray-300 font-bold">
                        +{shortlist.items.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <span className="text-[8px] text-gray-500">
                      STATUT : {shortlist.status === 'sent' ? 'ENVOYÉE' : shortlist.status === 'draft' ? 'BROUILLON' : shortlist.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <div className="flex-1 bg-gray-800 rounded px-2 py-1.5 text-[9px] text-gray-400 font-mono truncate">
                    {displayUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`shrink-0 px-2 py-1.5 rounded text-[9px] font-semibold flex items-center gap-1 transition-all ${
                      copied ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? 'Copié !' : 'Copier'}
                  </button>
                </div>
              </div>
            </div>

            {/* Profils inclus */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Profils inclus</p>
                <span className="text-[10px] font-bold text-gray-500">{shortlist.items.length} total</span>
              </div>
              <div className="space-y-1.5">
                {shortlist.items.slice(0, 4).map((item) => {
                  const initials = `${item.firstName.charAt(0)}${item.lastName.charAt(0)}`.toUpperCase();
                  return (
                    <div key={item.itemId} className="flex items-center gap-2.5 p-2 bg-white dark:bg-[#0e1726] rounded-xl border border-gray-200 dark:border-[#1b2e4b]">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 overflow-hidden">
                        {item.avatarUrl ? <img src={item.avatarUrl} className="w-full h-full object-cover" alt="" /> : initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold dark:text-white truncate">{item.firstName} {item.lastName}</p>
                        <p className="text-[10px] text-gray-400 truncate">{item.jobTitle}</p>
                      </div>
                      {item.relevanceScore != null && (
                        <div className="shrink-0 text-right">
                          <p className="text-xs font-bold text-primary">{Math.round(item.relevanceScore)}%</p>
                          <p className="text-[8px] text-gray-400">SCORE</p>
                        </div>
                      )}
                    </div>
                  );
                })}
                {shortlist.items.length > 4 && (
                  <p className="text-center text-[10px] text-primary font-semibold py-1">
                    + {shortlist.items.length - 4} autre{shortlist.items.length - 4 > 1 ? 's' : ''} profil{shortlist.items.length - 4 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Historique */}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Historique</p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-600 dark:text-gray-300">Brouillon créé</p>
                    <p className="text-[9px] text-gray-400">
                      {new Date(shortlist.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                {shortlist.status === 'sent' && (
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-600 dark:text-gray-300">Envoyée au client</p>
                    </div>
                  </div>
                )}
                {shortlist.status === 'draft' && (
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5 shrink-0" />
                    <p className="text-[10px] text-gray-400">En attente d'envoi…</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Pied de page ─────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#1b2e4b] shrink-0 bg-white dark:bg-[#0e1726]">
          {mode !== 'notification' && (
            <button
              onClick={handleSend}
              disabled={loading || (mode === 'email' && !clientEmail.trim())}
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                <CheckIcon />
              ) : (
                <SendIcon />
              )}
              {success ? '✓ ' + success : sendLabel[mode]}
            </button>
          )}
          <p className="text-center text-[10px] text-gray-400 mt-1.5">
            {mode === 'email' && "Le client recevra un email avec le lien d'accès sécurisé."}
            {mode === 'lien'  && "Partagez ce lien directement avec votre client."}
            {mode === 'pdf'   && "Le rapport sera téléchargé au format HTML imprimable."}
            {mode === 'notification' && "Fonctionnalité disponible prochainement."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharePanel;