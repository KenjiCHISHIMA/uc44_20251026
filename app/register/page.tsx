'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function RegisterForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    project_name: '',
    project_code: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  useEffect(() => {
    // トークンがない場合はエラー
    if (!token) {
      setTokenError(true)
    }
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // エラーをクリア
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = '氏名を入力してください'
    }
    if (!formData.company_name.trim()) {
      newErrors.company_name = '会社名を入力してください'
    }
    if (!formData.project_name.trim()) {
      newErrors.project_name = 'プロジェクト名を入力してください'
    }
    if (!formData.project_code.trim()) {
      newErrors.project_code = 'プロジェクトコードを入力してください'
    } else if (formData.project_code.length !== 8) {
      newErrors.project_code = 'プロジェクトコードは8桁で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === '招待リンクが無効または期限切れです') {
          setTokenError(true)
        } else {
          setErrors({ general: data.error || '登録に失敗しました' })
        }
        setLoading(false)
        return
      }

      // 成功
      setSuccess(true)
    } catch (err) {
      console.error('Registration error:', err)
      setErrors({ general: '登録に失敗しました' })
      setLoading(false)
    }
  }

  // トークンエラー画面
  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-slate-50 to-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-12 text-center">
            <div className="mx-auto flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">エラー</h2>
            <p className="text-slate-600">
              招待リンクが無効または期限切れです
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 成功画面
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center">
            <div className="mx-auto flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">登録完了</h2>
            <p className="text-slate-600 leading-relaxed">
              ユーザー登録が正常に完了しました。<br />
              管理者からの連絡をお待ちください。
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 登録フォーム
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* ロゴ・ヘッダー部分 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">ユーザー登録</h1>
          <p className="mt-2 text-sm text-slate-600">
            以下の情報を入力して登録を完了してください
          </p>
        </div>

        {/* フォームカード */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            {errors.general && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm font-medium text-red-800">{errors.general}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 氏名 */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-semibold text-slate-700 mb-2">
                  氏名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="山田太郎"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                  disabled={loading}
                />
                {errors.full_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.full_name}</p>
                )}
              </div>

              {/* 会社名 */}
              <div>
                <label htmlFor="company_name" className="block text-sm font-semibold text-slate-700 mb-2">
                  会社名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="株式会社サンプル"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                  disabled={loading}
                />
                {errors.company_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.company_name}</p>
                )}
              </div>

              {/* プロジェクト名 */}
              <div>
                <label htmlFor="project_name" className="block text-sm font-semibold text-slate-700 mb-2">
                  プロジェクト名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  placeholder="Webサイトリニューアル"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                  disabled={loading}
                />
                {errors.project_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.project_name}</p>
                )}
              </div>

              {/* プロジェクトコード */}
              <div>
                <label htmlFor="project_code" className="block text-sm font-semibold text-slate-700 mb-2">
                  プロジェクトコード <span className="text-red-500">*</span> (8桁)
                </label>
                <input
                  type="text"
                  id="project_code"
                  name="project_code"
                  value={formData.project_code}
                  onChange={handleChange}
                  placeholder="PROJ2024"
                  maxLength={8}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                  disabled={loading}
                />
                {errors.project_code && (
                  <p className="mt-2 text-sm text-red-600">{errors.project_code}</p>
                )}
              </div>

              {/* 登録ボタン */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition-all disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      登録中...
                    </>
                  ) : (
                    '登録する'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
