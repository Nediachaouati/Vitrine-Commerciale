/*import React, { useState } from 'react';
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

interface MessageItemProps {
  message: Message;
  currentUserId: number;
  onEditMessage: (messageId: number, newContent: string) => void;
  onDeleteMessage: (messageId: number) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUserId,
  onEditMessage,
  onDeleteMessage
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const isOwnMessage = message.senderId === currentUserId;
  const canEdit = isOwnMessage && !message.isDeleted;
  const canDelete = isOwnMessage && !message.isDeleted;

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEditMessage(message.chatMessageId, editContent.trim());
      setIsEditing(false);
    } else {
      setEditContent(message.content);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      onDeleteMessage(message.chatMessageId);
    }
  };

  if (message.isDeleted) {
    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-xs lg:max-w-md">
          <p className="text-gray-500 dark:text-gray-400 italic text-sm">
            Ce message a été supprimé
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="relative group">
        <div className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
          isOwnMessage 
            ? 'bg-blue-500 text-white' 
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
        }`}>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                >
                  <IconChecks className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
                <button
                  onClick={handleCancelEdit}
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
                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.sentAt).toLocaleTimeString()}
                </span>
                {message.isEdited && (
                  <span className={`text-xs ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    (modifié)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Boutons d'action - apparaissent au survol pour les messages de l'utilisateur }
        {isOwnMessage && !isEditing && (
          <div className="absolute -top-8 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Modifier le message"
              >
                <IconEdit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
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
  );
};

export default MessageItem;
*/