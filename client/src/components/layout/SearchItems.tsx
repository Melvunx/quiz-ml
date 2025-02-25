import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type SearchItempsProps = {
  onSearchAction: (data: FormData) => void;
  inputId: string;
  disabled?: boolean;
  className?: string;
};

const SearchItems: FC<SearchItempsProps> = ({
  onSearchAction,
  inputId,
  disabled,
  className,
}) => {
  return (
    <form
      action={onSearchAction}
      className={cn("flex w-full items-center", className)}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Search size={18} />
          <Input
            size={14}
            type="search"
            placeholder="Rechercher..."
            name="search"
          />
        </div>
        <Button
          type="submit"
          id={inputId}
          size="sm"
          variant="outline"
          disabled={disabled}
        >
          Rechercher
        </Button>
      </div>
    </form>
  );
};

export default SearchItems;
