import { cn } from "@/lib/utils";
import { TooltipContent } from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { Button } from "./ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type ButtonVariants =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

type TooltipComponentProps = {
  children: React.ReactNode;
  content: string;
  variant?: ButtonVariants;
  btnClassName?: string;
  tooltipClassName?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const TooltipComponent: React.FC<TooltipComponentProps> = ({
  children,
  content,
  variant,
  btnClassName,
  tooltipClassName,
  disabled,
  onClick,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            onClick={onClick}
            disabled={disabled}
            className={cn("text-lg", btnClassName)}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p
            className={clsx(
              "mb-2 rounded-lg bg-indigo-200/50 px-2 py-1 opacity-75",
              tooltipClassName
            )}
          >
            {content}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
