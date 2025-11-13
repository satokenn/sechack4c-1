import React, { useState } from 'react'

interface Phase2Props {
  onNext?: () => void
}

export default function Phase2({ onNext }: Phase2Props) {
  const [showAlert, setShowAlert] = useState(true)
  const [showDetail, setShowDetail] = useState(false)

  function handleAlertClick() {
    setShowAlert(false)
    setShowDetail(true)
  }

  return (
    <div className="phase2">
      <h2>フェーズ2：検知（アラート）</h2>
      <p>監視ダッシュボードに高優先度アラートが表示されています。</p>

      {showAlert && (
        <div className="dashboard">
          <div className="alert-panel">
            <div className="alert-item high-priority blinking" onClick={handleAlertClick}>
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <strong>高優先度アラート</strong>
                <p>不審な外部通信を検知</p>
                <p className="timestamp">2025-11-13 15:32:45</p>
              </div>
            </div>
          </div>
          <p className="hint">アラートをクリックして詳細を確認してください</p>
        </div>
      )}

      {showDetail && (
        <div className="alert-detail">
          <h3>アラート詳細</h3>
          <div className="detail-content">
            <div className="detail-item">
              <strong>発生元PC：</strong>
              <span>SUZUKI-PC (192.168.1.100)</span>
            </div>
            <div className="detail-item">
              <strong>通信先IP：</strong>
              <span>203.0.113.45 (C&Cサーバー疑い)</span>
            </div>
            <div className="detail-item">
              <strong>通信プロトコル：</strong>
              <span>HTTPS (443)</span>
            </div>
            <div className="detail-item">
              <strong>通信頻度：</strong>
              <span>5分ごと（定期的）</span>
            </div>
            <div className="detail-item">
              <strong>検知時刻：</strong>
              <span>2025-11-13 15:32:45</span>
            </div>
          </div>

          <div className="alert-message">
            <p>⚠️ このパターンはマルウェアによるC&C通信の可能性が高いです。</p>
            <p>直ちに初動対応（隔離）を実施してください。</p>
          </div>

          <div className="actions">
            {onNext && (
              <button onClick={onNext} className="btn-primary">
                次へ（初動対応フェーズ）
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .phase2 {
          padding: 20px;
        }

        .dashboard {
          margin: 20px 0;
        }

        .alert-panel {
          background: #1a1a1a;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }

        .alert-item {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #2a2a2a;
          border: 2px solid #ff6b6b;
          border-radius: 6px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .alert-item:hover {
          background: #333;
          border-color: #ff8787;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        .alert-item.blinking {
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .alert-icon {
          font-size: 32px;
        }

        .alert-content {
          flex: 1;
        }

        .alert-content strong {
          color: #ff6b6b;
          font-size: 18px;
          display: block;
          margin-bottom: 8px;
        }

        .alert-content p {
          margin: 4px 0;
          color: #ccc;
        }

        .timestamp {
          font-size: 12px;
          color: #888;
        }

        .hint {
          text-align: center;
          color: #aaa;
          font-style: italic;
          margin-top: 15px;
        }

        .alert-detail {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 25px;
          margin: 20px 0;
          border: 2px solid #ff6b6b;
        }

        .alert-detail h3 {
          color: #ff6b6b;
          margin-bottom: 20px;
        }

        .detail-content {
          background: white;
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-item strong {
          min-width: 150px;
          color: #333;
        }

        .detail-item span {
          color: #666;
          font-family: monospace;
        }

        .alert-message {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
        }

        .alert-message p {
          margin: 8px 0;
          color: #856404;
        }

        .actions {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  )
}
