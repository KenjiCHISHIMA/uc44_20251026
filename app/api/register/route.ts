import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { RegistrationRequest } from '@/types/invitation'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body: RegistrationRequest = await request.json()
    const { token, full_name, company_name, project_name, project_code } = body

    // 入力値のバリデーション
    if (!token || !full_name || !company_name || !project_name || !project_code) {
      return NextResponse.json(
        { error: '全ての項目を入力してください' },
        { status: 400 }
      )
    }

    // project_codeの8桁チェック
    if (project_code.length !== 8) {
      return NextResponse.json(
        { error: 'プロジェクトコードは8桁で入力してください' },
        { status: 400 }
      )
    }

    // トークンの検証
    const { data: invitationToken, error: tokenError } = await supabaseAdmin
      .from('invitation_tokens')
      .select('*')
      .eq('token', token)
      .single()

    if (tokenError || !invitationToken) {
      return NextResponse.json(
        { error: '招待リンクが無効または期限切れです' },
        { status: 400 }
      )
    }

    // used = false チェック
    if (invitationToken.used) {
      return NextResponse.json(
        { error: '招待リンクが無効または期限切れです' },
        { status: 400 }
      )
    }

    // expires_at > 現在時刻 チェック
    const expiresAt = new Date(invitationToken.expires_at)
    const now = new Date()
    if (expiresAt <= now) {
      return NextResponse.json(
        { error: '招待リンクが無効または期限切れです' },
        { status: 400 }
      )
    }

    // profilesテーブルに登録
    const userId = randomUUID()
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email: invitationToken.email,
        full_name,
        user_type: 'external',
        role: 'user',
        company_name,
        project_name,
        project_code,
        department: null,
        employee_number: null,
      })

    if (insertError) {
      console.error('Profile insert error:', insertError)
      return NextResponse.json(
        { error: 'ユーザー登録に失敗しました' },
        { status: 500 }
      )
    }

    // invitation_tokensテーブルを更新（used = true に変更）
    const { error: updateError } = await supabaseAdmin
      .from('invitation_tokens')
      .update({ used: true })
      .eq('token', token)

    if (updateError) {
      console.error('Token update error:', updateError)
      // トークンの更新に失敗した場合でも、ユーザーは登録済みなので成功として扱う
    }

    return NextResponse.json(
      { message: '登録が完了しました' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
