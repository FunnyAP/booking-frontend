import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import axios from 'axios'

export default function ShowtimeList() {
  const [showtimes, setShowtimes] = useState([])
  const [pagination, setPagination] = useState({})
  const [page, setPage] = useState(1)

  const fetchData = async (page = 1) => {
    const res = await axios.get(`http://localhost:8000/api/admin/showtimes?page=${page}`)
    setShowtimes(res.data.data)
    setPagination({
      current_page: res.data.current_page,
      last_page: res.data.last_page
    })
  }

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc muốn xoá suất chiếu này?')) {
      await axios.delete(`http://localhost:8000/api/admin/showtimes/${id}`)
      fetchData(page)
    }
  }

  useEffect(() => {
    fetchData(page)
  }, [page])

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= pagination.last_page; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 border rounded ${i === pagination.current_page ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      )
    }
    return <div className="flex space-x-2 mt-4">{pages}</div>
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách suất chiếu</h1>
        <Link
          href="/admin/showtimes/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Thêm suất chiếu
        </Link>
      </div>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Phim</th>
            <th className="p-2">Rạp</th>
            <th className="p-2">Ngày</th>
            <th className="p-2">Giờ</th>
            <th className="p-2">Giá vé</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {showtimes.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.id}</td>
              <td className="p-2">{item.movie_id}</td>
              <td className="p-2">{item.cinema_id}</td>
              <td className="p-2">{item.show_date}</td>
              <td className="p-2">{item.show_time}</td>
              <td className="p-2">{item.ticket_price?.toLocaleString()} đ</td>
              <td className="p-2 space-x-2">
                <Link
                  href={`/admin/showtimes/${item.id}`}
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

      {pagination.last_page > 1 && renderPagination()}
    </AdminLayout>
  )
}
