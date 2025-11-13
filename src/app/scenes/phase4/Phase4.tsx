import React, { useState } from 'react'

interface Phase4Props {
  onNext?: () => void
}

interface Email {
  id: string
  from: string
  subject: string
  date: string
  attachment?: string
  isMalicious: boolean
}

interface SelectedEmail {
  email: Email
  attachment: string
}

const EMAILS: Email[] = [
  {
    id: 'email1',
    from: 'accounting@partner-corp.co.jp',
    subject: '【重要】11月分請求書の送付',
    date: '2024/11/10 14:23',
    attachment: '請求書_202411.xlsx',
    isMalicious: false
  },
  {
    id: 'email2',
    from: 'support@secure-update.com',
    subject: 'セキュリティアップデートのお知らせ',
    date: '2024/11/11 09:47',
    attachment: 'security_patch.exe',
    isMalicious: true
  },
  {
    id: 'email3',
    from: 'hr@company-internal.jp',
    subject: '社内向け：年末調整資料',
    date: '2024/11/12 16:15',
    attachment: '年末調整_案内.pdf',
    isMalicious: false
  },
  {
    id: 'email4',
    from: 'noreply@cloud-storage.jp',
    subject: 'ファイル共有の通知',
    date: '2024/11/13 10:02',
    attachment: '共有ドキュメント.pdf.scr',
    isMalicious: true
  }
]

export default function Phase4({ onNext }: Phase4Props) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [draggedAttachment, setDraggedAttachment] = useState<SelectedEmail | null>(null)
  const [scanResult, setScanResult] = useState<string>('')
  const [foundMalware, setFoundMalware] = useState(false)

  function handleEmailClick(email: Email) {
    setSelectedEmail(email)
    setScanResult('') // リセット
  }

  function handleDragStart(email: Email) {
    if (email.attachment) {
      setDraggedAttachment({ email, attachment: email.attachment })
    }
  }

  function handleDragEnd() {
    setDraggedAttachment(null)
  }

  function handleDropOnScan(e: React.DragEvent) {
    e.preventDefault()
    if (!draggedAttachment) return

    const { email, attachment } = draggedAttachment
    
    if (email.isMalicious) {
      setScanResult(
        `⚠️ マルウェア検出！\n` +
        `ファイル名: ${attachment}\n` +
        `検出内容: トロイの木馬型マルウェア\n` +
        `危険度: 高\n` +
        `送信元: ${email.from}`
      )
      setFoundMalware(true)
    } else {
      setScanResult(
        `✅ スキャン完了\n` +
        `ファイル名: ${attachment}\n` +
        `結果: 問題なし（安全）\n` +
        `送信元: ${email.from}`
      )
    }
    setDraggedAttachment(null)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  return (
    <div className="phase4">
      <h2>フェーズ4：調査・分析</h2>
      <p>鈴木さんが受信したメールを調査し、不審な添付ファイルを特定してください。</p>

      <div className="container">
        <section className="email-list">
          <h3>📧 受信メール一覧</h3>
          <div className="emails">
            {EMAILS.map((email) => (
              <div
                key={email.id}
                className={`email-item ${selectedEmail?.id === email.id ? 'selected' : ''}`}
                onClick={() => handleEmailClick(email)}
              >
                <div className="email-header">
                  <strong>{email.subject}</strong>
                </div>
                <div className="email-meta">
                  <span>差出人: {email.from}</span>
                  <span>{email.date}</span>
                </div>
                {email.attachment && (
                  <div className="email-attachment">
                    � 添付ファイル: {email.attachment}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="detail-area">
          {!selectedEmail ? (
            <div className="hint-box">
              <p>👈 左のメール一覧からメールを選択してください</p>
            </div>
          ) : (
            <>
              <div className="email-detail">
                <h3>{selectedEmail.subject}</h3>
                <div className="detail-row">
                  <span className="label">差出人:</span>
                  <span>{selectedEmail.from}</span>
                </div>
                <div className="detail-row">
                  <span className="label">日時:</span>
                  <span>{selectedEmail.date}</span>
                </div>
                {selectedEmail.attachment && (
                  <div
                    className={`attachment-box ${draggedAttachment?.email.id === selectedEmail.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(selectedEmail)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="attachment-icon">📎</div>
                    <div className="attachment-name">{selectedEmail.attachment}</div>
                    <div className="drag-hint">👆 ドラッグしてスキャンエリアへ</div>
                  </div>
                )}
              </div>

              <div
                className={`scan-zone ${foundMalware ? 'alert' : ''}`}
                onDrop={handleDropOnScan}
                onDragOver={handleDragOver}
              >
                <h3>🔍 ファイルスキャンエリア</h3>
                {!scanResult ? (
                  <div className="hint">添付ファイルをここにドロップしてスキャン</div>
                ) : (
                  <pre className="scan-result">{scanResult}</pre>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {foundMalware && (
        <div className="completion-message">
          <h3>� マルウェアを特定しました！</h3>
          <p>不審なファイルの発見に成功しました。次のステップに進みましょう。</p>
          {onNext && (
            <button onClick={onNext} className="btn-primary">
              次へ（封じ込めフェーズ）
            </button>
          )}
        </div>
      )}

      <aside className="explain">
        <h3>💡 操作方法</h3>
        <ol>
          <li>受信メール一覧から各メールをクリックして内容を確認</li>
          <li>添付ファイルをドラッグ＆ドロップでスキャンエリアに移動</li>
          <li>スキャン結果を確認し、マルウェアを特定する</li>
        </ol>
      </aside>

      <style>{`
        .phase4 {
          padding: 20px;
        }

        .container {
          display: flex;
          gap: 20px;
          margin: 30px 0;
          height: 600px;
        }

        /* メール一覧パネル */
        .email-list {
          flex: 1;
          background: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .email-list h3 {
          margin: 0;
          padding: 15px;
          background: #e9ecef;
          color: #495057;
          font-size: 16px;
          border-bottom: 1px solid #dee2e6;
        }

        .emails {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }

        .email-item {
          background: white;
          border: 2px solid #dee2e6;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .email-item:hover {
          border-color: #4a9eff;
          box-shadow: 0 2px 8px rgba(74, 158, 255, 0.2);
        }

        .email-item.selected {
          border-color: #4a9eff;
          background: #e7f3ff;
        }

        .email-header {
          font-weight: bold;
          color: #212529;
          margin-bottom: 5px;
        }

        .email-meta {
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 3px;
        }

        .email-attachment {
          font-size: 11px;
          color: #007bff;
          margin-top: 5px;
        }

        /* 詳細パネル */
        .detail-area {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .hint-box {
          background: #e9ecef;
          border: 2px dashed #adb5bd;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          color: #6c757d;
          font-style: italic;
        }

        .email-detail {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
        }

        .email-detail h3 {
          margin-top: 0;
          color: #212529;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 10px;
        }

        .detail-row {
          margin: 10px 0;
          color: #495057;
        }

        .detail-row .label {
          font-weight: bold;
          color: #6c757d;
          display: inline-block;
          width: 80px;
        }

        /* 添付ファイルボックス */
        .attachment-box {
          background: #f8f9fa;
          border: 2px solid #4a9eff;
          border-radius: 8px;
          padding: 15px;
          margin-top: 15px;
          cursor: move;
          transition: all 0.2s;
          display: inline-block;
        }

        .attachment-box.dragging {
          opacity: 0.5;
          transform: rotate(3deg);
        }

        .attachment-box:hover {
          background: #e7f3ff;
          box-shadow: 0 2px 8px rgba(74, 158, 255, 0.3);
        }

        .attachment-icon {
          font-size: 24px;
          margin-right: 10px;
        }

        .attachment-name {
          font-weight: bold;
          color: #212529;
        }

        .drag-hint {
          font-size: 12px;
          color: #6c757d;
          margin-top: 5px;
        }

        /* スキャンゾーン */
        .scan-zone {
          background: #e3f2fd;
          border: 3px dashed #90caf9;
          border-radius: 8px;
          padding: 25px;
          min-height: 200px;
          transition: all 0.3s;
        }

        .scan-zone:hover {
          border-color: #42a5f5;
          background: #bbdefb;
        }

        .scan-zone.alert {
          background: #ffebee;
          border-color: #ef5350;
        }

        .scan-zone h3 {
          margin-top: 0;
          color: #1976d2;
        }

        .scan-zone.alert h3 {
          color: #c62828;
        }

        .scan-result {
          background: white;
          border-radius: 6px;
          padding: 15px;
          margin-top: 15px;
          font-family: 'Courier New', monospace;
          white-space: pre-wrap;
          color: #212529;
          line-height: 1.6;
        }

        /* 完了メッセージ */
        .completion-message {
          background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
          border: 2px solid #aed581;
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
          text-align: center;
          animation: slideIn 0.5s ease-out;
        }

        .completion-message h3 {
          color: #558b2f;
          margin-top: 0;
          font-size: 24px;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .btn-primary {
          background: #4a9eff;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px 24px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #3b8fe0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 158, 255, 0.4);
        }

        /* 解説エリア */
        .explain {
          background: #fff3e0;
          border-left: 4px solid #ff9800;
          border-radius: 4px;
          padding: 20px;
          margin-top: 30px;
        }

        .explain h3 {
          margin-top: 0;
          color: #e65100;
        }

        .explain ol {
          margin: 10px 0;
          padding-left: 20px;
        }

        .explain li {
          margin: 8px 0;
          color: #666;
        }
      `}</style>
    </div>
  )
}
