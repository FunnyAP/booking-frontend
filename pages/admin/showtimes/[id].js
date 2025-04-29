import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/admin/AdminLayout'
import axios from 'axios'

export default function EditShowtime() {
  const [form, setForm] = useState({
    movie_id: '',
    cinema_id: '',
    show_date: '',
    show_time: '',
    ticket_price: ''
  })

  const router = useRouter()
  const { id } = router.query

  const fetchData = async () => {
    const res = await axios.get(`http://localhost:8000/api/admin/showtimes/${id}`)
    setForm(res.data)
  }

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:8000/api/admin/showtimes/${id}`, form)
      router.push('/admin/showtimes')
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors
        let msg = 'Vui lòng kiểm tra các trường:\n'
        Object.keys(errors).forEach((key) => {
          msg += `• ${key}: ${errors[key].join(', ')}\n`
        })
        alert(msg)
      } else {
        alert('Đã xảy ra lỗi không xác định.')
      }
    }
  }
  

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Sửa suất chiếu</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label>Phim ID</label>
          <input type="number" name="movie_id" value={form.movie_id} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label>Rạp ID</label>
          <input type="number" name="cinema_id" value={form.cinema_id} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label>Ngày chiếu</label>
          <input type="date" name="show_date" value={form.show_date} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label>Giờ chiếu</label>
          <input type="time" name="show_time" value={form.show_time} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label>Giá vé</label>
          <input type="number" name="ticket_price" value={form.ticket_price} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">Cập nhật suất chiếu</button>
      </form>
    </AdminLayout>
  )
}
