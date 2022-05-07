import * as React from "react";
import { useFormState } from "react-dom";
import { type SerializeFrom } from "@remix-run/server-runtime";
import {
  useActionData,
  useFormAction,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

let _hydrated = false;
export function useRouteFormAction<T>(
  preOptimism?: (formData: FormData) => void,
  postOptimism?: (result: SerializeFrom<T>) => void
): [
  Pick<React.FormHTMLAttributes<HTMLFormElement>, "encType" | "method"> & {
    action: string | ((formData: FormData) => void);
  },
  SerializeFrom<T> | undefined
] {
  const formAction = useFormAction();
  const actionData = useActionData<T>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [hydr