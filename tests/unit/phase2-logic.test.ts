import { describe, it, expect } from 'vitest'
import { getAlertData, isHighSeverity, SAMPLE_ALERT } from '../../src/app/scenes/phase2/logic'

describe('Phase2 logic', () => {
  describe('getAlertData', () => {
    it('returns sample alert data', () => {
      const alert = getAlertData()
      expect(alert).toBeDefined()
      expect(alert.id).toBe('alert-001')
      expect(alert.sourcePC).toContain('鈴木さんの PC')
      expect(alert.destinationIP).toContain('203.0.113.42')
    })

    it('returns high severity alert', () => {
      const alert = getAlertData()
      expect(alert.severity).toBe('high')
    })
  })

  describe('isHighSeverity', () => {
    it('returns true for high severity alerts', () => {
      expect(isHighSeverity(SAMPLE_ALERT)).toBe(true)
    })

    it('returns false for medium severity alerts', () => {
      const mediumAlert = { ...SAMPLE_ALERT, severity: 'medium' as const }
      expect(isHighSeverity(mediumAlert)).toBe(false)
    })

    it('returns false for low severity alerts', () => {
      const lowAlert = { ...SAMPLE_ALERT, severity: 'low' as const }
      expect(isHighSeverity(lowAlert)).toBe(false)
    })
  })

  describe('SAMPLE_ALERT', () => {
    it('contains expected fields', () => {
      expect(SAMPLE_ALERT).toHaveProperty('id')
      expect(SAMPLE_ALERT).toHaveProperty('timestamp')
      expect(SAMPLE_ALERT).toHaveProperty('severity')
      expect(SAMPLE_ALERT).toHaveProperty('sourcePC')
      expect(SAMPLE_ALERT).toHaveProperty('destinationIP')
      expect(SAMPLE_ALERT).toHaveProperty('message')
    })

    it('has valid timestamp format', () => {
      expect(SAMPLE_ALERT.timestamp).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    })

    it('message mentions C&C communication', () => {
      expect(SAMPLE_ALERT.message).toContain('C&C')
    })
  })
})
