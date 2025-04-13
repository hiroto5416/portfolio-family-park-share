# Family Park Share

家族向けの公園情報共有アプリケーション

## 📝 概要

子育て世代の家族が公園情報を共有し、子供と一緒に遊ぶ場所を見つけやすくするためのWebアプリケーションです。

### 🌟 本番環境

- URL: https://portfolio-family-park-share-three.vercel.app/

### 🔑 デモアカウント

- メールアドレス: DemoUser123@example.com
- パスワード: DemoUser123@example.com

### 🌟 主な機能

- 公園の検索・閲覧機能
- 位置情報を使用した近くの公園検索
- 公園の口コミ投稿・閲覧機能
- 写真のアップロード機能
- いいね機能
- ユーザー認証

## 🔧 使用技術

- フロントエンド

  - Next.js (最新の安定バージョン)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui

- バックエンド

  - Prisma
  - Supabase

- 外部API
  - Google Maps API
    - Maps JavaScript API
    - Geocoding API
    - Places API

## 💫 こだわりポイント

- TypeScriptを使用した型安全な開発
- モダンなUIコンポーネントの実装
- レスポンシブデザインの採用
- セキュアな認証システムの実装

## 🚀 ローカルでの開発環境構築

1. リポジトリのクローン

```bash
git clone https://github.com/hiroto5416/portfolio-family-park-share.git
```

2. プロジェクトディレクトリに移動

```bash
cd portfolio-family-park-share
```

3. 依存関係のインストール

```bash
npm install
```

4. 環境変数の設定

```bash
cp .env.example .env.local
```

以下の環境変数を`.env.local`に設定してください：

- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- DATABASE_URL

5. データベースのマイグレーション

```bash
npx prisma migrate dev
```

6. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは http://localhost:3000 で起動します。

## 📋 必要要件

- Node.js 18.0.0以上
- npm 9.0.0以上
- Google Maps Platform APIキー
- Supabaseアカウント

## 🛠 環境変数の詳細

| 変数名                          | 説明                         | 取得方法                                                          |
| ------------------------------- | ---------------------------- | ----------------------------------------------------------------- |
| NEXT_PUBLIC_GOOGLE_MAPS_API_KEY | Google Maps Platform APIキー | [Google Cloud Console](https://console.cloud.google.com/)から取得 |
| NEXT_PUBLIC_SUPABASE_URL        | SupabaseプロジェクトのURL    | Supabaseプロジェクト設定から取得                                  |
| NEXT_PUBLIC_SUPABASE_ANON_KEY   | Supabase匿名キー             | Supabaseプロジェクト設定から取得                                  |
| DATABASE_URL                    | PostgreSQLデータベースのURL  | Supabaseプロジェクト設定から取得                                  |

## 🔒 Google Maps APIの設定

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. 以下のAPIを有効化：
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. APIキーを作成し、適切な制限を設定

## 👥 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 お問い合わせ

バグの報告や機能の提案は、GitHubのIssueを通じてお願いします。

## 🙏 謝辞

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Google Maps Platform](https://developers.google.com/maps)
- [shadcn/ui](https://ui.shadcn.com/)
