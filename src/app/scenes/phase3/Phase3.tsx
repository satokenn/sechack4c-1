import React, { useState } from 'react'

const OPTIONS = [
  { id: 'physical', label: '物理的隔離（電源を切る／ネットワーク切断）', correct: true },
  { id: 'remote', label: 'リモート隔離（管理ツールで切断）', correct: false },
  { id: 'phone', label: '電話連絡（担当者へ連絡）', correct: false },
  { id: 'monitor', label: '監視継続（状況をさらに観察する）', correct: false }
]

export default function Phase3() {
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<'idle' | 'success' | 'failure'>('idle')

  function submit() {
    if (!selected) return
    const opt = OPTIONS.find((o) => o.id === selected)
    if (opt?.correct) {
      setResult('success')
    } else {
      setResult('failure')
    }
  }

  function retry() {
    setSelected(null)
    setResult('idle')
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
          <h2>成功！物理的隔離で被害拡大を止めました。</h2>
          <p>次のフェーズ（調査・分析）へ進みます。</p>
          <button onClick={retry}>もう一度（開発用）</button>
        </div>
      )}

      {result === 'failure' && (
        <div className="result failure">
          <h2>失敗：その対応では被害を拡大する可能性があります。</h2>
          <p>正しい初動対応は「物理的隔離」です。再度選択してください。</p>
          <button onClick={retry}>リトライ</button>
        </div>
      )}
    </div>
  )
}
