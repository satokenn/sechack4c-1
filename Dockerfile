# Node.js 18 LTS をベースにした開発・ビルド用コンテナ
FROM node:18-alpine AS base

# 依存関係と成果物を格納する作業ディレクトリ
WORKDIR /app

# package.json と lock ファイルを先にコピーして依存関係だけをキャッシュ
# ※ npm を想定。pnpm / yarn を使用する場合は適宜置き換える。
COPY package*.json ./

# 依存関係のインストール。--legacy-peer-deps は互換性のための保険。
RUN npm install --legacy-peer-deps

# 残りのソースをまとめてコピー
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src ./src
COPY tests ./tests

# デフォルトは開発用の実行コマンド
# ボリュームマウント時にも node_modules を確保するため、起動時にインストールを実行
CMD ["sh", "-c", "npm install --legacy-peer-deps && npm run dev -- --host"]
