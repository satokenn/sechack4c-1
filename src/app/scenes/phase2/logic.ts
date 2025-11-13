// Phase2: 検知・アラートのビジネスロジック

export interface AlertData {
  id: string
  timestamp: string
  severity: 'high' | 'medium' | 'low'
  sourcePC: string
  destinationIP: string
  message: string
}

// サンプルアラートデータ
export const SAMPLE_ALERT: AlertData = {
  id: 'alert-001',
  timestamp: '2024-01-15 14:23:45',
  severity: 'high',
  sourcePC: '鈴木さんの PC (192.168.1.105)',
  destinationIP: '203.0.113.42 (不審な外部サーバ)',
  message: 'C&C通信の疑いがある不審な通信を検知しました'
}

export function getAlertData(): AlertData {
  return SAMPLE_ALERT
}

export function isHighSeverity(alert: AlertData): boolean {
  return alert.severity === 'high'
}
