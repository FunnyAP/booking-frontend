// components/admin/AdminLayout.js
import Sidebar from './Sidebar'
import { useRouter } from 'next/router'

export default function AdminLayout({ children }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/auth/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar cố định bên trái */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Nội dung bên phải */}
      <div className="flex-1 flex flex-col">
        {/* Topbar logout */}
        <div className="flex justify-end items-center bg-white shadow p-4 border-b">
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 font-medium hover:underline"
          >
            Đăng xuất
          </button>
        </div>

        {/* Nội dung chính */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
