// Mock data and services for Phase5 (communications and emails)

export type CommunicationRecord = {
  id: string
  srcIP: string
  dstIP: string
  timestamp: string
  hostname: string
  isMalicious: boolean
  details?: string
}

export type EmailRecord = {
  id: string
  subject: string
  from: string
  to: string
  timestamp: string
  isMalicious: boolean
  deleted?: boolean
  attachments?: string[]
}

// In-memory mock stores
const communications: CommunicationRecord[] = [
  { id: 'c1', srcIP: '10.0.0.23', dstIP: '203.0.113.10', hostname: 'PC-SUZUKI', timestamp: '2025-11-12T10:15:23Z', isMalicious: true, details: 'C&Cサーバーへの定期的なビーコン通信を検出。' },
  { id: 'c2', srcIP: '10.0.0.23', dstIP: '203.0.113.10', hostname: 'PC-SUZUKI', timestamp: '2025-11-12T10:20:45Z', isMalicious: true, details: 'C&Cサーバーへの定期的なビーコン通信を検出。' },
  { id: 'c3', srcIP: '10.0.0.45', dstIP: '203.0.113.10', hostname: 'PC-TANAKA', timestamp: '2025-11-12T10:22:11Z', isMalicious: true, details: 'C&Cサーバーへの接続試行。横展開された可能性。' },
  { id: 'c4', srcIP: '10.0.0.88', dstIP: '203.0.113.10', hostname: 'SERVER-WEB', timestamp: '2025-11-12T09:30:00Z', isMalicious: false, details: '正規のWebサーバーからの外部API呼び出し。業務上必要な通信。' },
  { id: 'c5', srcIP: '10.0.0.23', dstIP: '8.8.8.8', hostname: 'PC-SUZUKI', timestamp: '2025-11-12T09:00:00Z', isMalicious: false, details: 'DNSクエリ。正常な名前解決。' },
  { id: 'c6', srcIP: '10.0.0.23', dstIP: '198.51.100.50', hostname: 'PC-SUZUKI', timestamp: '2025-11-12T09:05:00Z', isMalicious: false, details: '社内メールサーバーとの通常の通信。' },
  { id: 'c7', srcIP: '10.0.0.45', dstIP: '198.51.100.50', hostname: 'PC-TANAKA', timestamp: '2025-11-12T09:10:00Z', isMalicious: false, details: '社内メールサーバーとの通常の通信。' }
]

const emails: EmailRecord[] = [
  { id: 'm1', subject: '【重要】請求書の件', from: 'invoice@evil-domain.net', to: 'suzuki@example.co.jp', timestamp: '2025-11-12T08:45:00Z', isMalicious: true, attachments: ['請求書.zip'] },
  { id: 'm2', subject: '【重要】請求書の件', from: 'invoice@evil-domain.net', to: 'tanaka@example.co.jp', timestamp: '2025-11-12T08:46:00Z', isMalicious: true, attachments: ['請求書.zip'] },
  { id: 'm3', subject: 'Re: 【重要】請求書の件', from: 'suzuki@example.co.jp', to: 'invoice@evil-domain.net', timestamp: '2025-11-12T09:00:00Z', isMalicious: true, attachments: [] },
  { id: 'm4', subject: '【経理】請求書の確認依頼', from: 'accounting@example.co.jp', to: 'suzuki@example.co.jp', timestamp: '2025-11-12T08:30:00Z', isMalicious: false, attachments: ['正規請求書.pdf'] },
  { id: 'm5', subject: '会議室予約の件', from: 'hr@example.co.jp', to: 'suzuki@example.co.jp', timestamp: '2025-11-12T09:15:00Z', isMalicious: false, attachments: [] },
  { id: 'm6', subject: '週報提出のお願い', from: 'manager@example.co.jp', to: 'tanaka@example.co.jp', timestamp: '2025-11-12T09:30:00Z', isMalicious: false, attachments: [] }
]

export function getCommunicationsByIP(ip: string): CommunicationRecord[] {
  const key = (ip || '').trim()
  if (!key) return []
  return communications.filter((r) => r.srcIP.includes(key) || r.dstIP.includes(key))
}

export function getCommunicationsByHostname(hostname: string): CommunicationRecord[] {
  const key = (hostname || '').trim().toUpperCase()
  if (!key) return []
  return communications.filter((r) => r.hostname.toUpperCase().includes(key))
}

export function getEmailsBySubject(subject: string): EmailRecord[] {
  const key = (subject || '').trim()
  if (!key) return []
  return emails.filter((m) => !m.deleted && m.subject.includes(key))
}

export function getEmailsByFrom(from: string): EmailRecord[] {
  const key = (from || '').trim()
  if (!key) return []
  return emails.filter((m) => !m.deleted && m.from.includes(key))
}

export function deleteEmailById(id: string): { success: boolean; error?: string } {
  const email = emails.find((m) => m.id === id)
  if (!email) return { success: false, error: 'メールが見つかりません' }
  if (email.deleted) return { success: false, error: '既に削除済みです' }
  if (!email.isMalicious) {
    return { success: false, error: '⚠️ 警告: このメールは正常なメールです！' }
  }
  email.deleted = true
  return { success: true }
}

export function deleteEmailsByIds(ids: string[]): { success: number; failed: number; errors: string[] } {
  let success = 0, failed = 0
  const errors: string[] = []
  for (const id of ids) {
    const result = deleteEmailById(id)
    if (result.success) success++
    else { failed++; if (result.error) errors.push(result.error) }
  }
  return { success, failed, errors }
}

export function remediateHostByName(hostname: string): { success: boolean; error?: string } {
  const records = getCommunicationsByHostname(hostname)
  if (records.length === 0) return { success: false, error: 'ホストが見つかりません' }
  const hasMalicious = records.some((r) => r.isMalicious)
  if (!hasMalicious) return { success: false, error: '⚠️ 警告: このホストには不正な活動は検出されていません！' }
  return { success: true }
}

export function remediateHostsByNames(hostnames: string[]): { success: number; failed: number; errors: string[] } {
  let success = 0, failed = 0
  const errors: string[] = []
  for (const hostname of hostnames) {
    const result = remediateHostByName(hostname)
    if (result.success) success++
    else { failed++; if (result.error) errors.push(result.error) }
  }
  return { success, failed, errors }
}

export function resetMockStores() {
  for (const m of emails) m.deleted = false
}
