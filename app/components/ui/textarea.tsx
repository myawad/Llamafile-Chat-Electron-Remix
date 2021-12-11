import * as React from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  disableOnFormSubmission?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, disabled: _disabled, disableOnFormSubmission, ...props },
    ref
  ) => {
 