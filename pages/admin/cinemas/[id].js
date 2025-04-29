import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/admin/AdminLayout'
import axios from 'axios'

export default function EditCinema() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: ''
  })
  const router = useRouter()
  const { id } = router.query

  const fetchCinema = async () => {
    const res = await axios.get(`http://localhost:8000/api/admin/cinemas/${id}/`)

    setForm(res.data)
  }

  useEffect(() => {
    if (id) fetchCinema()
  }, [id])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.put(`http://localhost:8000/api/admin/cinemas/${id}`, form)

    router.push('/admin/cinemas')
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Sửa rạp phim</h1>
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
        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Cập nhật rạp
        </button>
      </form>
    </AdminLayout>
  )
}
