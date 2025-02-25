import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FC } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";

type PaginationControlsProps = {
  totalItems: number;
  itemsPerPage: number;
  defaultPage?: number;
  className?: string;
};

const PaginationControls: FC<PaginationControlsProps> = ({
  totalItems,
  itemsPerPage,
  defaultPage = 1,
  className,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || defaultPage;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalItems) {
      searchParams.set("page", String(newPage));
      setSearchParams(searchParams);
    }
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        pages.push(pageNumber);
      }
    } else {
      if (currentPage <= 3) {
        for (let pageNumber = 1; pageNumber <= 4; pageNumber++) {
          pages.push(pageNumber);
        }

        pages.push(-1); // Ici représent les "..."
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);

        for (
          let pageNumber = totalPages - 3;
          pageNumber <= totalPages;
          pageNumber++
        ) {
          pages.push(pageNumber);
        }
      } else {
        pages.push(1);
        pages.push(-1);

        for (
          let pageNumber = currentPage - 1;
          pageNumber <= currentPage + 1;
          pageNumber++
        ) {
          pages.push(pageNumber);
        }
        pages.push(-1);
        pages.push(totalPages);
      }
    }

    console.log({ pages });

    return pages;
  };

  return (
    <div
      className={cn(
        "my-4 flex w-full items-center justify-around rounded-lg bg-zinc-300/25 p-2",
        className
      )}
    >
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <p className="flex items-center gap-1">
          <ArrowLeft /> Précédent
        </p>
      </Button>
      <div className="space-x-4">
        {getPageNumbers().map((pageNumber, idx) =>
          pageNumber === -1 ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-1">
              ...
            </span>
          ) : (
            <Button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`${
                currentPage === pageNumber ? "bg-indigo-500 text-white" : ""
              }`}
            >
              {pageNumber}
            </Button>
          )
        )}
      </div>
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <p className="flex items-center gap-1">
          Suivant <ArrowRight />
        </p>
      </Button>
    </div>
  );
};

export default PaginationControls;
