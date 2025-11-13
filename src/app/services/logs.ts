// Mock data and simple services for Phase5 (communications and emails)

export type CommunicationRecord = {
  id: string
  srcIP: string
  dstIP: string
  timestamp: string
}

export type EmailRecord = {
  id: string
  subject: string
  from: string
  to: string
  timestamp: string
  deleted?: boolean
}

// In-memory mock stores (reset per page load)
const communications: CommunicationRecord[] = [
  { id: 'c1', srcIP: '10.0.0.23', dstIP: '203.0.113.10', timestamp: '2025-11-12T00:10:00Z' },
  { id: 'c2', srcIP: '10.0.0.23', dstIP: '203.0.113.10', timestamp: '2025-11-12T00:11:00Z' },
  { id: 'c3', srcIP: '10.0.0.45', dstIP: '203.0.113.10', timestamp: '2025-11-12T00:12:00Z' },
  { id: 'c4', srcIP: '10.0.0.88', dstIP: '198.51.100.7', timestamp: '2025-11-12T00:13:00Z' }
]

const emails: EmailRecord[] = [
  { id: 'm1', subject: '請求書の件', from: 'attacker@example.com', to: 'suzuki@example.co.jp', timestamp: '2025-11-12T00:01:00Z' },
  { id: 'm2', subject: '請求書の件', from: 'attacker@example.com', to: 'yamada@example.co.jp', timestamp: '2025-11-12T00:02:00Z' },
  { id: 'm3', subject: '会議のご連絡', from: 'hr@example.com', to: 'suzuki@example.co.jp', timestamp: '2025-11-12T00:03:00Z' }
]

export function getCommunicationsByIP(ip: string): CommunicationRecord[] {
  const key = (ip || '').trim()
  if (!key) return []
  return communications.filter((r) => r.srcIP === key || r.dstIP === key)
}

export function getEmailsBySubject(subject: string): EmailRecord[] {
  const key = (subject || '').trim()
  if (!key) return []
  return emails.filter((m) => m.subject.includes(key))
}

export function bulkDeleteEmailsBySubject(subject: string): { deleted: number } {
  const list = getEmailsBySubject(subject)
  let count = 0
  for (const m of list) {
    if (!m.deleted) {
      m.deleted = true
      count++
    }
  }
  return { deleted: count }
}

// For demo, remediation is a no-op on communications, return true if any record exists
export function remediateHostByIP(ip: string): { remediated: boolean } {
  const has = getCommunicationsByIP(ip).length > 0
  return { remediated: has }
}

// Reset mutable fields in mock stores for test isolation / replay
export function resetMockStores() {
  for (const m of emails) {
    m.deleted = false
  }
}
