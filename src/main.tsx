import React from 'react'
import { createRoot } from 'react-dom/client'
import Phase3 from './app/scenes/phase3/Phase3'
import './styles.css'

function App() {
  return (
    <div className="app-root">
      <h1>シナリオ：謎の通信を遮断せよ（Phase3: 初動対応）</h1>
      <Phase3 />
    </div>
  )
}

const root = document.getElementById('root')!
createRoot(root).render(<App />)
