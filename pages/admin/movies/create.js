// pages/admin/movies/create.js
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/admin/AdminLayout'

export default function CreateMovie() {
  const [form, setForm] = useState({
    title: '', slug: '', description: '', release_date: '', duration: '',
    rating: '', status: 'coming_soon', genres: [], poster: null, trailer: null
  })
  const [genreOptions, setGenreOptions] = useState([])
  const router = useRouter()

  useEffect(() => {
    axios.get('http://localhost:8000/api/admin/genres')
      .then(res => setGenreOptions(res.data))
  }, [])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] })
    } else if (name === 'genres') {
      const selected = [...e.target.selectedOptions].map(option => option.value)
      setForm({ ...form, genres: selected })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'genres') {
        value.forEach(g => formData.append('genres[]', g))
      } else {
        formData.append(key, value)
      }
    })
    try {
      await axios.post('http://localhost:8000/api/admin/movies', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      router.push('/admin/movies')
    } catch (err) {
      alert('Thêm phim thất bại')
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-4">Thêm phim mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" onChange={handleChange} value={form.title} placeholder="Tên phim" className="w-full border p-2" />
        <input name="slug" onChange={handleChange} value={form.slug} placeholder="Slug" className="w-full border p-2" />
        <textarea name="description" onChange={handleChange} value={form.description} placeholder="Mô tả" className="w-full border p-2" />
        <input type="file" name="poster" onChange={handleChange} className="w-full border p-2" accept="image/*" />
        <input type="file" name="trailer" onChange={handleChange} className="w-full border p-2" accept="video/*" />
        <input name="duration" onChange={handleChange} value={form.duration} placeholder="Thời lượng (phút)" className="w-full border p-2" />
        <input type="date" name="release_date" onChange={handleChange} value={form.release_date} className="w-full border p-2" />
        <input name="rating" onChange={handleChange} value={form.rating} placeholder="Rating IMDb" className="w-full border p-2" />
        <select name="status" onChange={handleChange} value={form.status} className="w-full border p-2">
          <option value="now_showing">Đang chiếu</option>
          <option value="coming_soon">Sắp chiếu</option>
        </select>
        <select multiple name="genres" value={form.genres} onChange={handleChange} className="w-full border p-2 h-32">
          {genreOptions.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2">Thêm phim</button>
      </form>
    </AdminLayout>
  )
}
