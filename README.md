# ユーザー管理システム

Supabaseをバックエンドとして使用するNext.js製のユーザー管理システムです。

## 機能

- ユーザー一覧表示
- Supabaseデータベースとの連携
- レスポンシブデザイン
- TypeScript完全対応

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase**

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルは既に作成済みです。

### 3. 開発サーバーの起動

```bash
npm run dev
```

サーバーが起動したら、以下のURLでアクセスできます：

**重要: このプロジェクトは常にポート3001を使用します（ポート3000は別用途で使用中）**

**WSL環境の場合：**
- http://localhost:3001
- http://192.168.102.240:3001 （WSLのIPアドレス）

**通常の環境：**
- http://localhost:3001

## 主要ページ

- **ホームページ**: http://localhost:3001
- **ユーザー一覧**: http://localhost:3001/admin/users
- **ユーザー一覧API**: http://localhost:3001/api/admin/users

## コマンド

```bash
# 開発サーバー起動（ホットリロード）
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# Lint実行
npm run lint
```

## プロジェクト構成

```
app/
├── api/admin/users/route.ts    # ユーザー一覧取得API
├── admin/users/page.tsx        # ユーザー一覧ページ
├── layout.tsx                  # ルートレイアウト
├── page.tsx                    # ホームページ
└── globals.css                 # グローバルスタイル

lib/
└── supabase.ts                 # Supabaseクライアント設定

types/
└── user.ts                     # ユーザー関連の型定義
```

## 動作確認

### APIの動作確認（コマンドライン）

```bash
# ユーザー一覧API
curl http://localhost:3001/api/admin/users
```

### ブラウザでの確認

1. http://localhost:3001 にアクセス
2. 「ユーザー一覧を表示」ボタンをクリック
3. 登録済みユーザーの一覧が表示されます

## トラブルシューティング

### WSL環境でブラウザが開かない場合

1. **localhost でアクセス**: http://localhost:3001
2. **WSLのIPアドレスでアクセス**:
   ```bash
   # WSLのIPアドレスを確認
   hostname -I
   # 表示されたIPアドレスでアクセス（例: http://192.168.102.240:3001）
   ```

### ポートについて

**重要**: このプロジェクトは常にポート3001を使用します。
ポート3000は別のプロジェクトで使用されているため、変更しないでください。

すべての開発・本番環境でポート3001が使用されます（package.jsonで設定済み）。

## 開発の詳細

詳細なアーキテクチャと開発ガイドは [CLAUDE.md](./CLAUDE.md) を参照してください。

## 作成日

2025年10月26日
