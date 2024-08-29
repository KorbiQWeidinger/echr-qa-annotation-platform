import { Progress } from "@/components/custom-progress";
import { useAnnotation } from "@/contexts/annotation";
import { AnnotationPagination } from "./annotation-pagination";

export function ProgressDemo() {
  const { progress } = useAnnotation();
  if (!progress) {
    return null;
  }

  return (
    <Progress
      value={(progress.completed.length / progress.total) * 100}
      className="w-[50%]"
      indicatorColor={"bg-green-500"}
    />
  );
}

export const Footer = () => {
  return (
    <footer className="sticky bottom-0 flex items-center justify-between h-16 min-h-16 border-t bg-background px-4 md:px-6">
      <div className="flex-grow"></div>
      <div className="flex justify-center flex-grow">
        <AnnotationPagination />
      </div>
      <div className="flex justify-end flex-grow">
        <ProgressDemo />
      </div>
    </footer>
  );
};
