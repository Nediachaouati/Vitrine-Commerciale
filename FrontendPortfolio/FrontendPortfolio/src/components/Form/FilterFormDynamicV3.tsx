import React, { useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext, getIn } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../Redux/store';
import IconX from '../Icon/IconX';
import { IconCalendar, IconFilter } from '@tabler/icons-react';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';

// ---------------- Types ----------------
type RSOption = { value: string | number; label: string };

type FieldConfig = {
  name: string;
  label: string;
  type: string; // 'text' | 'select' | 'multiselect' | 'date'; // ✅ add date
  placeholder?: string;
  disabled?: boolean;
  className?: string;

  // pour select / multiselect
  rsOptions?: RSOption[];
  flatpickrOptions?: Record<string, any>;
};

type FilterConfig = {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
  validationSchema?: Record<string, any>;
};

type FilterFormDynamicV3Props = {
  filterConfig: FilterConfig;
  initialValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;

  // optionnel: si tu veux fermer depuis parent
  onClose?: () => void;
};

// ---------------- Select Fields ----------------
const SelectSingleField = (props: { name: string; options: RSOption[]; placeholder?: string; disabled?: boolean }) => {
  const { name, options, placeholder, disabled } = props;
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
    />
  );
};

const SelectMultiField = (props: { name: string; options: RSOption[]; placeholder?: string; disabled?: boolean }) => {
  const { name, options, placeholder, disabled } = props;
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();

  const rawValues: (string | number)[] = getIn(values, name) ?? [];
  const hasError = !!getIn(touched, name) && !!getIn(errors, name);

  const selected = useMemo(() => options.filter((o) => rawValues.includes(o.value)), [rawValues, options]);

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
    />
  );
};

//---------------- Date Fields ---------------

const DateTimeField = (props: { name: string; placeholder: string; disabled?: boolean; flatpickrOptions?: Record<string, any> }) => {
  const { name, disabled, flatpickrOptions, placeholder } = props;
  const { values, setFieldValue } = useFormikContext<any>();
  const value = getIn(values, name) ?? null;

  return (
    <div className=" flex flex-row items-center relative">
      <Flatpickr
        options={{
          enableTime: false, // ✅ filtre date simple (pas d'heure)
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

// ---------------- Component ----------------
const FilterFormDynamicV3: React.FC<FilterFormDynamicV3Props> = ({ filterConfig, initialValues, onSubmit, onClose }) => {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const dispatch = useDispatch();

  const [showCustomizer, setShowCustomizer] = useState(false);
  const close = () => {
    setShowCustomizer(false);
    onClose?.();
  };

  return (
    <div>
      {/* overlay */}
      <div className={`${(showCustomizer && '!block') || ''} fixed inset-0 bg-[black]/60 z-[51] px-4 hidden transition-[display]`} onClick={close} />

      <nav
        className={`${
          (showCustomizer && 'ltr:!right-0 rtl:!left-0') || ''
        } bg-white fixed ltr:-right-[400px] rtl:-left-[400px] top-0 bottom-0 w-full max-w-[400px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 z-[51] dark:bg-black p-4`}
      >
        {/* bouton ouverture */}
        <button
          type="button"
          className=" z[10] bg-danger ltr:rounded-tl-full rtl:rounded-tr-full ltr:rounded-bl-full rtl:rounded-br-full absolute ltr:-left-12 rtl:-right-12 -top-10 bottom-20 my-auto w-12 h-10 flex justify-center items-center text-white cursor-pointer"
          onClick={() => setShowCustomizer(!showCustomizer)}
        >
          <IconFilter className="animate-[spin_3s_linear_infinite] w-5 h-5" />
        </button>

        <div className="overflow-y-auto overflow-x-hidden perfect-scrollbar h-full">
          {/* header paramétrable */}
          <div className="text-center relative pb-5">
            <button type="button" className="absolute top-0 ltr:right-0 rtl:left-0 opacity-30 hover:opacity-100 dark:text-white" onClick={close}>
              <IconX className="w-5 h-5" />
            </button>

            <h4 className="mb-1 dark:text-white">{filterConfig.title}</h4>
            {filterConfig.subtitle && <p className="text-white-dark">{filterConfig.subtitle}</p>}
          </div>

          {/* ---- Formik ---- */}
          <Formik
            initialValues={initialValues}
            validationSchema={filterConfig.validationSchema ? Yup.object().shape(filterConfig.validationSchema) : undefined}
            onSubmit={(values) => onSubmit(values)}
          >
            {({ isSubmitting, resetForm }) => (
              <Form>
                <div className="grid grid-cols-1 gap-3 mt-3">
                  {filterConfig.fields.map((field) => (
                    // ✅ CADRE POUR CHAQUE FIELD
                    <div key={field.name} className="border border-dashed border-white-light dark:border-[#1b2e4b] rounded-md mb-3 p-3">
                      {/* ----- TEXT ----- */}
                      {field.type === 'text' && (
                        <div className={field.className ?? ''}>
                          <label className="block font-medium mb-1 dark:text-white">{field.label}</label>
                          <Field name={field.name} type="text" placeholder={field.placeholder} disabled={field.disabled} className="form-input placeholder:text-white-dark" />
                          <ErrorMessage name={field.name} className="text-danger mt-1 block" component="div" />
                        </div>
                      )}

                      {/* ----- SELECT SINGLE ----- */}
                      {field.type === 'select' && (
                        <div className={field.className ?? ''}>
                          <label className="block font-medium mb-1 dark:text-white">{field.label}</label>
                          <SelectSingleField name={field.name} options={field.rsOptions ?? []} placeholder={field.placeholder} disabled={field.disabled} />
                          <ErrorMessage name={field.name} className="text-danger mt-1 block" component="div" />
                        </div>
                      )}

                      {/* ----- MULTI SELECT ----- */}
                      {field.type === 'multiselect' && (
                        <div className={field.className ?? ''}>
                          <label className="block font-medium mb-1 dark:text-white">{field.label}</label>
                          <SelectMultiField name={field.name} options={field.rsOptions ?? []} placeholder={field.placeholder} disabled={field.disabled} />
                          <ErrorMessage name={field.name} className="text-danger mt-1 block" component="div" />
                        </div>
                      )}

                      {field.type === 'date' && (
                        <div className={field.className ?? ''}>
                          <label className="block font-medium mb-1 dark:text-white">{field.label}</label>

                          <DateTimeField name={field.name} disabled={field.disabled} placeholder={field.placeholder!} flatpickrOptions={field.flatpickrOptions} />

                          <ErrorMessage name={field.name} className="text-danger mt-1 block" component="div" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* actions */}
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="btn btn-outline-danger" onClick={() => resetForm()}>
                    Réinitialiser
                  </button>
                  <button type="submit" className="btn bg-primary text-white border-0">
                    Appliquer
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </nav>
    </div>
  );
};

export default FilterFormDynamicV3;
