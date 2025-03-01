import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

type LogoProps = {
  logo?: string;
  classname?: string;
};

const Logo: React.FC<LogoProps> = ({ logo = "Quiz Creator", classname }) => {
  return (
    <div>
      <Badge className={cn("font-logo font-semibold italic", classname)}>
        {logo}
      </Badge>
    </div>
  );
};

export default Logo;
