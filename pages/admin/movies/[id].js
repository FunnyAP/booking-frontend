import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/admin/AdminLayout'

export default function EditMovie() {
  const router = useRouter()
  const { id } = router.query

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    release_date: '',
    duration: '',
    rating: '',
    status: 'coming_soon',
    genres: [],
    poster: null,
    trailer: null,
  })

  const [genreOptions, setGenreOptions] = useState([])

  useEffect(() => {
    if (id) {
      fetchMovie()
      fetchGenres()
    }
  }, [id])

  const fetchMovie = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/movies/${id}`)
      const movie = res.data
      setForm({
        title: movie.title,
        slug: movie.slug,
        description: movie.description,
        release_date: movie.release_date,
        duration: movie.duration,
        rating: movie.rating,
        status: movie.status,
        genres: movie.genres.map(g => g.id),
        poster: movie.poster,     // ✅ Gán ảnh cũ
        trailer: movie.trailer,   // ✅ Gán trailer cũ
      })
    } catch (err) {
      alert('Không tìm thấy phim!')
    }
  }

  const fetchGenres = async () => {
    const res = await axios.get('http://localhost:8000/api/admin/genres')
    setGenreOptions(res.data)
  }

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
        value.forEach(genre => formData.append('genres[]', genre))
      } else if (value !== null) {
        formData.append(key, value)
      }
    })

    try {
      await axios.post(`http://localhost:8000/api/admin/movies/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      router.push('/admin/movies')
    } catch (err) {
      alert('Cập nhật phim thất bại!')
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-4">Sửa phim</h1>
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
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2">Cập nhật phim</button>
      </form>
    </AdminLayout>
  )
}
