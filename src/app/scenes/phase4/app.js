// フェーズ4：簡易ドラッグ＆ドロップの挙動
;(function(){
  const draggables = document.querySelectorAll('[draggable]')
  const scanZone = document.getElementById('scan-zone')
  const logZone = document.getElementById('log-zone')
  const scanResult = document.getElementById('scan-result')
  const logResult = document.getElementById('log-result')

  draggables.forEach(el=>{
    el.addEventListener('dragstart', e=>{
      e.dataTransfer.setData('text/plain', el.id)
      el.classList.add('dragging')
    })
    el.addEventListener('dragend', ()=>el.classList.remove('dragging'))
  })

  function setupZone(zone, handler){
    zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.style.borderColor='#2b6cb0' })
    zone.addEventListener('dragleave', e=>{ zone.style.borderColor='#e3eefc' })
    zone.addEventListener('drop', e=>{
      e.preventDefault(); zone.style.borderColor='#e3eefc'
      const id = e.dataTransfer.getData('text/plain')
      handler(id)
    })
  }

  setupZone(scanZone, id=>{
    if(!id){ scanResult.textContent='不正なアイテムです'; scanResult.className='fail'; return }
    if(id==='file-suspicious'){
      scanResult.innerHTML = '<strong class="success">マルウェア検出:</strong> invoice_malware.exe<br><button id="quarantine">物理隔離手順を確認</button>'
      const btn = document.getElementById('quarantine')
      btn && btn.addEventListener('click', ()=>alert('物理隔離：端末をネットワークから切断し、電源を確保して調査用端末へ移送します（デモ）'))
    } else if(id==='file-benign'){
      scanResult.innerHTML = '<span class="fail">問題なし: readme.txt</span>'
    } else {
      scanResult.innerHTML = '<span class="fail">期待するファイルをドロップしてください</span>'
    }
  })

  setupZone(logZone, id=>{
    if(id==='mail-log'){
      logResult.innerHTML = '<strong class="success">侵入経路特定:</strong> 標的型メール（請求書.zip）を開封 → マクロ実行で感染の可能性<br><button id="show-ips">通信先IPを確認</button>'
      const btn = document.getElementById('show-ips')
      btn && btn.addEventListener('click', ()=>alert('ログ: 192.0.2.45 (疑わしい C&C サーバ) への通信が確認されました（デモ）'))
    } else {
      logResult.innerHTML = '<span class="fail">メールログをドロップしてください</span>'
    }
  })

})();
