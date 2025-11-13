# src

実装コードを格納するトップディレクトリです。

- フェーズ3: `app/scenes/phase3/`
- フェーズ5: `app/scenes/phase5/`
- フェーズ6: `app/scenes/phase6/`

開発メモ（Phase5 単体/連続の確認）

1) 依存インストール（worktree フォルダで実行）
	- `npm install`
2) 単体の動作確認
	- `npm run dev` でブラウザを開き、Phase5 の検索（IP/件名）→対処（削除/駆除）→完了まで確認
3) 連続の確認
	- 画面上部のボタンで Phase3 ↔ Phase5 を切り替え可能
4) テスト
	- `npm test` で Phase5 ロジックのユニットテストを実行