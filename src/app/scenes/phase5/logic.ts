import { 
  getCommunicationsByHostname, 
  getCommunicationsByIP, 
  getEmailsByFrom, 
  getEmailsBySubject, 
  deleteEmailsByIds,
  remediateHostsByNames,
  resetMockStores,
  type CommunicationRecord,
  type EmailRecord
} from '../../services/logs'

export type Phase5ActionFlags = {
  maliciousHostsIdentified: string[]
  maliciousEmailsDeleted: number
  hostsRemediated: string[]
}

const state: Phase5ActionFlags = {
  maliciousHostsIdentified: [],
  maliciousEmailsDeleted: 0,
  hostsRemediated: []
}

export function resetPhase5State() {
  state.maliciousHostsIdentified = []
  state.maliciousEmailsDeleted = 0
  state.hostsRemediated = []
  resetMockStores()
}

export function searchCommunicationsByIP(ip: string): CommunicationRecord[] {
  return getCommunicationsByIP(ip)
}

export function searchCommunicationsByHostname(hostname: string): CommunicationRecord[] {
  return getCommunicationsByHostname(hostname)
}

export function searchEmailsBySubject(subject: string): EmailRecord[] {
  return getEmailsBySubject(subject)
}

export function searchEmailsByFrom(from: string): EmailRecord[] {
  return getEmailsByFrom(from)
}

export function identifyMaliciousHost(hostname: string) {
  if (!state.maliciousHostsIdentified.includes(hostname)) {
    state.maliciousHostsIdentified.push(hostname)
  }
}

export function deleteSelectedEmails(emailIds: string[]): { success: number; failed: number; errors: string[] } {
  const result = deleteEmailsByIds(emailIds)
  state.maliciousEmailsDeleted += result.success
  return result
}

export function remediateSelectedHosts(hostnames: string[]): { success: number; failed: number; errors: string[] } {
  const result = remediateHostsByNames(hostnames)
  for (const hostname of hostnames) {
    if (!state.hostsRemediated.includes(hostname)) {
      state.hostsRemediated.push(hostname)
    }
  }
  return result
}

export function isPhase5Complete(): boolean {
  return (
    state.maliciousHostsIdentified.length >= 2 &&
    state.maliciousEmailsDeleted >= 2 &&
    state.hostsRemediated.length >= 2
  )
}

export function getPhase5Flags(): Phase5ActionFlags {
  return { ...state }
}
