import { useAnnotation } from "@/contexts/annotation";
import { Annotation } from "@/models/annotation";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { CheckboxWithLabel } from "./checkbox-with-label";
import { RankSelection } from "./rank-selection";

function validateRankings(annotation: Annotation): boolean {
  const orderArrays = [
    annotation.claim_order,
    annotation.citation_faithfulness_order,
    annotation.citation_similarity_order,
  ];

  for (const array of orderArrays) {
    if (array.length !== 4) {
      return false;
    }

    const numbers = array.map(Number);

    // Check if all elements are numbers between 1 and 4
    if (!numbers.every((n) => n >= 1 && n <= 4 && Number.isInteger(n))) {
      return false;
    }

    // Check if no number is skipped
    const uniqueNumbers = new Set(numbers);
    const maxNumber = Math.max(...numbers);
    if (uniqueNumbers.size !== maxNumber) {
      return false;
    }
  }

  return true;
}

export const AnnotationForm = () => {
  const { annotation, index } = useAnnotation();
  const [editableAnnotation, setEditableAnnotation] = useState<Annotation>(
    annotation?.annotation
      ? annotation.annotation
      : {
          claim_order: ["", "", "", ""],
          citation_faithfulness_order: ["", "", "", ""],
          citation_similarity_order: ["", "", "", ""],
          better_than_target: [],
          note: "",
        }
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!annotation) {
      return;
    }

    setError("");
    setSuccess(false);

    if (!annotation.annotation) {
      setEditableAnnotation({
        claim_order: ["", "", "", ""],
        citation_faithfulness_order: ["", "", "", ""],
        citation_similarity_order: ["", "", "", ""],
        better_than_target: [],
        note: "",
      });
      return;
    }

    setEditableAnnotation(annotation.annotation);
  }, [annotation, index]);

  if (!annotation) {
    return null;
  }

  const submitAnnotation = async () => {
    if (
      editableAnnotation.claim_order.includes("") ||
      editableAnnotation.citation_faithfulness_order.includes("") ||
      editableAnnotation.citation_similarity_order.includes("")
    ) {
      setError("Selections can not be empty");
      setSuccess(false);
      return;
    }

    if (!validateRankings(editableAnnotation)) {
      setError("Rankings must not skip numbers");
      setSuccess(false);
      return;
    }

    try {
      // we need token from local storage and make an authenticated request
      const token = localStorage.getItem("token");
      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });

      const response = await fetch(`/api/annotations/${index}/add`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(editableAnnotation),
      });
      if (!response.ok) {
        setError("Oops! Something went wrong");
        setSuccess(false);
        return;
      }
    } catch (e) {
      setError("Oops! Something went wrong");
      setSuccess(false);
      return;
    }

    setError("");
    setSuccess(true);
  };

  const setClaimOrder: React.Dispatch<React.SetStateAction<string[]>> = (
    newOrder
  ) => {
    setEditableAnnotation((prev) => ({
      ...prev,
      claim_order:
        typeof newOrder === "function" ? newOrder(prev.claim_order) : newOrder,
    }));
  };

  const setCitationFaithfulness: React.Dispatch<
    React.SetStateAction<string[]>
  > = (newOrder) => {
    setEditableAnnotation((prev) => ({
      ...prev,
      citation_faithfulness_order:
        typeof newOrder === "function"
          ? newOrder(prev.citation_faithfulness_order)
          : newOrder,
    }));
  };

  const setEvidenceSimilarity: React.Dispatch<
    React.SetStateAction<string[]>
  > = (newOrder) => {
    setEditableAnnotation((prev) => ({
      ...prev,
      citation_similarity_order:
        typeof newOrder === "function"
          ? newOrder(prev.citation_similarity_order)
          : newOrder,
    }));
  };

  return (
    <div
      className="border-l flex flex-col"
      style={{
        minHeight: "calc(100vh - 8rem)",
        maxHeight: "calc(100vh - 8rem)",
      }}
      key={index}
    >
      <h3 className="text-2xl font-bold text-center p-4 border-b">
        Annotation Form
      </h3>
      <div className="flex-grow overflow-auto pl-4 pb-10 pr-4">
        <RankSelection
          label="Correctness"
          description="Rank the experiments based on the accuracy, completeness, and relevance of their answers to the given question."
          selected={editableAnnotation.claim_order}
          setSelected={setClaimOrder}
        />
        <RankSelection
          label="Groundedness"
          description="Rank the experiments by how constitutively their answers are supported by citations."
          selected={editableAnnotation.citation_faithfulness_order}
          setSelected={setCitationFaithfulness}
        />
        <RankSelection
          label="Source Relevance"
          description="Rank the experiments by how relevant and directly supportive the cited sources are in answering the question."
          selected={editableAnnotation.citation_similarity_order}
          setSelected={setEvidenceSimilarity}
        />
        <div className="h-4" />
        <h4 className="text-xl font-bold pl-4 pt-4">Better than Target</h4>
        <p className="text-sm pl-4 pb-2">
          Check any generated answers that are better than the target answer
        </p>
        <div className="pl-6 pt-4 flex space-x-5">
          {Array.from(["A", "B", "C", "D"]).map((letter, i) => {
            return (
              <CheckboxWithLabel
                label={letter}
                checked={editableAnnotation.better_than_target.includes(
                  `${i + 1}`
                )}
                onCheckChanged={(checked) => {
                  if (checked) {
                    setEditableAnnotation((prev) => ({
                      ...prev,
                      better_than_target: [
                        ...prev.better_than_target,
                        `${i + 1}`,
                      ],
                    }));
                  }
                  if (!checked) {
                    setEditableAnnotation((prev) => ({
                      ...prev,
                      better_than_target: prev.better_than_target.filter(
                        (x) => x !== `${i + 1}`
                      ),
                    }));
                  }
                }}
              />
            );
          })}
        </div>
        <div className="h-8" />
        <h4 className="text-xl font-bold p-4">
          Note{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={17} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Write notes or comments about the generated answers.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h4>
        <div className="h-2" />
        <div className="mx-6 max-w-[35vw]">
          <Textarea
            value={editableAnnotation.note ? editableAnnotation.note : ""}
            onChange={(e) =>
              setEditableAnnotation((prev) => ({
                ...prev,
                note: e.target.value,
              }))
            }
            placeholder="Write your notes here..."
          />
        </div>
        <div className="ml-6 mt-8 flex flex-row">
          <Button onClick={submitAnnotation}>Submit</Button>
          {success && (
            <div className="text-sm mt-2 ml-4 text-green-600">Completed</div>
          )}
          {error && (
            <div className="text-sm mt-2 ml-4 text-red-600">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};
