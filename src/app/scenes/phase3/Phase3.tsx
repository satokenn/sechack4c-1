import React, { useState } from 'react'

const OPTIONS = [
  { 
    id: 'physical', 
    label: '物理的隔離（電源を切る／ネットワーク切断）', 
    correct: true,
    explanation: '' 
  },
  { 
    id: 'remote', 
    label: 'リモート隔離（管理ツールで切断）', 
    correct: false,
    explanation: 'マルウェアが管理ツールを無効化している可能性があり、リモート操作が効かない場合があります。また、通信が確立されている間に更なる情報漏洩や感染拡大が起こる危険性があります。'
  },
  { 
    id: 'phone', 
    label: '電話連絡（担当者へ連絡）', 
    correct: false,
    explanation: '電話連絡をしている間もマルウェアは活動を続け、機密情報の窃取や他の端末への感染が進行します。初動対応としては時間がかかりすぎるため、まず隔離を優先すべきです。'
  },
  { 
    id: 'monitor', 
    label: '監視継続（状況をさらに観察する）', 
    correct: false,
    explanation: '観察している間にマルウェアは活動を続け、被害が拡大します。C&C通信が確認された時点で、即座に隔離することが鉄則です。様子見は被害を深刻化させる最悪の選択です。'
  }
]

interface Phase3Props {
  onNext?: () => void
}

export default function Phase3({ onNext }: Phase3Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<'idle' | 'success' | 'failure'>('idle')
  const [failedOption, setFailedOption] = useState<typeof OPTIONS[0] | null>(null)

  function submit() {
    if (!selected) return
    const opt = OPTIONS.find((o) => o.id === selected)
    if (opt?.correct) {
      setResult('success')
      setFailedOption(null)
    } else {
      setResult('failure')
      setFailedOption(opt || null)
    }
  }

  function retry() {
    setSelected(null)
    setResult('idle')
    setFailedOption(null)
  }

  return (
    <div className="phase3">
      <p>鈴木さんの端末がマルウェア感染しており、C&C 通信が確認されています。最優先で被害拡大を防ぐための対応を選んでください。</p>

      {result === 'idle' && (
        <div className="options">
          {OPTIONS.map((o) => (
            <label key={o.id} className={`option ${selected === o.id ? 'selected' : ''}`}>
              <input type="radio" name="phase3" value={o.id} checked={selected === o.id} onChange={() => setSelected(o.id)} />
              {o.label}
            </label>
          ))}

          <div className="actions">
            <button onClick={submit} disabled={!selected} className="btn-primary">決定</button>
          </div>
        </div>
      )}

      {result === 'success' && (
        <div className="result success">
          <h2>✅ 成功！物理的隔離で被害拡大を止めました</h2>
          <div className="success-explanation">
            <p><strong>適切な対応です！</strong></p>
            <p>物理的隔離により、マルウェアによる追加の情報漏洩や他端末への感染拡大を防ぐことができました。</p>
            <p>次は、感染の原因や影響範囲を調査・分析するフェーズに進みます。</p>
          </div>
          <div className="actions">
            {onNext && <button onClick={onNext} className="btn-primary">次のフェーズへ</button>}
            <button onClick={retry}>もう一度（開発用）</button>
          </div>
        </div>
      )}

      {result === 'failure' && failedOption && (
        <div className="result failure">
          <h2>❌ 失敗：その対応では被害を拡大する可能性があります</h2>
          <div className="failure-explanation">
            <h3>選択した対応：{failedOption.label}</h3>
            <p className="explanation-text">
              <strong>⚠️ この選択が良くない理由：</strong><br />
              {failedOption.explanation}
            </p>
          </div>
          <div className="correct-answer-hint">
            <p>💡 <strong>正しい初動対応は「物理的隔離」です。</strong></p>
            <p>マルウェア感染が確認された場合、最優先すべきは被害の拡大防止です。電源を切るかネットワークケーブルを抜いて、物理的に通信を遮断することが最も確実な方法です。</p>
          </div>
          <button onClick={retry} className="btn-retry">リトライ</button>
        </div>
      )}
    </div>
  )
}
