import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/admin/AdminLayout'
import axios from 'axios'

export default function CreateCinema() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: ''
  })
  const router = useRouter()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:8000/api/admin/cinemas/store', form)
    router.push('/admin/cinemas')
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Thêm rạp phim mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Tên rạp</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Thêm rạp
        </button>
      </form>
    </AdminLayout>
  )
}
