import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendInvitationEmail } from '@/lib/email'
import { InvitationRequest } from '@/types/invitation'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Invitation API called ===')
    const body: InvitationRequest = await request.json()
    const { email } = body
    console.log('Email received:', email)

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      console.log('Email validation failed')
      return NextResponse.json(
        { error: 'メールアドレスの形式が正しくありません' },
        { status: 400 }
      )
    }

    // profilesテーブルをチェック（既に登録済みかどうか）
    console.log('Checking existing user...')
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .is('deleted_at', null)
      .single()

    if (existingUser) {
      console.log('User already exists')
      return NextResponse.json(
        { error: '既に登録されています' },
        { status: 400 }
      )
    }
    console.log('User does not exist, proceeding...')

    // invitation_tokensテーブルをチェック（既存の未使用トークンがある場合は削除）
    const { data: existingTokens } = await supabaseAdmin
      .from('invitation_tokens')
      .select('id')
      .eq('email', email)
      .eq('used', false)

    if (existingTokens && existingTokens.length > 0) {
      // 既存の未使用トークンを削除
      await supabaseAdmin
        .from('invitation_tokens')
        .delete()
        .eq('email', email)
        .eq('used', false)
    }

    // 新しい招待トークンを生成
    const token = randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 3) // 3日後

    // invitation_tokensテーブルに保存
    const { error: insertError } = await supabaseAdmin
      .from('invitation_tokens')
      .insert({
        email,
        token,
        user_type: 'external',
        expires_at: expiresAt.toISOString(),
        used: false,
      })

    if (insertError) {
      console.error('Token insert error:', insertError)
      return NextResponse.json(
        { error: 'トークンの保存に失敗しました' },
        { status: 500 }
      )
    }

    // Amazon SES経由で招待メールを送信
    console.log('Attempting to send email...')
    try {
      await sendInvitationEmail(email, token, expiresAt)
      console.log('Email sent successfully')
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // メール送信失敗時は作成したトークンを削除
      await supabaseAdmin
        .from('invitation_tokens')
        .delete()
        .eq('token', token)

      return NextResponse.json(
        { error: '招待メールの送信に失敗しました' },
        { status: 500 }
      )
    }

    console.log('Invitation process completed successfully')
    return NextResponse.json(
      { message: '招待メールを送信しました' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Invitation error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
