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
  className?: string;
  onClick?: () => void;
};

const TooltipComponent: React.FC<TooltipComponentProps> = ({
  children,
  content,
  variant,
  className,
  onClick,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            onClick={onClick}
            className={clsx("text-lg", className)}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
