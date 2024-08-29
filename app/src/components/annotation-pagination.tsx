import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAnnotation } from "@/contexts/annotation";

export function AnnotationPagination() {
  const { index, setIndex, progress } = useAnnotation();

  if (!progress || index == null || index == undefined) {
    return null;
  }

  const { total } = progress;

  // Function to calculate the range of indexes to display
  const calculateRange = () => {
    let start = index - 1;
    let end = index + 1;

    if (start < 1) {
      start = 0;
      end = Math.min(2, total - 1);
    } else if (end > total - 1) {
      end = total - 1;
      start = Math.max(0, end - 2);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const range = calculateRange();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="hover:cursor-pointer"
            isActive={index !== 0}
            onClick={() => index && setIndex(index - 1)}
          />
        </PaginationItem>

        {index > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {index <= 1 && <div className="w-9"></div>}

        {range.map((i) => {
          return (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={index === i}
                onClick={() => setIndex(i)}
                className={
                  progress.completed && progress.completed.includes(i)
                    ? `bg-green-500 ${
                        index === i ? "dark:border-white border-black" : ""
                      }`
                    : "" + "hover:cursor-pointer"
                }
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {index < total - 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {index >= total - 3 && <div className="w-9"></div>}

        <PaginationItem>
          <PaginationNext
            className="hover:cursor-pointer"
            isActive={index !== total - 1}
            onClick={() => index < total - 1 && setIndex(index + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
