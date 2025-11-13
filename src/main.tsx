import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Phase3 from './app/scenes/phase3/Phase3'
import Phase5 from './app/scenes/phase5/Phase5'
import Phase6 from './app/scenes/phase6/Phase6'
import './styles.css'

function App() {
  const [phase, setPhase] = useState<'3' | '5' | '6'>('3')
  return (
    <div className="app-root">
      <h1>シナリオ：謎の通信を遮断せよ（開発用）</h1>
      <div className="row" style={{ gap: 8, marginBottom: 12 }}>
        <button onClick={() => setPhase('3')}>Phase3へ</button>
        <button onClick={() => setPhase('5')}>Phase5へ</button>
        <button onClick={() => setPhase('6')}>Phase6へ</button>
      </div>
      {phase === '3' && <Phase3 onNext={() => setPhase('5')} />}
      {phase === '5' && <Phase5 onNext={() => setPhase('6')} />}
      {phase === '6' && <Phase6 />}
    </div>
  )
}

const root = document.getElementById('root')!
createRoot(root).render(<App />)
