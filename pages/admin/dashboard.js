// pages/admin/dashboard.js
import AdminLayout from '@/components/admin/AdminLayout'
import useAdminAuth from '@/lib/adminAuth'

export default function Dashboard() {
  useAdminAuth()

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Tổng quan</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Doanh thu hôm nay</p>
          <h2 className="text-xl font-bold text-blue-700">760,000</h2>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Khách hàng mới</p>
          <h2 className="text-xl font-bold text-green-700">0</h2>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Tổng vé bán ra</p>
          <h2 className="text-xl font-bold text-yellow-700">9</h2>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Tổng doanh thu</p>
          <h2 className="text-xl font-bold text-red-700">1,826,000</h2>
        </div>
      </div>
    </AdminLayout>
  )
}
