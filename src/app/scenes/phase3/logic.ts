export const CORRECT_ID = 'physical'

export function isCorrect(choiceId?: string | null) {
  return choiceId === CORRECT_ID
}
