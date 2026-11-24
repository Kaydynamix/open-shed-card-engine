import { coachScenario } from '../src/scenarios.mjs';

// Input is untrusted JSON text; accept only the exact public scenario contract.
export function acceptAnswer(text, scenarioId) {
  const scenario = coachScenario(scenarioId);
  if (!scenario || typeof text !== 'string') return false;

  try {
    const answer = JSON.parse(text);
    if (answer === null || typeof answer !== 'object' || Array.isArray(answer)) {
      return false;
    }

    const allowedFields = ['kind', 'ruleId', 'cardId', 'explanation'];
    const fields = Object.keys(answer);
    if (fields.length !== allowedFields.length ||
        !allowedFields.every(field => Object.hasOwn(answer, field))) {
      return false;
    }

    const permittedCard = scenario.id === 'suggest' ? 'practice-red-3' : null;
    return answer.kind === scenario.kind &&
      answer.ruleId === scenario.rule &&
      answer.cardId === permittedCard &&
      typeof answer.explanation === 'string' &&
      answer.explanation.length >= 10 &&
      answer.explanation.length <= 1200;
  } catch {
    return false;
  }
}
