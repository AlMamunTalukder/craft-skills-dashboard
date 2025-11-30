"use client";

import { type ReactNode } from "react";
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  useForm,
  type UseFormReturn,
} from "react-hook-form";

type TFormConfig = {
  defaultValues?: Record<string, any>;
  resolver?: any;
};

type TFormProps = {
  onSubmit?: SubmitHandler<FieldValues | any>;
  children: ReactNode | ((methods: UseFormReturn<FieldValues>) => ReactNode);
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

  const submit: SubmitHandler<FieldValues> = async (data) => {
    try {
      onSubmit && (await onSubmit(data));
      // methods.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods} setError={methods.setError}>
      <form onSubmit={methods.handleSubmit(submit)} className="space-y-4">
        {typeof children === "function" ? children(methods) : children}
      </form>
    </FormProvider>
  );
};

export default AppForm;
