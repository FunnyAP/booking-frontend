import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';

export default function EditProduct() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    status: 'available',
    image: null,
  });

  const [existingImage, setExistingImage] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/products/${id}`);
      const data = res.data;
      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        status: data.status,
        image: null,
      });
      setExistingImage(data.image); // chỉ tên file ảnh
    } catch (err) {
      console.error(err);
      alert('Không tìm thấy sản phẩm!');
    }
  };

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
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value);
      }
    });

    try {
      setLoading(true);
      await axios.post(`http://localhost:8000/api/admin/products/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Cập nhật sản phẩm thành công!');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Cập nhật sản phẩm thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-4">Sửa sản phẩm</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tên sản phẩm"
          className="w-full border p-2"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Mô tả"
          className="w-full border p-2"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Giá"
          className="w-full border p-2"
          required
        />

        {/* Ảnh: hiện preview nếu chọn mới, nếu không thì hiện ảnh cũ */}
        {preview ? (
          <img src={preview} alt="Ảnh mới chọn" className="h-24 rounded" />
        ) : existingImage && (
          <img
            src={`http://localhost:8000/uploads/${existingImage}`} // ✅ Sửa đúng đường dẫn
            alt="Ảnh sản phẩm"
            className="h-24 rounded"
          />
        )}

        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full border p-2"
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2"
          required
        >
          <option value="available">available</option>
          <option value="unavailable">unavailable</option>
        </select>

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
        </button>
      </form>
    </AdminLayout>
  );
}
