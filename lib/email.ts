import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendInvitationEmail(email: string, token: string, expiresAt: Date) {
  console.log('sendInvitationEmail called with:', { email, token })
  console.log('Environment check:', {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS ? '***' : 'NOT SET',
    FROM_EMAIL: process.env.FROM_EMAIL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const invitationUrl = `${baseUrl}/register?token=${token}`

  // 有効期限を日本語形式でフォーマット
  const expiresAtFormatted = expiresAt.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\//g, '年').replace(',', '').replace(' ', ' ').replace(':', '時') + '分'

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: '[ユーザー管理システム] ユーザー登録のご案内',
    text: `ユーザー管理システムへの登録招待が届きました。

以下のURLから登録手続きを行ってください。
${invitationUrl}

※このリンクの有効期限は3日間です。
有効期限: ${expiresAtFormatted}

このメールに心当たりがない場合は、破棄してください。`,
  }

  console.log('Sending email with options:', {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject,
  })

  try {
    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result)
    return result
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
