import clsx from "clsx";

type ErrorInputMessageProps = {
  error: string;
  className?: string;
};

const ErrorInputMessage: React.FC<ErrorInputMessageProps> = ({
  error,
  className,
}) => {
  return (
    <div className="flex items-center justify-start">
      <p className={clsx("text-red-500", className)}>{error}</p>
    </div>
  );
};

export default ErrorInputMessage;
