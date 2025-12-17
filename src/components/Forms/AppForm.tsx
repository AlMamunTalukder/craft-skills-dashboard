 

import type { ReactNode } from "react";
import { FormProvider, useForm, type FieldValues, type SubmitHandler } from "react-hook-form";

type TFormConfig = {
  defaultValues?: Record<string, any>;
  resolver?: any;
};

type TFormProps = {
  onSubmit?: SubmitHandler<FieldValues | any>;
  children: ReactNode;
} & TFormConfig;

const AppForm = ({
  onSubmit,
  children,
  defaultValues,
  resolver,
}: TFormProps) => {
  const formConfig: TFormConfig = {};

  if (defaultValues) {
    formConfig["defaultValues"] = defaultValues;
  }

  if (resolver) {
    formConfig["resolver"] = resolver;
  }

  const methods = useForm(formConfig);

  const submit: SubmitHandler<FieldValues> =  (data) => {
    try {
      onSubmit && ( onSubmit(data));
      // methods.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods} setError={methods.setError}>
      <form onSubmit={methods.handleSubmit(submit)} className="space-y-4">
        {children}
      </form>
    </FormProvider>
  );
};

export default AppForm;
