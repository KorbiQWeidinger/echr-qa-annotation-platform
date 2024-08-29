import { Citation, Generation } from "@/models/annotation";
import { Card, CardContent } from "./ui/card";

function removeDotAtEnd(str: string) {
  return str.replace(/\.$/, "");
}

const removeCasePrefix = (
  text: string,
  caseName: string,
  paragraph: number
) => {
  return text.replace(new RegExp(`^${caseName}; § ${paragraph}: `), "");
};

export const GeneratedAnswerDisplay = ({
  generation,
}: {
  generation: Generation;
}) => {
  const minimalCitations = () => {
    const minimalCitations: Citation[] = [];
    generation.sentences_with_citations?.forEach((sentence) => {
      sentence.citations.forEach((citation) => {
        if (
          !minimalCitations.find(
            (c) =>
              c.case_id === citation.case_id &&
              c.paragraph_number === citation.paragraph_number
          )
        ) {
          minimalCitations.push(citation);
        }
      });
    });
    return minimalCitations;
  };

  const citations = minimalCitations();

  const toCitationsString = (citations: Citation[]) => {
    return citations
      .map((citation) => {
        return citation.case_name + " § " + citation.paragraph_number;
      })
      .join(", ");
  };

  return (
    <Card className="m-4 max-h-[70vh] min-h-[70vh] overflow-auto">
      <CardContent className="m-2 py-4">
        <p className="text-sm mt-4">
          <b className="text-lg">Generated Answer:</b>
          <br />
          {generation.sentences_with_citations?.map((sentence) => {
            if (sentence.citations.length > 0) {
              return (
                <>
                  {removeDotAtEnd(sentence.sentence)} {"("}
                  {toCitationsString(sentence.citations)}
                  {"). "}
                </>
              );
            }
            return <>{sentence.sentence} </>;
          })}
          {!generation.sentences_with_citations && <>{generation.answer}</>}
        </p>
        <p className="text-sm mt-4">
          <b className="text-lg">Citations:</b>
          <div className="h-1" />
          {citations.map((citation) => (
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
                <div>
                  <div className="h-2" />
                  <p>§ {citation.paragraph_number}</p>
                  <p>
                    {removeCasePrefix(
                      citation.paragraph_text,
                      citation.case_name,
                      citation.paragraph_number
                    )}
                  </p>
                </div>
              </span>
            </div>
          ))}
        </p>
      </CardContent>
    </Card>
  );
};
