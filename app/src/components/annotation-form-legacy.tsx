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
import { DropdownSelection } from "./dropdown-selection";
import {
  getExperimentToLetter,
  getLetterToExperiment,
} from "@/utils/hide-experiment-utils";
import { Checkbox } from "./ui/checkbox";

const undefinedArray = () => {
  return [undefined, undefined, undefined, undefined];
};

export function CheckboxWithLabel({
  label,
  checked,
  onCheckChanged,
}: {
  label: string;
  checked: boolean;
  onCheckChanged: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox checked={checked} onCheckedChange={onCheckChanged} />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}

export const AnnotationForm = () => {
  const { annotation, index } = useAnnotation();
  const [claimRecall, setClaimRecall] = useState<(string | undefined)[]>(
    undefinedArray()
  );
  const [citationFaithfulness, setCitationFaithfulness] = useState<
    (string | undefined)[]
  >(undefinedArray());
  const [evidenceSimilarity, setEvidenceSimilarity] = useState<
    (string | undefined)[]
  >(undefinedArray());
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [betterThanTarget, setBetterThanTarget] = useState<string[]>([]);

  useEffect(() => {
    if (!annotation?.annotation) {
      setClaimRecall(undefinedArray());
      setCitationFaithfulness(undefinedArray());
      setEvidenceSimilarity(undefinedArray());
      setBetterThanTarget([]);
      setNote("");
      setSubmitted(false);
      setError("");
      return;
    }

    const experiments = annotation.generations.map((generation) => {
      return generation.experiment;
    });

    const experimentToLetter = getExperimentToLetter(experiments);

    setClaimRecall(
      annotation.annotation.claim_order.map((c) => experimentToLetter[c])
    );
    setCitationFaithfulness(
      annotation.annotation.citation_faithfulness_order.map(
        (c) => experimentToLetter[c]
      )
    );
    setEvidenceSimilarity(
      annotation.annotation.citation_similarity_order.map(
        (c) => experimentToLetter[c]
      )
    );
    setNote(annotation.annotation.note || "");
    setBetterThanTarget(annotation.annotation.better_than_target);
    setSubmitted(true);
    setError("");
  }, [annotation]);

  if (!annotation) {
    return null;
  }

  const experiments = annotation.generations.map((generation) => {
    return generation.experiment;
  });

  const experimentToLetter = getExperimentToLetter(experiments);
  const letterToExperiment = getLetterToExperiment(experiments);

  const selectionOptions = annotation.generations.map((generation) => {
    return experimentToLetter[generation.experiment];
  });

  const submitWithValidate = async () => {
    if (
      claimRecall.includes(undefined) ||
      citationFaithfulness.includes(undefined) ||
      evidenceSimilarity.includes(undefined)
    ) {
      setError("Invalid");
      return;
    }

    if (
      claimRecall.includes("undefined") ||
      citationFaithfulness.includes("undefined") ||
      evidenceSimilarity.includes("undefined")
    ) {
      setError("Invalid");
      return;
    }

    const data: Annotation = {
      claim_order: claimRecall.map((c) => letterToExperiment[c as string]),
      citation_faithfulness_order: citationFaithfulness.map(
        (c) => letterToExperiment[c as string]
      ),
      citation_similarity_order: evidenceSimilarity.map(
        (c) => letterToExperiment[c as string]
      ),
      better_than_target: betterThanTarget,
      note: note,
    };

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
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        setError("Invalid");
        return;
      }
    } catch (e) {
      setError("Invalid");
      return;
    }

    setError("");
    setSubmitted(true);
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
        <DropdownSelection
          label="Correctness"
          description="Rank the experiments based on the accuracy, completeness, and relevance of their answers to the given question."
          options={selectionOptions}
          selectedOptions={claimRecall}
          setOptions={setClaimRecall}
        />
        <DropdownSelection
          label="Groundedness"
          description="Rank the experiments by how constitutively their answers are supported by citations."
          options={selectionOptions}
          selectedOptions={citationFaithfulness}
          setOptions={setCitationFaithfulness}
        />
        <DropdownSelection
          label="Citation Relevance"
          description="Rank the experiments by how relevant and directly supportive the used citations are in answering the question."
          options={selectionOptions}
          selectedOptions={evidenceSimilarity}
          setOptions={setEvidenceSimilarity}
        />
        <div className="h-4" />
        <h4 className="text-xl font-bold pl-4 pt-4">Better than Target</h4>
        <p className="text-sm pl-4 pb-2">
          Check any generated answers that are better than the target answer
        </p>
        <div className="pl-6 pt-4 flex space-x-5">
          {Array.from(["A", "B", "C", "D"]).map((letter) => {
            return (
              <CheckboxWithLabel
                label={letter}
                checked={betterThanTarget.includes(letterToExperiment[letter])}
                onCheckChanged={(checked) => {
                  if (checked) {
                    setBetterThanTarget([
                      ...betterThanTarget,
                      letterToExperiment[letter],
                    ]);
                  }
                  if (!checked) {
                    setBetterThanTarget(
                      betterThanTarget.filter(
                        (b) => b !== letterToExperiment[letter]
                      )
                    );
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your notes here..."
          />
        </div>
        <div className="ml-6 mt-8 flex flex-row">
          <Button onClick={submitWithValidate}>Submit</Button>
          {submitted && (
            <div className="text-sm mt-2 ml-4 text-green-600">Completed</div>
          )}
          {error && (
            <div className="text-sm mt-2 ml-4 text-red-600">
              Invalid Submission
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
