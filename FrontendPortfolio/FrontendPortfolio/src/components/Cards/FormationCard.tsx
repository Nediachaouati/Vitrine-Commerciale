/*import React from 'react';
import { Card, CardHeader, CardBody } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { IconBook, IconBook2, IconBookFilled, IconBookmark, IconBookmarkAi, IconBookmarkMinus, IconHeart } from '@tabler/icons-react';
import IconTrashLines from '../Icon/IconTrashLines';
import { GetUrlImage } from '../../helpers';

interface FormationCardProps {
  formationId: number;
  title: string;
  description: string;
  image: string;
  dateCreation: Date | null;
  datePublication: Date | null;
  link: any;
  categoryName?: string;
  niveauName?: string;
  // --- NOUVELLES PROPS ---
  onDelete?: (formationId: number) => void; // Fonction de suppression, optionnelle
  showDeleteButton?: boolean; // Booléen pour afficher ou non le bouton de suppression, optionnel
}

const FormationCard = ({
  formationId,
  title,
  description,
  image,
  dateCreation,
  datePublication,
  link,
  categoryName,
  niveauName,
  onDelete, // Déstructuration de la nouvelle prop
  showDeleteButton, // Déstructuration de la nouvelle prop
}: FormationCardProps) => {
  const navigate = useNavigate();

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Non publié';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Date invalide';
    }
  };

  const navigateToLink = () => {
    navigate(link);
  };

  // Gestionnaire pour le clic sur le bouton de suppression
  // Arrête la propagation de l'événement pour éviter de naviguer vers le lien de la carte
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche l'événement de cliquer sur la carte et de déclencher navigateToLink
    if (onDelete) {
      onDelete(formationId); // Appelle la fonction onDelete passée par le parent
    }
  };

  return (
    <Card className="w-full h-full bg-white shadow-none border rounded-md relative cursor-pointer hover:shadow-md transition-shadow" onClick={navigateToLink}>
      <CardHeader floated={false} className="relative h-48 m-0 rounded-t-md rounded-b-none">
        <img src={image ? GetUrlImage(`${image}`) : 'assets/images/formation-default.png'} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Bouton de favori (non modifié) }*/
          {/* <button className="w-7 h-7 rounded-xl bg-white flex justify-center items-center hover:bg-gray-100">
            <IconHeart className="w-4 text-gray-400" />
          </button> */}

          {/* Bouton de suppression, affiché conditionnellement */}
         /* {showDeleteButton && ( // N'affiche le bouton que si showDeleteButton est vrai
            <button
              className="w-7 h-7 rounded-xl bg-white flex justify-center items-center hover:bg-gray-100"
              onClick={handleDeleteClick} // Attachez le gestionnaire de clic ici
            >
              <IconTrashLines className="w-4 text-gray-600 hover:text-red-600" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardBody className="p-4 min-h-[160px]" onClick={navigateToLink}>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center text-xs text-gray-500 mb-2 gap-2">
          <IconBook className="w-4 h-4  " />
          <span>{categoryName}</span>
          <IconBook className="w-4 h-4  " />
          <span>{niveauName}</span>
        </div>

        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(dateCreation)}</span>
            </div>
            {datePublication && (
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatDate(datePublication)}</span>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FormationCard;
*/