import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/admin/AdminLayout'
import axios from 'axios'

export default function CreateSeat() {
  const router = useRouter()
  const [form, setForm] = useState({
    cinema_id: '',
    row_number: '',
    column_number: '',
    seat_number: '',
    seat_type: ''
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/api/admin/seats/store', form)
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
      <h1 className="text-2xl font-bold mb-4">Thêm ghế mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input name="cinema_id" placeholder="ID Rạp" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="row_number" placeholder="Hàng ghế (A, B...)" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="column_number" type="number" placeholder="Cột (số)" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="seat_number" placeholder="Số ghế (A1...)" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="seat_type" placeholder="Loại ghế (standard/vip)" onChange={handleChange} required className="w-full p-2 border rounded" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Thêm ghế</button>
      </form>
    </AdminLayout>
  )
}
