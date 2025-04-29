import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import AdminLayout from '@/components/admin/AdminLayout'

export default function EditCategory() {
  const [form, setForm] = useState({
    name: '',
    description: '',
  })
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetchCategory()
    }
  }, [id])

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/genres`)
      const genre = res.data.find(g => g.id.toString() === id)
      if (!genre) {
        alert('Không tìm thấy thể loại!')
        router.push('/admin/categories')
      } else {
        setForm({
          name: genre.name,
          description: genre.description,
        })
      }
    } catch (err) {
      alert('Lỗi khi lấy dữ liệu thể loại!')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:8000/api/admin/genres/${id}`, form)
      router.push('/admin/categories')
    } catch (err) {
      alert('Cập nhật thất bại!')
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-4">Sửa thể loại</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block font-medium mb-1">Tên thể loại</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            rows="4"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Cập nhật
        </button>
      </form>
    </AdminLayout>
  )
}
