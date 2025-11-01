'use client'

import { useEffect, useState } from 'react'
import type { UserListItem, UsersResponse, ErrorResponse } from '@/types/user'
import InvitationModal from '@/components/InvitationModal'

export default function UsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/admin/users')
        const data = await response.json()

        if (!response.ok) {
          const errorData = data as ErrorResponse
          throw new Error(errorData.error || 'ユーザー情報の取得に失敗しました')
        }

        const usersData = data as UsersResponse
        setUsers(usersData.users)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ユーザー情報の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const handleInvitationSuccess = () => {
    setSuccessMessage('招待メールを送信しました')
    // 3秒後に成功メッセージを消す
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ユーザー一覧</h1>
              <p className="mt-2 text-sm text-gray-600">登録済みの外部ユーザーを管理します</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              ユーザーを招待する
            </button>
          </div>
        </div>

        {/* 成功メッセージ */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {/* ローディング状態 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">読み込み中...</span>
            </div>
          </div>
        )}

        {/* エラー状態 */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* ユーザーが0件の場合 */}
        {!loading && !error && users.length === 0 && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-500">登録ユーザーがいません</p>
          </div>
        )}

        {/* ユーザー一覧テーブル */}
        {!loading && !error && users.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      メールアドレス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      氏名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      会社名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      プロジェクト名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      プロジェクトコード
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      権限
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      登録日
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.company_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.project_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.project_code || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ユーザー数表示 */}
        {!loading && !error && users.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            全 {users.length} 件のユーザー
          </div>
        )}
      </div>

      {/* 招待モーダル */}
      <InvitationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleInvitationSuccess}
      />
    </div>
  )
}
