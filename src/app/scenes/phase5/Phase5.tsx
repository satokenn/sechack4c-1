import React, { useState } from 'react'
import type { CommunicationRecord, EmailRecord } from '../../services/logs'
import {
  deleteSelectedEmails,
  getPhase5Flags,
  identifyMaliciousHost,
  isPhase5Complete,
  remediateSelectedHosts,
  resetPhase5State,
  searchCommunicationsByHostname,
  searchCommunicationsByIP,
  searchEmailsByFrom,
  searchEmailsBySubject
} from './logic'

export default function Phase5({ onNext }: { onNext?: () => void }) {
  const [commQuery, setCommQuery] = useState('')
  const [commSearchType, setCommSearchType] = useState<'ip' | 'hostname'>('ip')
  const [emailQuery, setEmailQuery] = useState('')
  const [emailSearchType, setEmailSearchType] = useState<'subject' | 'from'>('subject')
  const [commResults, setCommResults] = useState<CommunicationRecord[]>([])
  const [emailResults, setEmailResults] = useState<EmailRecord[]>([])
  const [selectedComms, setSelectedComms] = useState<Set<string>>(new Set())
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [expandedComm, setExpandedComm] = useState<string | null>(null)
  const flags = getPhase5Flags()
  const isComplete = isPhase5Complete()

  function handleSearchComm() {
    const results = commSearchType === 'ip' ? searchCommunicationsByIP(commQuery) : searchCommunicationsByHostname(commQuery)
    setCommResults(results)
    setSelectedComms(new Set())
  }
  function handleSearchEmail() {
    const results = emailSearchType === 'subject' ? searchEmailsBySubject(emailQuery) : searchEmailsByFrom(emailQuery)
    setEmailResults(results)
    setSelectedEmails(new Set())
  }
  function handleIdentifyHosts() {
    const hostnames = Array.from(selectedComms).map(id => commResults.find(c => c.id === id)?.hostname).filter((h): h is string => !!h)
    if (hostnames.length === 0) { alert('ホストを選択してください'); return }
    const uniqueHostnames = Array.from(new Set(hostnames))
    uniqueHostnames.forEach(h => identifyMaliciousHost(h))
    alert(`${uniqueHostnames.length}件のホストを不正として特定しました:\n${uniqueHostnames.join(', ')}`)
    setSelectedComms(new Set())
  }
  function handleDeleteEmails() {
    if (selectedEmails.size === 0) { alert('削除するメールを選択してください'); return }
    const result = deleteSelectedEmails(Array.from(selectedEmails))
    if (result.failed > 0) alert(`⚠️ エラー:\n${result.errors.join('\n')}\n\n削除成功: ${result.success}件`)
    else alert(`${result.success}件のメールを削除しました`)
    handleSearchEmail()
    setSelectedEmails(new Set())
  }
  function handleRemediate() {
    if (flags.maliciousHostsIdentified.length === 0) { alert('まず不正なホストを特定してください'); return }
    const hostsToRemediate = flags.maliciousHostsIdentified.filter(h => !flags.hostsRemediated.includes(h))
    if (hostsToRemediate.length === 0) { alert('すべてのホストは既に駆除済みです'); return }
    const result = remediateSelectedHosts(hostsToRemediate)
    if (result.failed > 0) alert(`⚠️ エラー:\n${result.errors.join('\n')}\n\n駆除成功: ${result.success}件`)
    else alert(`${result.success}件のホストでマルウェアを駆除しました`)
  }
  function handleReset() {
    if (confirm('進捗をリセットしますか？')) {
      resetPhase5State()
      setCommResults([])
      setEmailResults([])
      setSelectedComms(new Set())
      setSelectedEmails(new Set())
      setExpandedComm(null)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: '20px', padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* 左サイドバー: Phase4からの参照情報 */}
      <aside style={{ padding: '16px', backgroundColor: '#fffaf0', borderRadius: '8px', border: '2px solid #fbd38d', height: 'fit-content', position: 'sticky', top: '20px' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.95rem', color: '#7c2d12', marginBottom: '12px' }}>📋 Phase4で判明</h3>
        <div style={{ fontSize: '0.8em', marginBottom: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #fed7aa' }}>
          <strong style={{ color: '#92400e' }}>🔍 マルウェア</strong><br/>
          <span style={{ color: '#78350f' }}>ファイル: invoice_malware.exe<br/>感染: 鈴木さんのPC<br/>動作: C&C通信</span>
        </div>
        <div style={{ fontSize: '0.8em', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #fed7aa', marginBottom: '12px' }}>
          <strong style={{ color: '#92400e' }}>📧 侵入経路</strong><br/>
          <span style={{ color: '#78350f' }}>標的型メール<br/>C&C: 203.0.113.10<br/>ドメイン: evil-domain.net</span>
        </div>
        <div style={{ padding: '10px', backgroundColor: '#fef3c7', borderRadius: '4px', fontSize: '0.75em', color: '#78350f' }}>
          <strong>💡 ヒント</strong><br/>
          C&CのIPで通信検索<br/>
          詳細で判断<br/>
          不正ホスト特定<br/>
          メール検索して削除
        </div>
      </aside>

      {/* 中央: メインゲーム画面 */}
      <main>
        <h2 style={{ textAlign: 'center', margin: '0 0 8px 0', fontSize: '1.3rem' }}>フェーズ5：横展開調査と対処</h2>
        <p style={{ color: '#4a5568', textAlign: 'center', margin: '0 0 16px 0', fontSize: '0.9em' }}>Phase4で特定した情報から、全社的な影響範囲を調査し対処してください。</p>

        {/* 進捗 */}
        <div style={{ padding: '12px', backgroundColor: '#edf2f7', borderRadius: '6px', marginBottom: '16px', border: '2px solid #cbd5e0' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>🎯 進捗</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '0.85em' }}>
            <div style={{ color: flags.maliciousHostsIdentified.length >= 2 ? '#38a169' : '#a0aec0', fontWeight: 'bold' }}>
              {flags.maliciousHostsIdentified.length >= 2 ? '✅' : '⭕'} ホスト特定 {flags.maliciousHostsIdentified.length}/2
            </div>
            <div style={{ color: flags.maliciousEmailsDeleted >= 2 ? '#38a169' : '#a0aec0', fontWeight: 'bold' }}>
              {flags.maliciousEmailsDeleted >= 2 ? '✅' : '⭕'} メール削除 {flags.maliciousEmailsDeleted}/2
            </div>
            <div style={{ color: flags.hostsRemediated.length >= 2 ? '#38a169' : '#a0aec0', fontWeight: 'bold' }}>
              {flags.hostsRemediated.length >= 2 ? '✅' : '⭕'} マルウェア駆除 {flags.hostsRemediated.length}/2
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {/* 通信ログ */}
          <section style={{ padding: '12px', backgroundColor: '#f7fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginTop: 0, fontSize: '0.95rem' }}>🔍 通信ログ調査</h3>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '0.85em' }}>
                <label><input type="radio" checked={commSearchType === 'ip'} onChange={() => setCommSearchType('ip')} /> IP</label>
                <label><input type="radio" checked={commSearchType === 'hostname'} onChange={() => setCommSearchType('hostname')} /> ホスト名</label>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input style={{ flex: 1, padding: '6px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '0.85em' }}
                  value={commQuery} onChange={(e) => setCommQuery(e.target.value)}
                  placeholder={commSearchType === 'ip' ? '例: 203.0.113' : '例: PC-SUZUKI'} />
                <button onClick={handleSearchComm} style={{ padding: '6px 12px', backgroundColor: '#4299e1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em' }}>検索</button>
              </div>
            </div>
            {commResults.length > 0 && (
              <>
                <div style={{ fontSize: '0.8em', color: '#4a5568', marginBottom: '8px' }}>{commResults.length}件</div>
                <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '8px' }}>
                  {commResults.map(c => (
                    <div key={c.id} style={{ padding: '8px', marginBottom: '6px', backgroundColor: 'white', border: `2px solid ${selectedComms.has(c.id) ? '#4299e1' : '#e2e8f0'}`, borderRadius: '4px', fontSize: '0.8em' }}>
                      <label style={{ display: 'flex', cursor: 'pointer' }}>
                        <input type="checkbox" checked={selectedComms.has(c.id)}
                          onChange={(e) => {
                            const newSet = new Set(selectedComms)
                            e.target.checked ? newSet.add(c.id) : newSet.delete(c.id)
                            setSelectedComms(newSet)
                          }} style={{ marginRight: '6px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold' }}>{c.hostname} ({c.srcIP})</div>
                          <div style={{ fontSize: '0.9em', color: '#718096' }}>→ {c.dstIP} | {new Date(c.timestamp).toLocaleTimeString('ja-JP')}</div>
                          {expandedComm === c.id && c.details && (
                            <div style={{ marginTop: '6px', padding: '6px', backgroundColor: c.isMalicious ? '#fff5f5' : '#f0fff4', borderLeft: `3px solid ${c.isMalicious ? '#fc8181' : '#68d391'}`, fontSize: '0.9em' }}>
                              {c.details}
                            </div>
                          )}
                          <button onClick={(e) => { e.preventDefault(); setExpandedComm(expandedComm === c.id ? null : c.id) }}
                            style={{ marginTop: '4px', padding: '2px 6px', fontSize: '0.75em', backgroundColor: '#edf2f7', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                            {expandedComm === c.id ? '隠す' : '詳細'}
                          </button>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                <button onClick={handleIdentifyHosts} disabled={selectedComms.size === 0}
                  style={{ width: '100%', padding: '8px', backgroundColor: selectedComms.size > 0 ? '#ed8936' : '#cbd5e0', color: 'white', border: 'none', borderRadius: '4px', cursor: selectedComms.size > 0 ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '0.85em' }}>
                  不正として特定 ({selectedComms.size})
                </button>
              </>
            )}
          </section>

          {/* メール */}
          <section style={{ padding: '12px', backgroundColor: '#f7fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginTop: 0, fontSize: '0.95rem' }}>📧 メール調査</h3>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '0.85em' }}>
                <label><input type="radio" checked={emailSearchType === 'subject'} onChange={() => setEmailSearchType('subject')} /> 件名</label>
                <label><input type="radio" checked={emailSearchType === 'from'} onChange={() => setEmailSearchType('from')} /> 送信元</label>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input style={{ flex: 1, padding: '6px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '0.85em' }}
                  value={emailQuery} onChange={(e) => setEmailQuery(e.target.value)}
                  placeholder={emailSearchType === 'subject' ? '例: 請求書' : '例: evil-domain'} />
                <button onClick={handleSearchEmail} style={{ padding: '6px 12px', backgroundColor: '#4299e1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em' }}>検索</button>
              </div>
            </div>
            {emailResults.length > 0 && (
              <>
                <div style={{ fontSize: '0.8em', color: '#4a5568', marginBottom: '8px' }}>{emailResults.length}件</div>
                <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '8px' }}>
                  {emailResults.map(m => (
                    <div key={m.id} style={{ padding: '8px', marginBottom: '6px', backgroundColor: 'white', border: `2px solid ${selectedEmails.has(m.id) ? '#4299e1' : '#e2e8f0'}`, borderRadius: '4px', fontSize: '0.8em' }}>
                      <label style={{ display: 'flex', cursor: 'pointer' }}>
                        <input type="checkbox" checked={selectedEmails.has(m.id)}
                          onChange={(e) => {
                            const newSet = new Set(selectedEmails)
                            e.target.checked ? newSet.add(m.id) : newSet.delete(m.id)
                            setSelectedEmails(newSet)
                          }} style={{ marginRight: '6px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold' }}>{m.subject}</div>
                          <div style={{ fontSize: '0.9em', color: '#718096' }}>
                            {m.from} → {m.to}<br/>
                            {new Date(m.timestamp).toLocaleTimeString('ja-JP')}
                            {m.attachments && m.attachments.length > 0 && (<div style={{ color: '#e53e3e' }}>📎 {m.attachments.join(', ')}</div>)}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                <button onClick={handleDeleteEmails} disabled={selectedEmails.size === 0}
                  style={{ width: '100%', padding: '8px', backgroundColor: selectedEmails.size > 0 ? '#e53e3e' : '#cbd5e0', color: 'white', border: 'none', borderRadius: '4px', cursor: selectedEmails.size > 0 ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '0.85em' }}>
                  選択メールを削除 ({selectedEmails.size})
                </button>
              </>
            )}
          </section>
        </div>

        {/* アクション */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
          <button onClick={handleRemediate} disabled={flags.maliciousHostsIdentified.length === 0}
            style={{ padding: '10px 24px', backgroundColor: flags.maliciousHostsIdentified.length > 0 ? '#48bb78' : '#cbd5e0', color: 'white', border: 'none', borderRadius: '6px', cursor: flags.maliciousHostsIdentified.length > 0 ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>
            特定ホストを駆除
          </button>
          <button onClick={handleReset} style={{ padding: '10px 20px', backgroundColor: '#a0aec0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>リセット</button>
        </div>

        {/* 完了 */}
        {isComplete && onNext && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ padding: '14px', backgroundColor: '#c6f6d5', borderRadius: '6px', marginBottom: '10px', border: '2px solid #9ae6b4' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#22543d' }}>✅ Phase5 完了！</h3>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.85em', color: '#276749' }}>横展開の調査と対処が完了しました。</p>
            </div>
            <button onClick={onNext} style={{ padding: '10px 28px', backgroundColor: '#4299e1', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.05rem', cursor: 'pointer', fontWeight: 'bold' }}>
              次のフェーズへ →
            </button>
          </div>
        )}
      </main>

      {/* 右サイドバー: 注意事項 */}
      <aside style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '2px solid #fca5a5', height: 'fit-content', position: 'sticky', top: '20px' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.95rem', color: '#7f1d1d', marginBottom: '12px' }}>⚠️ 注意事項</h3>
        <div style={{ fontSize: '0.8em', marginBottom: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #fecaca', color: '#991b1b' }}>
          <strong>誤検知に注意！</strong><br/>
          正常な通信・メールも混在。<br/>
          詳細を確認して慎重に判断。
        </div>
        <div style={{ fontSize: '0.8em', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', marginBottom: '10px', border: '1px solid #fecaca' }}>
          <strong style={{ color: '#7f1d1d' }}>🎯 クリア条件</strong><br/>
          <span style={{ fontSize: '0.9em', color: '#991b1b' }}>
            ① 不正ホスト2つ特定<br/>
            ② 不正メール2つ削除<br/>
            ③ 感染ホスト2つ駆除
          </span>
        </div>
        <div style={{ fontSize: '0.8em', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #fecaca' }}>
          <strong style={{ color: '#7f1d1d' }}>📝 調査手順</strong><br/>
          <span style={{ fontSize: '0.9em', color: '#991b1b', lineHeight: '1.5' }}>
            1. 通信ログ検索<br/>
            2. 詳細確認<br/>
            3. 不正ホスト選択<br/>
            4. メール検索<br/>
            5. 不正メール削除<br/>
            6. 駆除実行
          </span>
        </div>
        <div style={{ padding: '8px', backgroundColor: '#fef3c7', borderRadius: '4px', fontSize: '0.75em', color: '#78350f', border: '1px solid #fde68a', marginTop: '10px' }}>
          <strong>💭 判断ポイント</strong><br/>
          • C&C IPへの複数回通信<br/>
          • 添付ファイル付きメール<br/>
          • 不審ドメインからのメール
        </div>
      </aside>
    </div>
  )
}
