import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    status: 'available',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setForm({ ...form, [name]: file });
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('status', form.status);

    if (form.image) {
      formData.append('image', form.image); // chỉ gửi file
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:8000/api/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Thêm sản phẩm thành công!');
      router.push('/admin/products');
    } catch (err) {
      console.error('Error:', err);
      alert('Thêm sản phẩm thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          name="name"
          placeholder="Tên sản phẩm"
          className="w-full border p-2"
          onChange={handleChange}
          value={form.name}
          required
        />
        <textarea
          name="description"
          placeholder="Mô tả"
          className="w-full border p-2"
          onChange={handleChange}
          value={form.description}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Giá"
          className="w-full border p-2"
          onChange={handleChange}
          value={form.price}
          required
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />
        {preview && (
          <div className="mt-2">
            <img src={preview} alt="Preview" className="w-40 h-auto rounded" />
          </div>
        )}
        <select
          name="status"
          className="w-full border p-2"
          onChange={handleChange}
          value={form.status}
          required
        >
          <option value="available">available</option>
          <option value="unavailable">unavailable</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Đang lưu...' : 'Thêm sản phẩm'}
        </button>
      </form>
    </AdminLayout>
  );
}
