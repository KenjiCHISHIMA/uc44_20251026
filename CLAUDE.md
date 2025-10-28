# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Supabaseをバックエンドとして使用するNext.js製のユーザー管理システム。外部ユーザーの情報を一覧表示し、管理する最小限の機能を提供します。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **クライアント**: @supabase/supabase-js

## 開発コマンド

**重要: このプロジェクトは常にポート3001を使用します**
ポート3000は別のプロジェクトで使用されているため、変更しないでください。

```bash
# 開発サーバーの起動（http://localhost:3001）
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバーの起動（http://localhost:3001）
npm start

# Lint実行
npm run lint

# 依存関係のインストール
npm install
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

## アーキテクチャ

### データフロー

1. **クライアント** (`app/admin/users/page.tsx`)
   - `use client` ディレクティブを使用したクライアントコンポーネント
   - `/api/admin/users` エンドポイントにfetchリクエスト
   - レスポンスをstateで管理し、UIに表示

2. **API Route** (`app/api/admin/users/route.ts`)
   - サーバーサイドで実行されるAPI
   - `supabaseAdmin` クライアントを使用（SERVICE_ROLE_KEY）
   - Supabaseの `profiles` テーブルからデータ取得
   - `deleted_at IS NULL` でフィルタリング
   - `created_at DESC` でソート

3. **Supabase**
   - PostgreSQLデータベース
   - `profiles` テーブルにユーザー情報を格納

### Supabaseクライアントの使い分け

`lib/supabase.ts` で2種類のクライアントを定義:

- **`supabase`**: ANON_KEYを使用（クライアントサイド用、現在未使用）
- **`supabaseAdmin`**: SERVICE_ROLE_KEYを使用（API Routes専用）
  - RLS（Row Level Security）をバイパス可能
  - セッション管理なし（`autoRefreshToken: false`, `persistSession: false`）

### データベーススキーマ

**profiles テーブル**:
- `id`: UUID (Primary Key)
- `email`: TEXT (UNIQUE, NOT NULL)
- `full_name`: TEXT (NOT NULL)
- `user_type`: TEXT (NOT NULL)
- `role`: TEXT (NOT NULL, DEFAULT 'user')
- `company_name`: TEXT (NULL)
- `project_name`: TEXT (NULL)
- `project_code`: TEXT (NULL, 8桁)
- `department`: TEXT (NULL)
- `employee_number`: TEXT (NULL)
- `created_at`: TIMESTAMP (DEFAULT NOW())
- `updated_at`: TIMESTAMP (DEFAULT NOW())
- `deleted_at`: TIMESTAMP (NULL) - 論理削除フラグ

### 型安全性

- `types/user.ts` で全ての型を定義
- API Responseとクライアントのstateで同じ型を使用
- `any` 型は使用しない

### エラーハンドリング

- API Route: try-catch でエラーをキャッチし、500ステータスで返す
- クライアント: エラー時は赤色のメッセージを表示

### UI/UX

- **レスポンシブデザイン**: Tailwind CSSで実装
- **ローディング状態**: スピナー + "読み込み中..." テキスト
- **エラー状態**: 赤背景のエラーメッセージ
- **空状態**: "登録ユーザーがいません" メッセージ
- **テーブル**: ストライプ（縞模様）で見やすく
- **日付表示**: YYYY/MM/DD形式（日本語ロケール）

## 環境変数

`.env.local` ファイルに以下を設定（Gitで管理しない）:

```
NEXT_PUBLIC_SUPABASE_URL=https://qassepoatkikvmponqea.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

**注意**: SERVICE_ROLE_KEYはサーバーサイド（API Routes）でのみ使用し、クライアントに公開しない。

## 開発時の注意点

1. **ポート番号**: 常にポート3001を使用（ポート3000は別プロジェクトで使用中）
2. **App Router使用**: Pages Routerではなく、App Router (`app/` ディレクトリ) を使用
3. **クライアントコンポーネント**: `use client` ディレクティブが必要なコンポーネントを明示
4. **API Routeのパス**: `app/api/*/route.ts` 形式
5. **Supabaseクライアント**: API Routeでは必ず `supabaseAdmin` を使用
6. **日本語UI**: 全てのUIテキストとメッセージは日本語で表示

## 今後の拡張

現在は最小限の機能のみ実装。以下の機能を追加可能:

- ユーザーの新規登録機能
- ユーザー情報の編集機能
- ユーザーの削除（論理削除）機能
- 検索・フィルタリング機能
- ページネーション
- CSV/Excelエクスポート
- 権限管理（管理者認証）
