import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'

export default function ProductList() {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/products')
      setProducts(res.data)
    } catch (error) {
      console.error('Lỗi fetch products:', error)
    }
  }

  const deleteProduct = async (id) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này không?')) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/products/${id}`)
        fetchProducts()
      } catch (error) {
        console.error('Lỗi xóa product:', error)
      }
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Danh sách sản phẩm</h1>
        <Link href="/admin/products/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">+ Thêm sản phẩm</button>
        </Link>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-left">ID</th>
            <th className="p-2 border text-left">Tên</th>
            <th className="p-2 border text-left">Giá</th>
            <th className="p-2 border text-left">Ảnh</th>
            <th className="p-2 border text-left">Trạng thái</th>
            <th className="p-2 border text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{Number(p.price).toLocaleString()} ₫</td>
              <td className="p-2 border">
                {p.image && (
                  <img
                    src={
                      p.image.startsWith('http')
                        ? p.image
                        : `http://localhost:8000/uploads/${p.image}` // ✅ sửa đúng URL
                    }
                    alt={p.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                )}
              </td>
              <td className="p-2 border">{p.status}</td>
              <td className="p-2 border text-center space-x-2">
                <Link href={`/admin/products/${p.id}`}>
                  <span className="text-blue-600 hover:underline cursor-pointer">Sửa</span>
                </Link>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="text-red-600 hover:underline"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                Không có sản phẩm nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminLayout>
  )
}
