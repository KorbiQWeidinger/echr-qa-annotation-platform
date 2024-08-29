/* eslint-disable react-refresh/only-export-components */
import { fetchAnnotation, fetchAnnotationProgress } from "@/api/api";
import { AnnotationProgress, EvaluationBatch } from "@/models/annotation";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { NumberParam, useQueryParam } from "use-query-params";
import { useLogin } from "./login";

interface AnnotationContextType {
  annotation: EvaluationBatch | null;
  progress: AnnotationProgress | null;
  index: number | null | undefined;
  setIndex: (index: number) => void;
}

const AnnotationContext = createContext<AnnotationContextType | undefined>(
  undefined
);

export const AnnotationProvider = ({ children }: PropsWithChildren) => {
  const [annotation, setAnnotation] = useState<EvaluationBatch | null>(null);
  const [index, setIndex] = useQueryParam("page", NumberParam);
  const [progress, setProgress] = useState<AnnotationProgress | null>(null);

  const { logout } = useLogin();

  useEffect(() => {
    if (!index) {
      setIndex(0);
    }

    fetchAnnotationProgress()
      .then((progress) => {
        setProgress(progress);
      })
      .catch(() => {
        logout();
      });

    if (index !== null && index !== undefined) {
      fetchAnnotation(index)
        .then((annotation) => {
          setAnnotation(annotation);
        })
        .catch(() => {
          logout();
        });
    }
  }, [index, setIndex, logout]);

  return (
    <AnnotationContext.Provider
      value={{
        annotation,
        progress,
        index: index,
        setIndex,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
};

export const useAnnotation = () => {
  const context = useContext(AnnotationContext);
  if (context === undefined) {
    throw new Error("useAnnotation must be used within an AnnotationProvider");
  }
  return context;
};
