const LETTERS = ["A", "B", "C", "D"];

export function getExperimentToLetter(experiments: string[]) {
  if (experiments.length !== 4) {
    throw new Error("Expected 4 experiments");
  }

  return {
    [experiments[0]]: LETTERS[0],
    [experiments[1]]: LETTERS[1],
    [experiments[2]]: LETTERS[2],
    [experiments[3]]: LETTERS[3],
  };
}

export function getLetterToExperiment(experiments: string[]) {
  if (experiments.length !== 4) {
    throw new Error("Expected 4 experiments");
  }

  return {
    [LETTERS[0]]: experiments[0],
    [LETTERS[1]]: experiments[1],
    [LETTERS[2]]: experiments[2],
    [LETTERS[3]]: experiments[3],
  };
}
