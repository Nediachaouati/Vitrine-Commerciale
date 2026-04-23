// pages/PortfolioBuilder/ChatPanel.tsx
import { useRef, useEffect, useState } from 'react';
import { useRedux } from '../../../../hooks';
import { ChatSendMessage, ClearConversation } from '../../../../Redux/portfolio/actions';
import type { CollaboratorFull, PortfolioItem, ChatMessageDto } from '../../../../helpers/model/dto/collaborator.dto';

interface Props {
  collab: CollaboratorFull;
  portfolios: PortfolioItem[];
  selectedPortfolioId: number | null;
}

const ChatPanel = ({ collab, portfolios, selectedPortfolioId }: Props) => {
  const { dispatch, appSelector } = useRedux();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { chatMessages, isChatLoading } = appSelector((state: any) => state.Portfolio);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim() || isChatLoading || !selectedPortfolioId) return;

    const userMsg: ChatMessageDto = { role: 'user', content: input.trim() };
    const newMessages: ChatMessageDto[] = [...chatMessages, userMsg];

    dispatch(ChatSendMessage(selectedPortfolioId, newMessages, collab.collaboratorId));
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white-light dark:border-[#1b2e4b] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-danger flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold dark:text-white text-sm">Assistant Portfolio</h3>
          <p className="text-xs text-gray-400">
            {selectedPortfolioId
              ? `Portfolio sélectionné — dis-moi quoi afficher`
              : 'Sélectionne ou crée un portfolio pour commencer'}
          </p>
        </div>
        <button
          onClick={() => dispatch(ClearConversation())}
          className="text-xs text-gray-400 hover:text-danger transition px-2 py-1 rounded border border-gray-200 dark:border-[#1b2e4b]"
        >
          + Nouveau
        </button>
      </div>

      {/* Info profil dispo */}
      {chatMessages.length === 0 && selectedPortfolioId && (
        <div className="mx-4 mt-4 p-3 bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-xs text-primary font-semibold">
            📋 Profil chargé : {collab.collaboratorSkills.length} skills · {collab.experiences.length} expériences · {collab.projects.length} projets
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Exemple : "Affiche seulement mes 5 meilleurs skills" ou "Cache les projets de stage"
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Je gère la sélection de ton portfolio.<br />
              Dis-moi quels éléments afficher ou masquer.
            </p>
          </div>
        )}

        {chatMessages.map((msg: ChatMessageDto, i: number) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-danger flex items-center justify-center mr-2 shrink-0 mt-1">
                <span className="text-white text-[10px] font-bold">AI</span>
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-danger text-white rounded-tr-none'
                : 'bg-white-light dark:bg-[#1b2e4b] dark:text-white rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isChatLoading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-danger flex items-center justify-center mr-2 shrink-0">
              <span className="text-white text-[10px] font-bold">AI</span>
            </div>
            <div className="bg-white-light dark:bg-[#1b2e4b] rounded-2xl rounded-tl-none px-4 py-2.5">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white-light dark:border-[#1b2e4b]">
        {!selectedPortfolioId && (
          <p className="text-xs text-warning text-center mb-2">
            ⚠️ Sélectionne un portfolio pour activer le chat
          </p>
        )}
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Affiche seulement mes projets React..."
            rows={1}
            disabled={isChatLoading || !selectedPortfolioId}
            className="flex-1 form-textarea resize-none text-sm py-2.5 rounded-xl disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isChatLoading || !selectedPortfolioId}
            className="btn btn-danger rounded-xl px-4 disabled:opacity-40"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;