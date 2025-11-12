import { describe, it, expect } from 'vitest'
import { isCorrect } from '../../src/app/scenes/phase3/logic'

describe('Phase3 logic', () => {
  it('returns true for physical', () => {
    expect(isCorrect('physical')).toBe(true)
  })

  it('returns false for other choices', () => {
    expect(isCorrect('remote')).toBe(false)
    expect(isCorrect('phone')).toBe(false)
    expect(isCorrect(null)).toBe(false)
  })
})
