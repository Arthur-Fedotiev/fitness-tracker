import { INSTRUCTIONS_DELIMITER } from 'shared-package';

export const instructionsTransformer = (instructions: string) =>
  instructions
      .split(INSTRUCTIONS_DELIMITER)
      .map((instruction: string) => instruction.trim());
