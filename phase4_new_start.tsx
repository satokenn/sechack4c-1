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
