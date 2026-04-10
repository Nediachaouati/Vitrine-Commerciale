/*import React, { useMemo, useState } from 'react';
import { IconPhoto } from '@tabler/icons-react';

import PopFormDynamicV3 from '../../components/Form/PopFormDynamicV3';
import { Cours, GetUrlImage, MethodFormEnum, SubmitPayload } from '../../helpers';

interface CourImageProps {
  cour: Cours;
  title: string;
  imageUrl: string;
  OnSavePhoto: (payload: SubmitPayload) => Promise<void>;
}

const CourImage: React.FC<CourImageProps> = ({ cour, imageUrl, title, OnSavePhoto }) => {
  const [showPop, setShowPop] = useState(false);
  const bgUrl = useMemo(() => GetUrlImage(imageUrl), [imageUrl]);

  const initialValues = useMemo(
    () => ({
      id: cour.id ?? null,
      photo: '',
    }),
    [cour.id]
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
    <div className="relative h-[16rem] bg-black rounded-lg">
      {/* Image de fond }
      <img src={bgUrl} alt="Cour" className="absolute inset-0 h-full w-full object-cover blur-sm z-0 pointer-events-none" />

      {/* Bouton top-right }
      <div className="absolute top-3 right-3 z-20">
        <button type="button" className="w-8 h-8 rounded-xl bg-white flex justify-center items-center hover:bg-gray-100" onClick={() => setShowPop(true)}>
          <IconPhoto className="w-4 text-gray-600 hover:text-red-600" />
        </button>
      </div>

      {/* Contenu }
      <div className="absolute top-40 left-20 z-10">
        <div className="flex flex-row items-end">
          <img src={bgUrl} alt="Cour Thumbnail" className="object-cover w-[100px] h-[100px] border-4 mt-10 bg-white" />
          <h1 className="text-xl font-bold px-2 text-gray-600">{title}</h1>
        </div>
      </div>

      {/* Popup Upload Photo }
      <PopFormDynamicV3
        show={showPop}
        onClose={() => setShowPop(false)}
        onSubmit={handleSubmitPop}
        title="Mettre à jour la photo"
        message="Choisissez une nouvelle image pour le cours."
        initialValues={initialValues}
        formConfig={formConfig}
        methodForm={MethodFormEnum.PUT}
        formClass="grid grid-cols-2 gap-4"
        largeur={2}
      />
    </div>
  );
};

export default CourImage;
*/