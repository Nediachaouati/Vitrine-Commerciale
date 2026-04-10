/*import React, { useState, useEffect, useRef } from 'react';
import IconSend from '../Icon/IconSend';
import IconMessage from '../Icon/IconMessage';
import IconEdit from '../Icon/IconEdit';
import IconTrash from '../Icon/IconTrash';
import IconChecks from '../Icon/IconChecks';
import IconX from '../Icon/IconX';

interface Message {
  chatMessageId: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  editedAt?: string;
  deletedAt?: string;
}

interface SimpleChatInterfaceProps {
  currentUserId: number;
  otherUserId: number;
  otherUserName: string;
  apiBaseUrl: string;
}

const SimpleChatInterface: React.FC<SimpleChatInterfaceProps> = ({
  currentUserId,
  otherUserId,
  otherUserName,
  apiBaseUrl
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Charger l'historique des messages
  useEffect(() => {
    const loadMessageHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/chat/history?userId=${currentUserId}&otherUserId=${otherUserId}&take=50`
        );
        
        if (response.ok) {
          const history = await response.json();
          setMessages(history);
        } else {
          console.error('Erreur lors du chargement de l\'historique');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId && otherUserId) {
      loadMessageHistory();
    }
  }, [currentUserId, otherUserId, apiBaseUrl]);

  // Envoyer un nouveau message
  const sendMessage = async () => {
    if (newMessage.trim()) {
      const messageContent = newMessage.trim();
      setNewMessage(''); // Vider immédiatement pour une meilleure UX
      
      try {
        const response = await fetch(`${apiBaseUrl}/api/chat/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderId: currentUserId,
            receiverId: otherUserId,
            content: messageContent
          })
        });

        if (response.ok) {
          const newMessage = await response.json();
          setMessages(prev => [...prev, newMessage]);
        } else {
          // En cas d'erreur, remettre le message dans le champ
          setNewMessage(messageContent);
          const error = await response.text();
          alert(`Erreur lors de l'envoi: ${error}`);
        }
      } catch (error) {
        // En cas d'erreur, remettre le message dans le champ
        setNewMessage(messageContent);
        console.error('Erreur lors de l\'envoi du message:', error);
        alert('Erreur lors de l\'envoi du message');
      }
    }
  };

  // Modifier un message
  const editMessage = async (messageId: number, newContent: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/chat/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          newContent: newContent
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessages(prev => prev.map(msg => 
          msg.chatMessageId === messageId 
            ? { ...msg, content: newContent, isEdited: true, editedAt: result.editedAt }
            : msg
        ));
        setEditingMessageId(null);
        setEditContent('');
      } else {
        const error = await response.text();
        alert(`Erreur: ${error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du message:', error);
      alert('Erreur lors de la modification du message');
    }
  };

  // Supprimer un message
  const deleteMessage = async (messageId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId
        })
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.chatMessageId === messageId 
            ? { ...msg, isDeleted: true, deletedAt: new Date().toISOString() }
            : msg
        ));
      } else {
        const error = await response.text();
        alert(`Erreur: ${error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      alert('Erreur lors de la suppression du message');
    }
  };

  // Commencer l'édition
  const startEdit = (messageId: number, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditContent(currentContent);
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  // Sauvegarder l'édition
  const saveEdit = () => {
    if (editContent.trim() && editingMessageId) {
      editMessage(editingMessageId, editContent.trim());
    }
  };

  // Gérer l'appui sur Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (editingMessageId) {
        saveEdit();
      } else {
        sendMessage();
      }
    }
  };

  const isOwnMessage = (message: Message) => message.senderId === currentUserId;
  const canEdit = (message: Message) => isOwnMessage(message) && !message.isDeleted;

  return (
    <div className="flex flex-col h-full">
      {/* En-tête du chat }
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <IconMessage className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {otherUserName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chat avec modification et suppression
            </p>
          </div>
        </div>
      </div>

      {/* Zone des messages }
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p>Chargement des messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <IconMessage className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun message pour le moment</p>
            <p className="text-sm">Commencez la conversation !</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.chatMessageId} className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className="relative group">
                <div className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
                  isOwnMessage(message) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}>
                  {message.isDeleted ? (
                    <p className="italic text-sm opacity-75">
                      Ce message a été supprimé
                    </p>
                  ) : editingMessageId === message.chatMessageId ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <IconChecks className="w-4 h-4" />
                          <span>Sauvegarder</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <IconX className="w-4 h-4" />
                          <span>Annuler</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs ${
                          isOwnMessage(message) ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.sentAt).toLocaleTimeString()}
                        </span>
                        {message.isEdited && (
                          <span className={`text-xs ${
                            isOwnMessage(message) ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            (modifié)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Boutons d'action - apparaissent au survol pour les messages de l'utilisateur }
                {isOwnMessage(message) && !message.isDeleted && editingMessageId !== message.chatMessageId && (
                  <div className="absolute -top-8 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                    {canEdit(message) && (
                      <button
                        onClick={() => startEdit(message.chatMessageId, message.content)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        title="Modifier le message"
                      >
                        <IconEdit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    )}
                    {canEdit(message) && (
                      <button
                        onClick={() => deleteMessage(message.chatMessageId)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        title="Supprimer le message"
                      >
                        <IconTrash className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie }
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            rows={1}
            disabled={editingMessageId !== null}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || editingMessageId !== null}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200"
          >
            <IconSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleChatInterface;*/
