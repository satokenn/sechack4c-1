# 技術選定（Technology Selection）

## 目的
このドキュメントは、本プロジェクトで採用する技術スタックと理由、開発・ビルド・テスト・CIに関する推奨設定および次の実装ステップをまとめます。提案は TypeScript を主言語として構築されます（ユーザの希望）。

## 前提
- ユーザは TypeScript での開発を希望しています。
- 現在のリポジトリは小規模で、まだ言語選定・環境構築が行われていません。

## 推奨技術スタック
- 言語: TypeScript (最新の安定版)
- 実行環境: Node.js (LTS 推奨、例えば 18.x 以上)
- パッケージマネージャ: npm（既存の Node エコシステムと互換性が高い）
- コンテナ: Docker（開発環境と CI を統一）

### フレームワーク / ライブラリ（用途別）
- CLI / スクリプト向け: ts-node + yargs / commander
- Web サービス / API: Node + Express (小規模) または Fastify (高性能・型安全)
- フロントエンド: React + Vite + TypeScript（必要があれば）
- テスト: Jest（ts-jest）または Vitest
- Lint / Formatter: ESLint + Prettier + TypeScript ESLint プラグイン
- 型チェック: TypeScript コンパイラ（tsc）
- ビルド: tsc + Rollup または esbuild（ライブラリ配布やバンドルが必要な場合）
- フォルダ構成: src/、test/、bin/（CLI の場合）

## 開発ツール・設定（推奨）
- tsconfig.json: strict モードを有効化（"strict": true）
- eslint: TypeScript ESLint 設定、Prettier と連携
- husky + lint-staged: commit 前に lint とテストを実行
- GitHub Actions: push と PR に対して型チェック、lint、テストを実行
- Dockerfile / docker-compose: Node.js 18 LTS イメージをベースに依存関係を固定化し、ローカルと CI の環境差異を吸収

## CI/CD
- GitHub Actions ワークフロー
  - jobs: install, lint, typecheck, test, build
  - Node バージョン行列で LTS を指定
  - Docker コンテナでのビルド・テスト実行（自己ホストや GitHub-hosted ランナーのどちらでも再現性を確保）

## 理由（短く）
- TypeScript: 型安全により保守性が高まる。JavaScript の互換性も維持。
- Node.js + Express/Fastify: エコシステムが豊富で学習コストが低い。
- Vite/React: 高速な開発体験。
- Jest/Vitest: TypeScript と相性が良く、導入が簡単。
- Docker: 開発・検証環境をコード化し、チーム間で統一。CI でも同じコンテナイメージを利用できる。

## 初期実装の提案ステップ
1. package.json の初期化（npm init -y）
2. TypeScript と開発ツールのインストール（devDependencies）
3. tsconfig.json、ESLint、Prettier の設定ファイルを追加
4. Dockerfile と docker-compose.yml（任意）を作成し、開発・テスト環境をコンテナ化
5. GitHub Actions のワークフロー雛形を追加
6. シンプルな README とサンプルソース（src/index.ts）を追加

## 次のアクション
- このドキュメントを確認していただき、希望があればフレームワークを選定してください（例: Express vs Fastify）。

---

作成者: 自動生成（TypeScript 希望に基づく提案）
