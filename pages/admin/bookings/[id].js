import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios'; // 👉 gọi trực tiếp axios gốc

export default function EditBooking() {
  const router = useRouter();
  const { id } = router.query;

  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState('');

  const fetchBooking = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/bookings/${id}`);
      setBooking(res.data);
      setStatus(res.data.status);
    } catch (error) {
      console.error('Lỗi tải đơn:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8000/api/admin/bookings/${id}`, { status });
      alert('Cập nhật đơn hàng thành công!');
      router.push('/admin/bookings'); // 👉 quay về danh sách
    } catch (error) {
      console.error('Lỗi cập nhật đơn:', error);
      alert('Cập nhật đơn hàng thất bại!');
    }
  };

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  if (!booking) {
    return (
      <AdminLayout>
        <p>Đang tải dữ liệu...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-4">Chi tiết Đơn hàng #{booking.id}</h1>

      <div className="space-y-4">
        <div>
          <strong>Khách hàng:</strong> {booking.user?.name || 'Khách'}
        </div>
        <div>
          <strong>Phim:</strong> {booking.showtime?.movie?.title || '-'}
        </div>
        <div>
          <strong>Rạp:</strong> {booking.showtime?.cinema?.name || '-'}
        </div>
        <div>
          <strong>Suất chiếu:</strong> {booking.showtime?.show_date} {booking.showtime?.show_time}
        </div>
        <div>
          <strong>Tổng tiền:</strong> {booking.total_price.toLocaleString()} đ
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 max-w-xs">
          <div>
            <label className="block mb-2 font-semibold">Trạng thái đơn</label>
            <select
              className="w-full border rounded p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="canceled">Đã huỷ</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Cập nhật
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
