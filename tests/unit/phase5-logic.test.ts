import { describe, it, expect, beforeEach } from 'vitest'
import { deleteEmails, getPhase5Flags, isPhase5Complete, remediateMalware, resetPhase5State, searchCommunications, searchEmails } from '../../src/app/scenes/phase5/logic'

describe('Phase5 logic', () => {
  beforeEach(() => {
    resetPhase5State()
  })

  it('検索ヒットで進捗が進む', () => {
    const comm = searchCommunications('203.0.113.10')
    expect(comm.length).toBeGreaterThan(0)

    const mails = searchEmails('請求書')
    expect(mails.length).toBeGreaterThan(0)

    const flags = getPhase5Flags()
    expect(flags.communicationSearched).toBe(true)
    expect(flags.emailSearched).toBe(true)
    expect(isPhase5Complete()).toBe(false)
  })

  it('対処2つが終わると完了', () => {
    searchCommunications('203.0.113.10')
    searchEmails('請求書')

    const del = deleteEmails('請求書')
    expect(del.deleted).toBeGreaterThan(0)

    const rem = remediateMalware('203.0.113.10')
    expect(rem.remediated).toBe(true)

    expect(isPhase5Complete()).toBe(true)
  })

  it('未ヒット検索は進捗に影響しない', () => {
    const comm = searchCommunications('192.0.2.255')
    const mails = searchEmails('存在しない件名')
    expect(comm.length).toBe(0)
    expect(mails.length).toBe(0)
    const flags = getPhase5Flags()
    expect(flags.communicationSearched).toBe(false)
    expect(flags.emailSearched).toBe(false)
  })

  it('重複対処しても2回目は効果ゼロ', () => {
    searchEmails('請求書')
    const first = deleteEmails('請求書')
    const second = deleteEmails('請求書')
    expect(first.deleted).toBeGreaterThan(0)
    expect(second.deleted).toBe(0)
  })
})
