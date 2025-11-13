# sechack4c-1

セキュリティハッカソン向けプロジェクト - サイバーセキュリティインシデント対応シミュレーション

## 概要

このプロジェクトは、サイバーセキュリティインシデントの対応プロセスを段階的に学習・体験できるインタラクティブなシミュレーションシステムです。

## 必要な環境

- **Node.js**: 18.x LTS 以上
- **Docker**: (オプション) コンテナで実行する場合
- **WSL**: (Windows) Git操作に使用

## セットアップ方法

### 1. リポジトリのクローン

```bash
git clone git@github.com:satokenn/sechack4c-1.git
cd sechack4c-1
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

## Docker を使用した起動方法

### Docker イメージのビルド

```bash
docker build -t sechack4c-1 .
```

### Docker コンテナの起動

```bash
docker run -it --rm -p 5173:5173 -v ${PWD}:/app sechack4c-1
```

- `-p 5173:5173`: ポート5173をホストにマッピング
- `-v ${PWD}:/app`: ソースコードをマウント（ホットリロード有効）
- `--rm`: コンテナ終了時に自動削除

ブラウザで `http://localhost:5173` にアクセスしてください。

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

## 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動 (Vite) |
| `npm run build` | TypeScriptをコンパイルして本番ビルド |
| `npm start` | ビルド済みアプリケーションを起動 |
| `npm test` | テストを実行 (Vitest) |

## プロジェクト構造

```
sechack4c-1/
├── src/                     # ソースコード
│   ├── app/
│   │   ├── scenes/         # 各フェーズのシーン
│   │   ├── components/     # 再利用可能なコンポーネント
│   │   ├── services/       # ビジネスロジック
│   │   └── state/          # 状態管理
│   └── index.ts            # エントリーポイント
├── tests/                   # テストコード
│   ├── unit/               # ユニットテスト
│   ├── integration/        # 統合テスト
│   └── e2e/                # E2Eテスト
├── docs/                    # ドキュメント
├── Dockerfile              # Docker設定
├── package.json            # npm依存関係
└── tsconfig.json           # TypeScript設定
```

## 技術スタック

- **フロントエンド**: React 18, TypeScript
- **ビルドツール**: Vite
- **テスト**: Vitest
- **ランタイム**: Node.js 18.x LTS
- **コンテナ**: Docker (Alpine Linux)

## 開発ワークフロー

### ブランチ戦略

このプロジェクトでは、フィーチャーごとに `git worktree` を使用して開発を行います。

```bash
# 新しいフェーチャーブランチをworktreeで作成 (WSL上で実行)
wsl -e bash -lc "cd /mnt/c/Users/satoken/programming/github/sechack4c-1 && git worktree add ../sechack4c-1-feature-name feature/feature-name"

# 作業ディレクトリに移動
cd ../sechack4c-1-feature-name

# 開発作業...

# 作業完了後、PRを作成してマージ

# worktreeのクリーンアップ
git worktree remove ../sechack4c-1-feature-name
git branch -d feature/feature-name
```

### テストの実行

```bash
# すべてのテストを実行
npm test

# 特定のテストファイルを実行
npm test -- tests/unit/example.test.ts

# ウォッチモードでテスト
npm test -- --watch
```

## トラブルシューティング

### ポートが既に使用されている

```bash
# 別のポートで起動
npm run dev -- --port 3000
```

### WSL でのgit操作エラー

このプロジェクトではGit操作をWSL上で行う必要があります。PowerShellではなくWSLを使用してください。

```bash
wsl -e bash -lc "cd /mnt/c/Users/satoken/programming/github/sechack4c-1 && git status"
```

### Docker でのホットリロードが動作しない

ボリュームマウントが正しく設定されているか確認してください:

```bash
docker run -it --rm -p 5173:5173 -v ${PWD}:/app sechack4c-1
```

## ドキュメント

- [要件定義](requirements.md)
- [技術選定](Technology_selection.md)
- [各フェーズの実装記録](docs/)

## ライセンス

このプロジェクトはハッカソン用の教育目的プロジェクトです。