export interface Citation {
  case_id: string;
  case_name: string;
  paragraph_number: number;
  paragraph_text: string;
}

export interface SentenceWithCitations {
  sentence: string;
  citations: Citation[];
}

export interface Generation {
  experiment: string;
  answer: string;
  sentences_with_citations?: SentenceWithCitations[];
}

export interface Annotation {
  claim_order: string[];
  citation_faithfulness_order: string[];
  citation_similarity_order: string[];
  better_than_target: string[];
  note: string | null;
}

export interface TargetCitation {
  case_name: string;
  case_id: string;
  paragraph_numbers: number[];
  paragraphs_map: { [key: string]: string };
}

export interface EvaluationBatch {
  axis: "model" | "approach";
  question_number: number;
  question: string;
  answer: string;
  citations: TargetCitation[];
  generations: Generation[];
  annotation?: Annotation; // Optional field
}

export interface AnnotationProgress {
  total: number;
  completed: number[];
}
