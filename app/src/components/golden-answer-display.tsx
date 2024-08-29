import { EvaluationBatch } from "@/models/annotation";
import { Card, CardContent } from "./ui/card";

const removeNumberStart = (text: string) => {
  const rep = text.replace(/^\s*\.\s*/, "");
  return rep.replace(/^\d+\.\s*/, "");
};

export const GoldenAnswerDisplay = ({
  evaluation,
}: {
  evaluation: EvaluationBatch;
}) => {
  return (
    <Card className="m-4 max-h-[70vh] min-h-[70vh] overflow-auto">
      <CardContent className="m-2 py-4">
        <p className="text-sm mt-4">
          <b className="text-lg">Question:</b>
          <br />
          {evaluation.question}
        </p>
        <p className="text-sm mt-4">
          <b className="text-lg">Target Answer:</b>
          <br />
          {evaluation.answer}
        </p>
        <p className="text-sm mt-4">
          <b className="text-lg">Citations:</b>
          <div className="h-1" />
          {evaluation.citations.map((citation) => (
            <div>
              <p className="mt-4">
                <a
                  href={"https://hudoc.echr.coe.int/eng?i=" + citation.case_id}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                >
                  {citation.case_name.toUpperCase()}
                </a>
              </p>
              <span>
                {citation.paragraph_numbers.map((n) => {
                  return (
                    <div>
                      <div className="h-2" />
                      <p>§ {n}</p>
                      <p>{removeNumberStart(citation.paragraphs_map[n])}</p>
                    </div>
                  );
                })}
              </span>
            </div>
          ))}
        </p>
      </CardContent>
    </Card>
  );
};
