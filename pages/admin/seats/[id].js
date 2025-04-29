import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/admin/AdminLayout'
import axios from 'axios'

export default function EditSeat() {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState({
    cinema_id: '',
    row_number: '',
    column_number: '',
    seat_number: '',
    seat_type: ''
  })

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/admin/seats/${id}`)
        .then((res) => setForm(res.data))
    }
  }, [id])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:8000/api/admin/seats/update/${id}`, form)
      router.push('/admin/seats')
    } catch (error) {
        const errs = error.response?.data.errors
        let msg = 'Lỗi nhập liệu:\n'
        Object.keys(errs).forEach((k) => {
          msg += `• ${errs[k].join(', ')}\n`
        })
        alert(msg)
    }
      
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Sửa ghế</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input name="cinema_id" value={form.cinema_id} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="row_number" value={form.row_number} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="column_number" value={form.column_number} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="seat_number" value={form.seat_number} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="seat_type" value={form.seat_type} onChange={handleChange} className="w-full p-2 border rounded" required />
        <button className="bg-yellow-600 text-white px-4 py-2 rounded">Cập nhật ghế</button>
      </form>
    </AdminLayout>
  )
}
