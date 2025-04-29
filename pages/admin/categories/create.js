import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/admin/AdminLayout'

export default function CreateCategory() {
  const [form, setForm] = useState({
    name: '',
    description: '',
  })

  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/api/admin/genres', form)
      router.push('/admin/categories')
    } catch (err) {
      alert('Thêm thể loại thất bại!')
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-4">Thêm thể loại mới</h1>
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Thêm thể loại
        </button>
      </form>
    </AdminLayout>
  )
}
