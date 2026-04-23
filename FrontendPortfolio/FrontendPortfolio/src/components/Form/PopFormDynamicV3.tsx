// PopFormDynamicV3.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IconX } from '@tabler/icons-react';

import FormDynamicV3 from './FormDynamicV3';

import { SubmitPayload } from '../../helpers/model/utils/SubmitPayload';
import { MethodFormEnum } from '../../helpers/model/enum/method.form.enum';


interface PopFormDynamicV3Props {
  onSubmit: (payload: SubmitPayload) => void;
  onClose: () => void;
  show: boolean;
  title: string;
  message: string;
  initialValues: any;
  formConfig: any;
  formClass?: string;
  methodForm?: MethodFormEnum;
  isRtl?: boolean;
  largeur?: number;
}

const PopFormDynamicV3 = (props: PopFormDynamicV3Props) => {
  const { show, title, message, onClose, onSubmit, initialValues, formConfig, formClass = 'space-y-5', methodForm = MethodFormEnum.ADD, isRtl = false } = props;

  const handleSubmit = (payload: SubmitPayload) => {
    console.log('PopFormDynamicV3 handleSubmit called with payload:', payload);
    onSubmit(payload);
  };
  // console.log('PopFormDynamicV3 rendered with formConfig:', formConfig);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" open={show} onClose={() => {}} className="relative z-[51]">
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-[black]/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`panel border-0 rounded-lg overflow-visible  w-full max-w-${props.largeur ? String(props.largeur) : ''}xl text-black dark:text-white-dark relative`}>
                <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                  <IconX />
                </button>

                <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
                <Dialog.Description className="mt-2">{message}</Dialog.Description>

                <div className="mt-5">
                  <FormDynamicV3
                    methodForm={methodForm}
                    formConfig={formConfig}
                    initialValues={initialValues}
                    formClass={formClass}
                    onSubmit={handleSubmit}
                    isRtl={isRtl}
                    onCancel={onClose} // ✅ NEW
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PopFormDynamicV3;
