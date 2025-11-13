import React, { useState } from 'react'

interface Phase4Props {
  onNext?: () => void
}

type ItemType = 'file-suspicious' | 'file-benign' | 'mail-log'

interface Item {
  id: ItemType
  label: string
  type: 'file' | 'log'
}

const ITEMS: Item[] = [
  { id: 'file-suspicious', label: '不審なファイル: invoice_malware.exe', type: 'file' },
  { id: 'file-benign', label: '正常ファイル: readme.txt', type: 'file' },
  { id: 'mail-log', label: 'メールログ: 請求書.zip を受信', type: 'log' }
]

export default function Phase4({ onNext }: Phase4Props) {
  const [draggedItem, setDraggedItem] = useState<ItemType | null>(null)
  const [scanResult, setScanResult] = useState<string>('')
  const [logResult, setLogResult] = useState<string>('')
  const [scanSuccess, setScanSuccess] = useState(false)
  const [logSuccess, setLogSuccess] = useState(false)

  const allCompleted = scanSuccess && logSuccess

  function handleDragStart(itemId: ItemType) {
    setDraggedItem(itemId)
  }

  function handleDragEnd() {
    setDraggedItem(null)
  }

  function handleDropOnScan(e: React.DragEvent) {
    e.preventDefault()
    if (!draggedItem) return

    if (draggedItem === 'file-suspicious') {
      setScanResult('マルウェア検出: invoice_malware.exe')
      setScanSuccess(true)
    } else if (draggedItem === 'file-benign') {
      setScanResult('問題なし: readme.txt（スキャン結果：正常）')
      setScanSuccess(false)
    } else {
      setScanResult('期待するファイルをドロップしてください')
      setScanSuccess(false)
    }
    setDraggedItem(null)
  }

  function handleDropOnLog(e: React.DragEvent) {
    e.preventDefault()
    if (!draggedItem) return

    if (draggedItem === 'mail-log') {
      setLogResult('侵入経路特定: 標的型メール（請求書.zip）を開封 → マクロ実行で感染の可能性')
      setLogSuccess(true)
    } else {
      setLogResult('メールログをドロップしてください')
      setLogSuccess(false)
    }
    setDraggedItem(null)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  return (
    <div className="phase4">
      <h2>フェーズ4：調査・分析（ドラッグ＆ドロップ）</h2>
      <p>ツールボックスからアイテムをドラッグして、対応する調査エリアにドロップしてください。</p>

      <div className="container">
        <section className="toolbox">
          <h3>ツールボックス</h3>
          <ul>
            {ITEMS.map((item) => (
              <li
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onDragEnd={handleDragEnd}
                className={`tool-item ${draggedItem === item.id ? 'dragging' : ''}`}
              >
                {item.type === 'file' ? '📄' : '📧'} {item.label}
              </li>
            ))}
          </ul>
        </section>

        <section className="workarea">
          <div
            className={`dropzone ${scanSuccess ? 'success' : ''}`}
            onDrop={handleDropOnScan}
            onDragOver={handleDragOver}
          >
            <h3>不審なファイルのスキャンエリア</h3>
            {!scanResult && <div className="hint">ここにファイルをドロップ</div>}
            {scanResult && (
              <div className={`result ${scanSuccess ? 'success' : 'fail'}`}>
                {scanSuccess ? '✅ ' : '❌ '}
                {scanResult}
              </div>
            )}
          </div>

          <div
            className={`dropzone ${logSuccess ? 'success' : ''}`}
            onDrop={handleDropOnLog}
            onDragOver={handleDragOver}
          >
            <h3>メールログ解析エリア</h3>
            {!logResult && <div className="hint">ここにメールログをドロップ</div>}
            {logResult && (
              <div className={`result ${logSuccess ? 'success' : 'fail'}`}>
                {logSuccess ? '✅ ' : '❌ '}
                {logResult}
              </div>
            )}
          </div>
        </section>
      </div>

      {allCompleted && (
        <div className="completion-message">
          <h3>🎉 調査完了！</h3>
          <p>マルウェアの特定と侵入経路の解明ができました。</p>
          <p>次は横展開の有無を確認し、対処を実施します。</p>
          {onNext && (
            <button onClick={onNext} className="btn-primary">
              次へ（横展開調査フェーズ）
            </button>
          )}
        </div>
      )}

      <aside className="explain">
        <h3>操作と学び</h3>
        <ol>
          <li>不審なファイルをスキャンしてマルウェアを特定します。</li>
          <li>メールログを解析して侵入経路（標的型メールなど）を特定します。</li>
          <li>正しい組み合わせで解析が進むと次のフェーズに進めます。</li>
        </ol>
      </aside>

      <style>{`
        .phase4 {
          padding: 20px;
        }

        .container {
          display: flex;
          gap: 30px;
          margin: 30px 0;
        }

        .toolbox {
          flex: 1;
          background: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
        }

        .toolbox h3 {
          margin-top: 0;
          color: #333;
        }

        .toolbox ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .tool-item {
          background: white;
          border: 2px solid #ddd;
          border-radius: 6px;
          padding: 12px 15px;
          margin: 10px 0;
          cursor: move;
          transition: all 0.2s;
          user-select: none;
        }

        .tool-item:hover {
          border-color: #4a9eff;
          transform: translateX(5px);
          box-shadow: 0 2px 8px rgba(74, 158, 255, 0.3);
        }

        .tool-item.dragging {
          opacity: 0.5;
          transform: rotate(5deg);
        }

        .workarea {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .dropzone {
          background: #e3f2fd;
          border: 3px dashed #90caf9;
          border-radius: 8px;
          padding: 25px;
          min-height: 150px;
          transition: all 0.3s;
        }

        .dropzone:hover {
          border-color: #42a5f5;
          background: #bbdefb;
        }

        .dropzone.success {
          background: #e8f5e9;
          border-color: #66bb6a;
        }

        .dropzone h3 {
          margin-top: 0;
          color: #1976d2;
        }

        .dropzone.success h3 {
          color: #388e3c;
        }

        .hint {
          text-align: center;
          color: #999;
          font-style: italic;
          padding: 30px;
        }

        .result {
          background: white;
          border-radius: 6px;
          padding: 15px;
          margin-top: 10px;
        }

        .result.success {
          color: #2e7d32;
          border-left: 4px solid #66bb6a;
        }

        .result.fail {
          color: #c62828;
          border-left: 4px solid #ef5350;
        }

        .completion-message {
          background: #f1f8e9;
          border: 2px solid #aed581;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
          text-align: center;
        }

        .completion-message h3 {
          color: #558b2f;
          margin-top: 0;
        }

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
