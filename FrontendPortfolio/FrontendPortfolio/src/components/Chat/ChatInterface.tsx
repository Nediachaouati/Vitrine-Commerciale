/*import React, { useState, useEffect, useRef } from 'react';
import IconSend from '../Icon/IconSend';
import IconMessage from '../Icon/IconMessage';
import MessageItem from './MessageItem';
import * as signalR from '@microsoft/signalr';

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

interface ChatInterfaceProps {
  currentUserId: number;
  otherUserId: number;
  otherUserName: string;
  apiBaseUrl: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUserId,
  otherUserId,
  otherUserName,
  apiBaseUrl
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialiser la connexion SignalR
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiBaseUrl}/chathub?userId=${currentUserId}`)
      .build();

    setConnection(newConnection);
  }, [currentUserId, apiBaseUrl]);

  // Démarrer la connexion et configurer les écouteurs
  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('Connexion SignalR établie');
          setIsConnected(true);
        })
        .catch((error) => {
          console.error('Erreur de connexion SignalR:', error);
        });

      // Écouter les nouveaux messages
      connection.on('ReceiveMessage', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      // Écouter les messages modifiés
      connection.on('MessageEdited', (message: Message) => {
        setMessages(prev => prev.map(msg => 
          msg.chatMessageId === message.chatMessageId ? message : msg
        ));
      });

      // Écouter les messages supprimés
      connection.on('MessageDeleted', (message: Message) => {
        setMessages(prev => prev.map(msg => 
          msg.chatMessageId === message.chatMessageId 
            ? { ...msg, isDeleted: true, deletedAt: message.deletedAt }
            : msg
        ));
      });

      // Écouter les erreurs
      connection.on('Error', (error: string) => {
        console.error('Erreur SignalR:', error);
        alert(error);
      });

      return () => {
        connection.stop();
      };
    }
  }, [connection]);

  // Charger l'historique des messages
  useEffect(() => {
    const loadMessageHistory = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/chat/history?userId=${currentUserId}&otherUserId=${otherUserId}&take=50`
        );
        
        if (response.ok) {
          const history = await response.json();
          setMessages(history);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
      }
    };

    if (currentUserId && otherUserId) {
      loadMessageHistory();
    }
  }, [currentUserId, otherUserId, apiBaseUrl]);

  // Envoyer un nouveau message
  const sendMessage = async () => {
    if (newMessage.trim() && connection && isConnected) {
      try {
        await connection.invoke('SendMessage', currentUserId, otherUserId, newMessage.trim());
        setNewMessage('');
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
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

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du message:', error);
      alert('Erreur lors de la modification du message');
    }
  };

  // Supprimer un message
  const deleteMessage = async (messageId: number) => {
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

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      alert('Erreur lors de la suppression du message');
    }
  };

  // Gérer l'appui sur Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
            <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </div>
      </div>

      {/* Zone des messages }
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <IconMessage className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun message pour le moment</p>
            <p className="text-sm">Commencez la conversation !</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.chatMessageId}
              message={message}
              currentUserId={currentUserId}
              onEditMessage={editMessage}
              onDeleteMessage={deleteMessage}
            />
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
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200"
          >
            <IconSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;*/
