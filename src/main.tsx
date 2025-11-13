import React from 'react'
import { createRoot } from 'react-dom/client'
import Phase2 from './app/scenes/phase2/Phase2'
import Phase3 from './app/scenes/phase3/Phase3'
import './styles.css'

function App() {
  return (
    <div className="app-root">
      <h1>シナリオ：謎の通信を遮断せよ</h1>
      <Phase2 />
      <hr style={{ margin: '32px 0', border: 'none', borderTop: '2px solid #e2e8f0' }} />
      <Phase3 />
    </div>
  )
}

const root = document.getElementById('root')!
createRoot(root).render(<App />)
