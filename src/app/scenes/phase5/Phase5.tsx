import React, { useMemo, useState } from 'react'
import type { CommunicationRecord, EmailRecord } from '../../services/logs'
import {
  deleteEmails,
  getPhase5Flags,
  isPhase5Complete,
  remediateMalware,
  resetPhase5State,
  searchCommunications,
  searchEmails
} from './logic'

export default function Phase5({ onNext }: { onNext?: () => void }) {
  const [ip, setIp] = useState('203.0.113.10')
  const [subject, setSubject] = useState('請求書')

  const [comm, setComm] = useState<CommunicationRecord[]>([])
  const [mails, setMails] = useState<EmailRecord[]>([])

  const [flags, setFlags] = useState(getPhase5Flags())
  const complete = useMemo(() => isPhase5Complete(), [flags])

  function onSearchIP() {
    const r = searchCommunications(ip)
    setComm(r)
    setFlags(getPhase5Flags())
  }

  function onSearchSubject() {
    const r = searchEmails(subject)
    setMails(r)
    setFlags(getPhase5Flags())
  }

  function onDeleteEmails() {
    const { deleted } = deleteEmails(subject)
    // 反映のためもう一度検索
    const r = searchEmails(subject)
    setMails(r)
    setFlags(getPhase5Flags())
    alert(`メールを${deleted}件削除しました`)
  }

  function onRemediate() {
    const { remediated } = remediateMalware(ip)
    setFlags(getPhase5Flags())
    alert(remediated ? '駆除を実行しました' : '対象ホストが見つかりません')
  }

  function onReset() {
    resetPhase5State()
    setComm([])
    setMails([])
    setFlags(getPhase5Flags())
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 250px', gap: '20px', padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* 左サイドバー */}
      <aside style={{ padding: '16px', backgroundColor: '#fffaf0', borderRadius: '8px', border: '2px solid #fbd38d' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.95rem', color: '#7c2d12' }}>📋 Phase4からの情報</h3>
        <div style={{ fontSize: '0.85em', marginBottom: '12px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
          <strong>🔍 マルウェア検出</strong><br/>
          ファイル: invoice_malware.exe<br/>
          感染: 鈴木さんのPC
        </div>
        <div style={{ fontSize: '0.85em', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
          <strong>📧 侵入経路</strong><br/>
          標的型メール<br/>
          C&Cサーバー: 203.0.113.10<br/>
          ドメイン: evil-domain.net
        </div>
      </aside>

      {/* メイン画面 */}
      <div className="phase5">
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>フェーズ5：横展開調査と駆除</h2>
        <p style={{ textAlign: 'center', marginBottom: '16px' }}>フェーズ4で特定したIPと件名を使って横展開を確認し、対処を行ってください。</p>

      <section>
        <h3>全社通信ログ検索（IP）</h3>
        <div className="row">
          <input
            aria-label="ip"
            value={ip}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIp(e.target.value)}
            placeholder="例: 203.0.113.10"
          />
          <button onClick={onSearchIP}>検索</button>
        </div>
        <div className="summary">件数: {comm.length}</div>
        <ul>
          {comm.map((c: CommunicationRecord) => (
            <li key={c.id}>
              {c.timestamp} {c.srcIP} → {c.dstIP}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>全社メールログ検索（件名）</h3>
        <div className="row">
          <input
            aria-label="subject"
            value={subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
            placeholder="例: 請求書"
          />
          <button onClick={onSearchSubject}>検索</button>
        </div>
        <div className="summary">件数: {mails.length}</div>
        <ul>
          {mails.map((m: EmailRecord) => (
            <li key={m.id}>
              {m.timestamp} {m.from} → {m.to} / 件名: {m.subject} {m.deleted ? '（削除済）' : ''}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>対処</h3>
        <div className="row">
          <button onClick={onDeleteEmails} disabled={mails.length === 0}>メール一斉削除</button>
          <button onClick={onRemediate} disabled={comm.length === 0}>マルウェア駆除</button>
        </div>
      </section>

      <section>
        <h3>進捗</h3>
        <ul>
          <li>通信ログ検索: {flags.communicationSearched ? '済' : '未'}</li>
          <li>メールログ検索: {flags.emailSearched ? '済' : '未'}</li>
          <li>メール一斉削除: {flags.emailDeleted ? '済' : '未'}</li>
          <li>マルウェア駆除: {flags.malwareRemediated ? '済' : '未'}</li>
        </ul>
        <div className="row">
          <button onClick={onReset}>進捗をリセット</button>
          <button disabled={!complete} onClick={() => onNext && onNext()}>次へ（Phase6）</button>
        </div>
      </section>
      </div>

      {/* 右サイドバー */}
      <aside style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '2px solid #fca5a5' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.95rem', color: '#7f1d1d' }}>⚠️ 注意事項</h3>
        <div style={{ fontSize: '0.85em', marginBottom: '12px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
          <strong>🎯 クリア条件</strong><br/>
          ① 通信ログ調査完了<br/>
          ② メール調査完了<br/>
          ③ メール削除実行<br/>
          ④ マルウェア駆除実行
        </div>
        <div style={{ fontSize: '0.85em', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
          <strong>💡 調査のヒント</strong><br/>
          ・C&CサーバーのIPで検索<br/>
          ・件名「請求書」で検索<br/>
          ・送信元ドメインを確認
        </div>
      </aside>
    </div>
  )
}
