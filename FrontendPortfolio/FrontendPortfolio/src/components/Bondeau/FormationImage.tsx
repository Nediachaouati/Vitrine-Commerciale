/* components/CourseImage.tsx
import React, { useMemo, useState } from 'react';
import { IconPhoto } from '@tabler/icons-react';
import * as Yup from 'yup';

import PopFormDynamicV3 from '../../components/Form/PopFormDynamicV3';
import { Formations, FormationUpdateDto, GetUrlImage, MethodFormEnum, SubmitPayload } from '../../helpers';
import { el } from '@fullcalendar/core/internal-common';

interface FormationImageProps {
  formation: Formations; // ✅ pour avoir l'id + imageUrl + titre si besoin
  title: string;
  imageUrl: string;

  OnSavePhoto: (dto: SubmitPayload) => Promise<void>; // ✅ comme FormationInformation
}

const FormationImage: React.FC<FormationImageProps> = ({ formation, imageUrl, title, OnSavePhoto }) => {
  const [showPop, setShowPop] = useState(false);

  const bgUrl = useMemo(() => GetUrlImage(imageUrl), [imageUrl]);

  const initialValues = useMemo(
    () => ({
      id: formation.id ?? null,
      photo: '',
    }),
    [formation.id]
  );

  const formConfig = useMemo(
    () => ({
      fields: [
        {
          name: 'photo',
          label: 'Nouvelle photo',
          type: 'image',
          placeholder: 'Upload File...',
          className: 'md:col-span-2',
        },
      ],
      validationSchema: {},
      buttonPosition: 'inline',
    }),
    []
  );
  const handleSubmitPop = async (payload: SubmitPayload) => {
    if (payload.method !== MethodFormEnum.PUT) return;
    await OnSavePhoto(payload);
    setShowPop(false);
  };

  return (
    <div className="relative h-[16rem] bg-black rounded-lg ">
      {/* Image de fond }
      <img src={bgUrl} alt="Formation" className="absolute inset-0 h-full w-full object-cover blur-sm z-0 pointer-events-none" />

      {/* Bouton top-right }
      <div className="absolute top-3 right-3 z-20">
        <button type="button" className="w-8 h-8 rounded-xl bg-white flex justify-center items-center hover:bg-gray-100" onClick={() => setShowPop(true)}>
          <IconPhoto className="w-4 text-gray-600 hover:text-red-600" />
        </button>
      </div>

      {/* Contenu }
      <div className="absolute top-40 left-20 z-10">
        <div className="flex flex-row items-end">
          <img src={bgUrl} alt="Formation Thumbnail" className="object-cover w-[100px] h-[100px] border-4 mt-10 bg-white" />
          <h1 className="text-xl font-bold px-2 text-gray-600">{title} dfsdfsfsdfdsf</h1>
        </div>
      </div>

      {/* ✅ Popup Upload Photo }
      <PopFormDynamicV3
        show={showPop}
        onClose={() => setShowPop(false)}
        onSubmit={handleSubmitPop}
        title="Mettre à jour la photo"
        message="Choisissez une nouvelle image pour la formation."
        initialValues={initialValues}
        formConfig={formConfig}
        methodForm={MethodFormEnum.PUT}
        formClass="grid grid-cols-2 gap-4"
        largeur={2}
      />
    </div>
  );
};

export default FormationImage;*/
