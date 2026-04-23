import { useEffect, useRef, useState } from 'react';

// FormDynamicPopup.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import IconForm from './iconForm';

type FormDynamicPopupProps = {
  fields?: any;
  initialValues?: any;
  onSubmit: (value: any) => void;
  onChange: (value: any) => void;
};
const FormDynamicPopup = (props: FormDynamicPopupProps) => {
  const onSubmitFormDynamic = (data: any) => {
    props.onSubmit(data);
  };
  const [initValues, setInitValues] = useState<any>();
  const onChange = (onCha: any) => {
    let data = {
      id: onCha.target.id,
      name: onCha.target.name,
      type: onCha.target.type,
      checked: onCha.target.checked,
      value: onCha.target.value,
    };
    props.onChange(data);
  };
  useEffect(() => {
    let obj: any = {};
    props.fields.forEach((f: any) => {
      obj[f.name] = false;
    });
    let json = JSON.stringify(obj);
    setInitValues(JSON.parse(json));
  }, [props.fields]);

  return (
    initValues && (
      <Formik initialValues={initValues} validationSchema={Yup.object().shape({})} onSubmit={onSubmitFormDynamic} on>
        {props.fields && (
          <Form className="space-y-5" onChange={onChange}>
            {props.fields.map((field: any) => (
              <div key={field.key}>
                {field.type === 'radio' ? (
                  // Render radio buttons
                  <div>
                    {
                      <div key={field.key} className="flex items-center ">
                        <Field type="radio" id={field.key} name={field.name} value={field.id.toString()} className="form-radio" />
                        <label htmlFor={field.key} className="text-white-dark m-0 cursor-pointer">
                          {field.label}
                        </label>
                      </div>
                    }
                  </div>
                ) : (
                  <div className="flex">
                    <Field id={field.key} name={field.name} type={field.type} className="form-checkbox" />
                    <label htmlFor={field.key} className="text-white-dark font-semibold cursor-pointer">
                      {field.label}
                    </label>
                  </div>
                )}

                <ErrorMessage name={field.name} className="text-danger mt-1" component="div" />
              </div>
            ))}
            <button type="submit" className="btn btn-danger mx-auto">
              Suivant
            </button>
          </Form>
        )}
      </Formik>
    )
  );
};

export default FormDynamicPopup;
