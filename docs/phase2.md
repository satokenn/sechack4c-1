# Phase2（検知）実装タスク文書

## プロジェクト概要
セキュリティ・インシデント対応シミュレーター「謎の通信を遮断せよ」のフェーズ2（検知・アラート）の実装を進める。

## 目的
`requirements.md` に記載されたフェーズ2の仕様に従い、以下の機能を実装する：
- 監視ダッシュボード画面の表示
- 高優先度アラートの点滅表示
- アラートをクリックすると詳細ウィンドウが表示される
- 詳細ウィンドウには発生元 PC と通信先 IP を表示
- 隔離フェーズへの遷移を誘導

## 技術選定（確定済み）
- **フロントエンド**: React + TypeScript（ユーザ指定）
- **実装場所**: `src/app/scenes/phase2/`
- **テスト**: Vitest（既存の Phase3 に合わせる）
- **スタイル**: 既存の `src/styles.css` を拡張
- **開発環境**: Docker（`Dockerfile` を使用）
- **ブランチ**: `feature/phase2-detection`（git worktree を使用）

## 全体タスク一覧

### 1. 質問の確認 ✅ **完了**
**目的**: 実装前の必須確認事項をユーザに質問し、技術選定を確定する。

**実施内容**:
- フロントエンド技術スタック: React + TypeScript（確定）
- 実装場所: `src/app/scenes/phase2/`（確定）
- ブランチ名: `feature/phase2-detection`（確定）
- テスト方針: Vitest + manual browser check（確定）
- UI アセット: プレースホルダで実装（確定）

**完了日**: 2025年11月12日

---

### 2. git worktree でブランチ作成 ✅ **完了**
**目的**: main ブランチを汚さず、別作業ディレクトリで安全に開発できる環境を整備する。

**実施内容**:
1. WSL 上で stale な worktree エントリを prune（掃除）
2. 既存ブランチ `feature/phase2-detection` を使用
3. 新しい worktree を `../sechack4c-1-phase2-wt` に作成
4. worktree 内で `origin/main` と同期（`git reset --hard origin/main`）
5. 既存実装（Phase3）の構成を確認・参照

**作成された worktree**:
- パス: `/mnt/c/Users/satoken/programming/github/sechack4c-1-phase2-wt`
- ブランチ: `feature/phase2-detection`
- ステータス: クリーン（未変更）

**参考コマンド**:
```bash
# worktree 一覧確認
git worktree list

# worktree への移動（WSL）
cd /mnt/c/Users/satoken/programming/github/sechack4c-1-phase2-wt

# worktree への移動（PowerShell）
cd C:\Users\satoken\programming\github\sechack4c-1-phase2-wt
```

**確認した既存実装**:
- `src/app/scenes/phase3/Phase3.tsx`: React コンポーネントの実装パターン
- `src/app/scenes/phase3/logic.ts`: ビジネスロジックの分離パターン
- `tests/unit/phase3-logic.test.ts`: Vitest テストの記述パターン
- `src/main.tsx`: アプリケーションのエントリーポイント
- `src/styles.css`: 既存スタイル定義

**完了日**: 2025年11月12日

---

### 3. Phase2（検知）実装 ✅ **完了**
**目的**: フェーズ2の仕様に従い、ダッシュボードとアラートのインタラクションを実装する。

**実施内容**:
1. `src/app/scenes/phase2/` ディレクトリを作成
2. 以下のファイルを新規作成:
   - `Phase2.tsx`: メインコンポーネント（ダッシュボード、アラート、モーダル実装）
   - `logic.ts`: ビジネスロジック（アラートデータ、重要度判定関数）
   - `phase2.css`: Phase2 専用スタイル（点滅アニメーション、モーダルスタイル）
3. `src/main.tsx` を更新して Phase2 を表示

**要件（`requirements.md` より）**:
- **形式**: 初回インタラクション
- **UI**: 監視ダッシュボードが表示され、高優先度アラートが点滅
- **操作**: アラートをクリックして詳細表示
- **結果**: 詳細ウィンドウに発生元 PC と通信先 IP を表示し、隔離フェーズへ誘導

**実装方針**:
- Phase3 の実装パターン（状態管理、イベントハンドラ、条件分岐レンダリング）を参考にする
- `useState` でアラートのクリック状態を管理
- 詳細モーダルは条件付きレンダリングで実装
- CSS クラス（`.phase2`, `.dashboard`, `.alert`, `.modal` など）を `src/styles.css` に追加
- アラートの点滅は CSS アニメーション（`@keyframes`）で実装

**成果物**:
- `src/app/scenes/phase2/Phase2.tsx` ✅
- `src/app/scenes/phase2/logic.ts` ✅
- `src/app/scenes/phase2/phase2.css` ✅
- `src/main.tsx` 更新 ✅

**実装した機能**:
- ✅ 監視ダッシュボード表示（システム状態 + アラート一覧）
- ✅ 高優先度アラートの点滅表示（CSS `@keyframes` アニメーション）
- ✅ アラートクリックで詳細モーダル表示
- ✅ 詳細情報表示：発生元PC、通信先IP、時刻、重要度
- ✅ 次フェーズへの誘導メッセージ
- ✅ モーダルの開閉機能（クリック・キーボード対応）

**完了日**: 2025年11月13日

---

### 4. 簡易テストと型チェック ⏳ **進行中**
**目的**: 実装後に型安全性と基本動作を検証する。

**実施内容**:
1. `tests/unit/phase2-logic.test.ts` を作成 ✅
2. Docker イメージをビルド中（`Dockerfile` を使用） ⏳
3. Docker コンテナ内で型チェックとテスト実行予定 ⏳
4. 開発サーバ起動予定（Docker コンテナ内） ⏳

**テスト観点**:
- アラート情報の正確性（発生元 PC、通信先 IP など）
- 詳細表示判定ロジック（`isHighSeverity` 関数）
- アラートデータの形式検証

**実行コマンド（Docker 使用）**:
```bash
# Docker イメージビルド
docker build -t sechack4c-phase2-dev .

# 型チェック（コンテナ内）
docker run --rm sechack4c-phase2-dev npm run build

# ユニットテスト（コンテナ内）
docker run --rm sechack4c-phase2-dev npm test

# 開発サーバ起動（コンテナ内、ポートマッピング）
docker run --rm -it -v $(pwd):/app -p 5173:5173 sechack4c-phase2-dev npm run dev
```

**成果物**:
- `tests/unit/phase2-logic.test.ts` ✅
- テスト実行結果（Docker コンテナ内で実行予定）
- 型チェック結果（Docker コンテナ内で実行予定）

---

### 5. 作業報告と次ステップ ⏳ **進行中**
**目的**: 変更点の説明、実行方法、残タスクを文書化する。

**実施内容**:
1. 本文書（`docs/phase2.md`）の作成 ✅
2. README への Phase2 実装状況の追記（予定）
3. 次回作業時の引き継ぎ情報の整理（予定）

**文書化項目**:
- 完了したタスクと未完了タスクの一覧
- 実装方針と技術選定の理由
- 開発環境のセットアップ手順
- 既知の問題と制約事項

---

## 完了タスク一覧（サマリ）
- ✅ 質問の確認（技術選定確定）
- ✅ git worktree でブランチ作成（作業環境構築）
- ✅ 既存実装の調査（Phase3 参照）
- ✅ 本文書の作成
- ✅ Phase2 コンポーネントの実装（`Phase2.tsx`, `logic.ts`, `phase2.css`）
- ✅ ユニットテストの作成（`tests/unit/phase2-logic.test.ts`）
- ✅ `main.tsx` の更新（Phase2 表示対応）

## 未完了タスク一覧（サマリ）
- ⏳ Docker イメージビルド（進行中）
- ⏳ 型チェックとテスト実行（Docker コンテナ内）
- ⏳ 手動ブラウザ確認（Docker コンテナ内で開発サーバ起動）
- ⏳ git commit & push
- ⏳ README への作業報告追記（オプション）

## 次回作業時のチェックリスト
1. worktree に移動:
   ```bash
   cd /mnt/c/Users/satoken/programming/github/sechack4c-1-phase2-wt
   ```
2. ブランチ確認:
   ```bash
   git branch --show-current  # feature/phase2-detection であることを確認
   ```
3. Docker イメージビルド（初回のみ、または Dockerfile 変更時）:
   ```bash
   docker build -t sechack4c-phase2-dev .
   ```
4. 型チェック実行（Docker コンテナ内）:
   ```bash
   docker run --rm sechack4c-phase2-dev npm run build
   ```
5. ユニットテスト実行（Docker コンテナ内）:
   ```bash
   docker run --rm sechack4c-phase2-dev npm test
   ```
6. 開発サーバで動作確認（Docker コンテナ内、ブラウザで http://localhost:5173 を開く）:
   ```bash
   docker run --rm -it -v $(pwd):/app -p 5173:5173 sechack4c-phase2-dev npm run dev
   ```
7. 変更を確認:
   ```bash
   git status
   git diff
   ```
8. コミット & プッシュ:
   ```bash
   git add .
   git commit -m "feat: implement Phase2 detection dashboard and alert interaction"
   git push origin feature/phase2-detection
   ```

## 既知の問題と制約事項
- WSL 上でのコマンド実行が不安定な場合がある（タイムアウト、中断が発生）
- Phase2 と Phase3 の切り替え機構（ルーティング）は未実装。現在は `main.tsx` で両方を縦に並べて表示
- エントリーポイント（`src/main.tsx`）は Phase2 と Phase3 を同時に表示している（仕様上は Phase2 → Phase3 の順序で進む想定）
- 本来は Phase1（やらかし）から始まるシナリオだが、Phase2 から実装を開始している

## 参考資料
- `requirements.md`: シナリオ全体の要件定義
- `docs/directory.md`: ディレクトリ構成案
- `Technology_selection.md`: 技術選定の理由
- 既存実装: `src/app/scenes/phase3/`（Phase3 の実装パターン）

---

**最終更新**: 2025年11月13日  
**作成者**: GitHub Copilot（AI アシスタント）  
**ステータス**: Phase2 コード実装完了、Docker 環境でのテスト・型チェック実行中
