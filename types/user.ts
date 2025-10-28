// ユーザープロファイルの型定義
export interface UserProfile {
  id: string
  email: string
  full_name: string
  user_type: string
  role: string
  company_name: string | null
  project_name: string | null
  project_code: string | null
  department: string | null
  employee_number: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// ユーザー一覧表示用の型定義（必要な項目のみ）
export interface UserListItem {
  id: string
  email: string
  full_name: string
  company_name: string | null
  project_name: string | null
  project_code: string | null
  role: string
  created_at: string
}

// API レスポンスの型定義
export interface UsersResponse {
  users: UserListItem[]
}

export interface ErrorResponse {
  error: string
}
