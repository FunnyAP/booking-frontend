import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios'; // 👉 import từ 'axios' trực tiếp
import Link from 'next/link';

export default function BookingList() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/bookings'); // ✅ Gọi full URL
      setBookings(res.data);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xoá đơn hàng này?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/bookings/${id}`); // ✅ Gọi full URL xoá
      fetchBookings();
    } catch (error) {
      console.error('Lỗi xoá đơn hàng:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-4">Quản lý Đơn hàng</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-700">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Khách hàng</th>
              <th className="p-3 border">Phim</th>
              <th className="p-3 border">Rạp</th>
              <th className="p-3 border">Suất chiếu</th>
              <th className="p-3 border">Tổng tiền</th>
              <th className="p-3 border">Trạng thái</th>
              <th className="p-3 border text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 text-sm text-gray-800">
                <td className="p-3 border">{booking.id}</td>
                <td className="p-3 border">{booking.user?.name || 'Khách'}</td>
                <td className="p-3 border">{booking.showtime?.movie?.title || '-'}</td>
                <td className="p-3 border">{booking.showtime?.cinema?.name || '-'}</td>
                <td className="p-3 border">
                  {booking.showtime?.show_date} {booking.showtime?.show_time}
                </td>
                <td className="p-3 border">{booking.total_price.toLocaleString()} đ</td>
                <td className="p-3 border capitalize">{booking.status}</td>
                <td className="p-3 border text-center space-x-2">
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <button className="text-blue-600 hover:underline">Sửa</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="text-red-600 hover:underline"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
