# sechack4c-1

セキュリティハッカソン向けプロジェクト - サイバーセキュリティインシデント対応シミュレーション

## 概要

このプロジェクトは、サイバーセキュリティインシデントの対応プロセスを段階的に学習・体験できるインタラクティブなシミュレーションシステムです。

## 実装済みフェーズ

### フェーズ4: 調査・分析 ✅

**実装日**: 2025年11月13日  
**場所**: `src/app/scenes/phase4/`

フェーズ4では、インシデント発生後の調査・分析プロセスをドラッグ&ドロップUIで体験できます。

#### 機能
- 不審なファイルのマルウェアスキャン
- メールログの解析
- インタラクティブなドラッグ&ドロップUI

#### 動作確認方法
```bash
# ブラウザで直接開く
explorer src/app/scenes/phase4/index.html

# または簡易サーバーで起動
cd src/app/scenes/phase4
npx http-server -p 8080
```

詳細は [`src/app/scenes/phase4/README.md`](src/app/scenes/phase4/README.md) を参照してください。

## プロジェクト構造

```
sechack4c-1/
├── src/
│   ├── app/
│   │   ├── scenes/
│   │   │   └── phase4/      # フェーズ4実装
│   │   ├── components/
│   │   ├── services/
│   │   └── state/
│   └── index.ts
├── docs/
│   ├── phase4.md            # フェーズ4実装記録
│   └── requirements.md      # 要件定義
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── tools/
```

## 技術スタック

- **言語**: TypeScript, JavaScript, HTML, CSS
- **ランタイム**: Node.js (LTS 18.x+)
- **バージョン管理**: Git (worktree使用)

## 開発ワークフロー

このプロジェクトでは、フィーチャーごとに `git worktree` を使用して開発を行います。

```bash
# 新しいフェーチャーブランチをworktreeで作成
wsl -e bash -lc "cd /mnt/c/Users/satoken/programming/github/sechack4c-1 && git worktree add ../sechack4c-1-feature-name feature/feature-name"

# 作業完了後、PRを作成してマージ
# worktreeのクリーンアップ
git worktree remove ../sechack4c-1-feature-name
git branch -d feature/feature-name
```

## 今後の予定

### フェーズ4の改善
- TypeScript への移行
- React/Vite への統合
- E2E テスト追加

### その他のフェーズ
- フェーズ1: 初動対応
- フェーズ2: 封じ込め
- フェーズ3: 根絶
- フェーズ5: 復旧
- フェーズ6: 事後対応

## ドキュメント

- [要件定義](requirements.md)
- [技術選定](Technology_selection.md)
- [フェーズ4実装記録](docs/phase4.md)

## ライセンス

このプロジェクトはハッカソン用の教育目的プロジェクトです。