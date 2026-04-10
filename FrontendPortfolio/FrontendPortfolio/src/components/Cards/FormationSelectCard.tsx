/*import React from 'react';
import { Card, CardHeader, CardBody } from '@material-tailwind/react';
import { GetUrlImage } from '../../helpers';

interface FormationSelectCardProps {
  title: string;
  description: string;
  image: string;
  dateCreation: Date | string | null;
  datePublication: Date | string | null;

  onSelect: () => void;
  selected?: boolean;
}

const FormationSelectCard = ({ title, description, image, dateCreation, datePublication, onSelect, selected }: FormationSelectCardProps) => {
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Non publié';
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return 'Date invalide';
    }
  };

  return (
    <Card className={`w-full h-full bg-white shadow-none border rounded-md relative cursor-pointer hover:shadow-md transition-shadow ${selected ? 'border-blue-500' : ''}`} onClick={onSelect}>
      <CardHeader floated={false} className="relative h-48 m-0 rounded-t-md rounded-b-none">
        <img src={image ? GetUrlImage(`${image}`) : 'assets/images/formation-default.png'} alt={title} className="w-full h-full object-cover" />
      </CardHeader>

      <CardBody className="p-4 min-h-[160px]">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

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

export default FormationSelectCard;
*/