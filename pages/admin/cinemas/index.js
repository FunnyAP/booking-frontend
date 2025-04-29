import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import axios from 'axios'

export default function CinemaList() {
  const [cinemas, setCinemas] = useState([])

  const fetchData = async () => {
    const res = await axios.get('http://localhost:8000/api/admin/cinemas')
    setCinemas(res.data)
  }

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc muốn xoá rạp này?')) {
        await axios.delete(`http://localhost:8000/api/admin/cinemas/${id}`)
      fetchData()
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách rạp phim</h1>
        <Link
          href="/admin/cinemas/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Thêm rạp
        </Link>
      </div>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Tên rạp</th>
            <th className="p-2">Địa chỉ</th>
            <th className="p-2">SĐT</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cinemas.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.id}</td>
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.address}</td>
              <td className="p-2">{item.phone}</td>
              <td className="p-2 space-x-2">
                <Link
                  href={`/admin/cinemas/${item.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  )
}
