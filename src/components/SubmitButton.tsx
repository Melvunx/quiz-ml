import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type SubmitButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

export function SubmitButton({ children, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={clsx("tracking-wide", className)}
      type="submit"
      disabled={pending}
    >
      {children}
    </Button>
  );
}
