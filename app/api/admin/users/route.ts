import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { UserListItem, UsersResponse, ErrorResponse } from '@/types/user'

export async function GET() {
  try {
    // Supabaseからユーザー一覧を取得
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, company_name, project_name, project_code, role, created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json<ErrorResponse>(
        { error: 'ユーザー情報の取得に失敗しました' },
        { status: 500 }
      )
    }

    const users: UserListItem[] = data || []

    return NextResponse.json<UsersResponse>({ users })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json<ErrorResponse>(
      { error: 'ユーザー情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}
