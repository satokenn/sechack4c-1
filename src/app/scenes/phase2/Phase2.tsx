import React, { useState } from 'react'
import { getAlertData, type AlertData } from './logic'
import './phase2.css'

interface Phase2Props {
  onNext?: () => void
}

export default function Phase2({ onNext }: Phase2Props) {
  const [showDetail, setShowDetail] = useState(false)
  const alert = getAlertData()

  function handleAlertClick() {
    setShowDetail(true)
  }

  function handleCloseDetail() {
    setShowDetail(false)
  }

  return (
    <div className="phase2">
      <h2>セキュリティ監視ダッシュボード</h2>
      <p>リアルタイム監視システムが異常を検知しました。</p>

      <div className="dashboard">
        <div className="status-panel">
          <h3>システム状態</h3>
          <ul>
            <li>監視対象デバイス: 125台</li>
            <li>正常: 124台</li>
            <li className="status-warning">異常: 1台</li>
          </ul>
        </div>

        <div className="alerts-panel">
          <h3>アラート一覧</h3>
          <div
            className="alert-item high-priority"
            onClick={handleAlertClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleAlertClick()}
          >
            <span className="alert-badge">高</span>
            <span className="alert-time">{alert.timestamp}</span>
            <span className="alert-message">{alert.message}</span>
            <span className="alert-action">クリックして詳細を表示 →</span>
          </div>
        </div>
      </div>

      {showDetail && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>アラート詳細情報</h3>
              <button className="close-btn" onClick={handleCloseDetail}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">アラートID:</span>
                <span className="detail-value">{alert.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">検知時刻:</span>
                <span className="detail-value">{alert.timestamp}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">重要度:</span>
                <span className="detail-value severity-high">高</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">発生元PC:</span>
                <span className="detail-value highlight">{alert.sourcePC}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">通信先IP:</span>
                <span className="detail-value highlight">{alert.destinationIP}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">詳細:</span>
                <span className="detail-value">{alert.message}</span>
              </div>
            </div>
            <div className="modal-footer">
              <p className="next-action">
                ➡ 次のステップ: 被害拡大を防ぐため、速やかに<strong>隔離対応</strong>を実施してください
              </p>
              {onNext && (
                <button className="btn-primary" onClick={onNext}>
                  次へ（初動対応フェーズ）
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
