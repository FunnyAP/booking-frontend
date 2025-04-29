// pages/admin/categories/index.js
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function GenreList() {
  const [genres, setGenres] = useState([])

  const fetchGenres = async () => {
    const res = await axios.get('http://localhost:8000/api/admin/genres')
    setGenres(res.data)
  }

  useEffect(() => {
    fetchGenres()
  }, [])

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc muốn xóa thể loại này?')) {
      await axios.delete(`http://localhost:8000/api/admin/genres/${id}`)
      fetchGenres()
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách thể loại</h1>
        <Link href="/admin/categories/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">+ Thêm thể loại</button>
        </Link>
      </div>
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên thể loại</th>
            <th className="border px-4 py-2">Mô tả</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre) => (
            <tr key={genre.id} className="text-center">
              <td className="border px-4 py-2">{genre.id}</td>
              <td className="border px-4 py-2">{genre.name}</td>
              <td className="border px-4 py-2">{genre.description}</td>
              <td className="border px-4 py-2 space-x-2">
                <Link href={`/admin/categories/${genre.id}`}>
                  <span className="text-blue-600 hover:underline cursor-pointer">Sửa</span>
                </Link>
                <button
                  onClick={() => handleDelete(genre.id)}
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
