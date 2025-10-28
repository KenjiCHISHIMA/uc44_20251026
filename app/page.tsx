import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ユーザー管理システム
          </h1>
          <p className="text-lg text-gray-600">
            外部ユーザーを効率的に管理するシステム
          </p>
        </div>

        {/* カード */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                システム機能
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  <span>登録済みユーザーの一覧表示</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  <span>ユーザー情報の詳細確認</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                  <span>会社・プロジェクト情報の管理</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Link
                href="/admin/users"
                className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                ユーザー一覧を表示
              </Link>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Supabase × Next.js で構築されたシステム</p>
        </div>
      </div>
    </div>
  )
}
