import React, { useEffect, useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext, getIn } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_red.css';
import Select, { Props as ReactSelectProps } from 'react-select';
import IconForm from './iconForm';
import { SubmitPayload } from '../../helpers/model/utils/SubmitPayload';
import { MethodFormEnum } from '../../helpers/model/enum/method.form.enum';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import IconX from '../../components/Icon/IconX'; // si tu veux le bouton remove comme ton exemple
import IconCalendar from '../Icon/IconCalendar';

type Option = { description: string; id: string | number; firstname: string; lastname: string };
type RSOption = { value: string | number; label: string };

type FieldConfig = {
  name: string;
  label: string;
  type: string;
  inputType?: string;
  options?: Option[];
  rsOptions?: RSOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  accept?: string;
  flatpickrOptions?: Record<string, any>;
  selectProps?: Partial<ReactSelectProps>;
};

type FormConfig = {
  fields: FieldConfig[];
  validationSchema: Record<string, any>;
  buttonPosition?: string;
};

type FormDynamicProps = {
  formConfig: FormConfig;
  initialValues: Record<string, any>;
  formClass: string;

  onSubmit: (payload: SubmitPayload, helpers: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }) => void;

  isRtl?: boolean;
  methodForm?: MethodFormEnum;

  // ✅ NEW: cancel handler
  onCancel?: () => void;
};

// ---------- Helpers ----------
const mapLegacyOptionsToRS = (options?: Option[]): RSOption[] => {
  if (!options?.length) return [];
  return options.map((o) => ({
    value: o.id,
    label: o.description ? o.description : `${o.firstname ?? ''} ${o.lastname ?? ''}`.trim(),
  }));
};
// ---------- Image Upload Single ----------
// ✅ remplace ton ImageSingleField par ce bloc
// ✅ Remplace ton ImageSingleField par ceci
const ImageSingleField = (props: { name: string; disabled?: boolean; maxNumber?: number }) => {
  const { name, disabled, maxNumber = 1 } = props;
  const { values, setFieldValue } = useFormikContext<any>();

  const formikImages: ImageListType = getIn(values, name) ?? [];
  const [images, setImages] = React.useState<ImageListType>(formikImages);

  // Sync formik -> state local (force re-render)
  React.useEffect(() => {
    setImages(formikImages);
  }, [JSON.stringify(formikImages)]);

  const onChange = (imageList: ImageListType) => {
    // ✅ toujours garder la DERNIÈRE image uploadée
    const last = imageList?.length ? imageList[imageList.length - 1] : null;
    const next: ImageListType = last ? [{ ...last }] : [];

    setImages(next);
    setFieldValue(name, next);
  };

  // ✅ force remount du composant ImageUploading
  const uploadKey = images?.[0]?.dataURL ?? 'empty';

  return (
    <div className="custom-file-container">
      <ImageUploading key={uploadKey} value={images} onChange={onChange} maxNumber={maxNumber} multiple={false}>
        {({ imageList, onImageUpload, onImageRemoveAll }) => (
          <div className="upload__image-wrapper">
            <button type="button" className="btn btn-outline-primary w-full" onClick={onImageUpload} disabled={disabled}>
              Choisir image...
            </button>

            <div className="mt-3">
              {imageList?.length ? (
                imageList.map((image, index) => (
                  <div key={image.dataURL ?? index} className="flex flex-row justify-center items-center w-full  ">
                    {/* ✅ bouton supprimer */}

                    <div className="relative">
                      <button
                        type="button"
                        className="custom-file-container__image-clear bg-dark-light dark:bg-dark dark:text-white-dark rounded-full block w-fit p-0.5 absolute top-1 -right-10 z-10"
                        title="Supprimer image"
                        onClick={() => {
                          onImageRemoveAll();
                          setImages([]);
                          setFieldValue(name, []);
                        }}
                        disabled={disabled}
                      >
                        <IconX className="w-6 h-6 stroke-red-400" />
                      </button>
                      <img src={image.dataURL} alt="preview" className="object-cover shadow rounded max-w-md" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-row justify-center items-center w-full  ">
                  <img src="/assets/images/file-preview.svg" className="w-full object-cover shadow rounded max-w-md" alt="" />
                </div>
              )}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

// ---------- Image Upload Multi ----------
const ImageMultiField = (props: { name: string; disabled?: boolean; maxNumber?: number }) => {
  const { name, disabled, maxNumber = 69 } = props;
  const { values, setFieldValue } = useFormikContext<any>();

  const images: ImageListType = getIn(values, name) ?? [];

  const onChange = (imageList: ImageListType) => {
    setFieldValue(name, imageList); // stocke toute la liste
  };

  return (
    <div className="custom-file-container">
      <ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber}>
        {({ imageList, onImageUpload, onImageRemove }) => (
          <div className="upload__image-wrapper">
            <button type="button" className="btn btn-outline-primary" onClick={onImageUpload} disabled={disabled}>
              Choisir images...
            </button>

            <div className="mt-3 grid gap-4 sm:grid-cols-3 grid-cols-1">
              {imageList?.length ? (
                imageList.map((image, index) => (
                  <div key={index} className="relative">
                    <button
                      type="button"
                      className="bg-dark-light dark:bg-dark dark:text-white-dark rounded-full block w-fit p-0.5 absolute top-1 left-1 w-full"
                      onClick={() => onImageRemove(index)}
                      disabled={disabled}
                      title="Supprimer image"
                    >
                      <IconX className="w-3 h-3" />
                    </button>

                    <img src={image.dataURL} alt="preview" className="object-cover shadow rounded w-full !max-h-48" />
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <img src="/assets/images/file-preview.svg" className=" w-full m-auto" alt="" />
                </div>
              )}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

// ---------- Champs spéciaux ----------
const QuillField = (props: { name: string; placeholder?: string; disabled?: boolean }) => {
  const { name, placeholder, disabled } = props;
  const { values, setFieldValue } = useFormikContext<any>();
  const value = getIn(values, name) ?? '';

  return (
    <div className="relative">
      <ReactQuill value={value} onChange={(v) => setFieldValue(name, v)} readOnly={!!disabled} placeholder={placeholder} theme="snow" />
    </div>
  );
};

const FileField = (props: { name: string; accept?: string; disabled?: boolean }) => {
  const { name, accept, disabled } = props;
  const { setFieldValue } = useFormikContext<any>();

  return (
    <input
      type="file"
      accept={accept}
      disabled={disabled}
      className="form-input ps-30 placeholder:text-white-dark"
      onChange={(e) => {
        const file = e.currentTarget.files?.[0] ?? null;
        setFieldValue(name, file);
      }}
    />
  );
};

const DateTimeField = (props: { name: string; placeholder: string; disabled?: boolean; flatpickrOptions?: Record<string, any> }) => {
  const { name, disabled, flatpickrOptions, placeholder } = props;
  const { values, setFieldValue } = useFormikContext<any>();
  const value = getIn(values, name) ?? null;

  return (
    <div className="flex flex-row items-center relative">
      <Flatpickr
        options={{
          enableTime: false,
          dateFormat: 'Y-m-d',
          position: 'auto left',
          ...flatpickrOptions,
        }}
        placeholder={placeholder ?? 'Select Date'}
        value={value}
        disabled={disabled}
        className="form-input placeholder:text-white-dark"
        onChange={(dates: Date[]) => setFieldValue(name, dates?.[0] ?? null)}
      />
      <IconCalendar className="ml-3 w-5 h-5 text-white-dark absolute right-3" />
    </div>
  );
};

// ---------- Select (react-select) ----------
const SelectSingleField = (props: { name: string; options: RSOption[]; placeholder?: string; disabled?: boolean; isRtl?: boolean; selectProps?: FieldConfig['selectProps'] }) => {
  const { name, options, placeholder, disabled, isRtl, selectProps } = props;
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const rawValue = getIn(values, name);
  const hasError = !!getIn(touched, name) && !!getIn(errors, name);

  const selected = useMemo(() => options.find((o) => o.value === rawValue) ?? null, [rawValue, options]);

  return (
    <Select
      className="custom-select"
      classNamePrefix="custom-select"
      instanceId={name}
      placeholder={placeholder ?? 'Select an option'}
      options={options}
      value={selected}
      onChange={(opt) => setFieldValue(name, (opt as RSOption | null)?.value ?? null)}
      isDisabled={disabled}
      isClearable
      isSearchable
      // Forcer le menu au-dessus des modals (z-index)
      menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        control: (base, state) => ({
          ...base,
          borderColor: hasError ? '#ef4444' : base.borderColor,
          boxShadow: hasError ? '0 0 0 1px #ef4444' : state.isFocused ? base.boxShadow : 'none',
          minHeight: '42px',
        }),
      }}
      // RTL si besoin

      {...(isRtl ? { isRtl: true, menuPlacement: 'auto' as const } : {})}
      {...selectProps}
    />
  );
};

const SelectMultiField = (props: { name: string; options: RSOption[]; placeholder?: string; disabled?: boolean; isRtl?: boolean; selectProps?: FieldConfig['selectProps'] }) => {
  const { name, options, placeholder, disabled, isRtl, selectProps } = props;
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const rawValues: (string | number)[] = getIn(values, name) ?? [];
  const hasError = !!getIn(touched, name) && !!getIn(errors, name);

  const selected = useMemo(() => options.filter((o) => rawValues?.includes(o.value)), [rawValues, options]);

  return (
    <Select
      className="custom-select"
      classNamePrefix="custom-select"
      instanceId={name}
      placeholder={placeholder ?? 'Select options'}
      options={options}
      value={selected}
      onChange={(opts) => setFieldValue(name, (opts as RSOption[] | null)?.map((o) => o.value) ?? [])}
      isMulti
      isDisabled={disabled}
      isClearable
      isSearchable
      menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        control: (base, state) => ({
          ...base,
          borderColor: hasError ? '#ef4444' : base.borderColor,
          boxShadow: hasError ? '0 0 0 1px #ef4444' : state.isFocused ? base.boxShadow : 'none',
          minHeight: '42px',
        }),
      }}
      {...(isRtl ? { isRtl: true, menuPlacement: 'auto' as const } : {})}
      {...selectProps}
    />
  );
};

// ---------- DynamicForm ----------
const FormDynamicV3 = (props: FormDynamicProps) => {
  const { formConfig, initialValues, formClass, onSubmit, onCancel, isRtl = false, methodForm = MethodFormEnum.ADD } = props;

  // ✅ DEL : message + Annuler + Supprimer
  if (methodForm === MethodFormEnum.DEL) {
    return (
      <Formik
        initialValues={{}}
        onSubmit={(_, helpers) => {
          onSubmit({ method: MethodFormEnum.DEL }, helpers);
        }}
      >
        {({ isSubmitting }) => (
          <Form className={`p-6 rounded-lg border border-danger/30 bg-danger/5 ${formClass}`}>
            
            <p className="text-white-dark text-center mb-6">Vous êtes sur le point de supprimer cet élément. Cette action est irréversible.</p>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onCancel} className="btn btn-outline-danger uppercase">
                Annuler
              </button>

              <button type="submit" disabled={isSubmitting} className="btn bg-danger text-white border-0 uppercase shadow-[0_10px_20px_-10px_#ef4444]">
                Supprimer
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }

  // ✅ ADD / PUT : formulaire normal + Annuler + Enregistrer
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={Yup.object().shape(formConfig.validationSchema)}
      onSubmit={(values, helpers) => {
        onSubmit({ method: methodForm as MethodFormEnum.ADD | MethodFormEnum.PUT, values }, helpers);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className={` ${formClass}`}>
            {formConfig.fields.map((field) => {
              const isBaseInput = field.type === 'text' || field.type === 'number' || field.type === 'email' || field.type === 'password';

              const rsOptions = field.rsOptions?.length ? field.rsOptions : mapLegacyOptionsToRS(field.options);

              return (
                <div key={field.name} className={`${field.className ?? ''}`}>
                  <label className="block font-medium mb-1">{field.label}</label>

                  {field.type === 'select' && (
                    <div className="relative text-white-dark">
                      <SelectSingleField name={field.name} options={rsOptions} placeholder={field.placeholder} disabled={field.disabled} isRtl={isRtl} selectProps={field.selectProps} />
                      <IconForm nameIcon={field.name} />
                    </div>
                  )}

                  {field.type === 'multiselect' && (
                    <div className="relative text-white-dark">
                      <SelectMultiField
                        name={field.name}
                        options={rsOptions}
                        placeholder={field.placeholder ?? 'Select options'}
                        disabled={field.disabled}
                        isRtl={isRtl}
                        selectProps={field.selectProps}
                      />
                      <IconForm nameIcon={field.name} />
                    </div>
                  )}

                  {field.type === 'radio' && (
                    <div className="flex flex-wrap gap-3">
                      {field.options?.map((option: any) => (
                        <label key={option.id.toString()} className="inline-flex items-center gap-2">
                          <Field type="radio" name={field.name} value={String(option.id)} disabled={field.disabled} />
                          <span>{option.description}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'textarea' && (
                    <div className="relative text-white-dark">
                      <Field
                        as="textarea"
                        rows={4}
                        name={field.name}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        className={`form-input ps-30 placeholder:text-white-dark ${field.className ?? ''}`}
                      />
                      <IconForm nameIcon={field.name} />
                    </div>
                  )}

                  {field.type === 'file' && (
                    <div className="relative text-white-dark">
                      <FileField name={field.name} accept={field.accept} disabled={field.disabled} />
                      <IconForm nameIcon={field.name} />
                    </div>
                  )}

                  {field.type === 'quill' && (
                    <div className="relative text-white-dark">
                      <QuillField name={field.name} placeholder={field.placeholder} disabled={field.disabled} />
                    </div>
                  )}

                  {field.type === 'date' && (
                    <div className={field.className ?? ''}>
                      <DateTimeField name={field.name} disabled={field.disabled} placeholder={field.placeholder!} flatpickrOptions={field.flatpickrOptions} />
                    </div>
                  )}
                  {field.type === 'image' && (
                    <div className="relative text-white-dark">
                      <ImageSingleField name={field.name} disabled={field.disabled} />

                      <IconForm nameIcon={field.name} />
                    </div>
                  )}

                  {field.type === 'images' && (
                    <div className="relative text-white-dark">
                      <ImageMultiField name={field.name} disabled={field.disabled} maxNumber={field.flatpickrOptions?.maxNumber ?? 69} />
                      <IconForm nameIcon={field.name} />
                    </div>
                  )}

                  {isBaseInput && (
                    <div className="relative text-white-dark">
                      <Field
                        name={field.name}
                        type={field.inputType ?? field.type}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        className={`form-input ps-30 placeholder:text-white-dark ${field.className ?? ''}`}
                      />
                      {/* <IconForm nameIcon={field.name} /> */}
                    </div>
                  )}

                  <ErrorMessage name={field.name} className="text-danger mt-1 block" component="div" />
                </div>
              );
            })}
          </div>

          <div className={`flex justify-end col-span-2  bottom-6 right-20 z-50 gap-3 ${formConfig.buttonPosition ?? ''}`}>
            <button type="button" onClick={onCancel} className="btn btn-outline-danger uppercase !mt-6 shadow-[0_10px_20px_-10px_#d50a12]">
              Annuler
            </button>

            <button type="submit" disabled={isSubmitting} className="btn bg-primary text-white !mt-6 border-0 uppercase shadow-[0_10px_20px_-10px_#d50a12]">
              Enregistrer
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormDynamicV3;
