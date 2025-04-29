import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ComboModal({
  open,
  onClose,
  selectedSeats,
  showtime,
  movie,
  cinema,
  totalTicketPrice,
}) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  const getImageUrl = (path) =>
    `http://localhost:8000/uploads/${path.split('/').pop()}`;

  useEffect(() => {
    if (open) {
      axios
        .get('http://localhost:8000/api/extras')
        .then((res) => {
          const combos = res.data.combos || res.data || [];
          setProducts(combos);
          const initial = {};
          combos.forEach((combo) => (initial[combo.id] = 0));
          setQuantities(initial);
        })
        .catch((err) => console.error('Lỗi lấy combo:', err));
    }
  }, [open]);

  const updateQuantity = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const extrasTotal = products.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 0),
    0
  );

  const total = totalTicketPrice + extrasTotal;

  const handleConfirm = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('⚠️ Bạn cần đăng nhập để đặt vé!');
      window.location.href = '/login';
      return;
    }

    try {
      const extras = products
        .filter((item) => quantities[item.id] > 0)
        .map((item) => ({
          product_id: item.id,
          quantity: quantities[item.id],
          price: item.price,
        }));

      const seats = selectedSeats.map((id) => ({
        seat_id: id,
        price: showtime.ticket_price,
      }));

      const payload = {
        showtime_id: showtime.id,
        seats,
        total_price: total,
      };

      if (extras.length > 0) {
        payload.extras = extras;
      }

      console.log('📦 Payload gửi đi:', payload);

      await axios.post('http://localhost:8000/api/bookings', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      alert('🎉 Đặt vé thành công!');
      window.location.href = '/profile';
    } catch (err) {
      console.error('❌ Axios error:', err);
      if (err.response?.data?.error) {
        alert(`❌ Lỗi: ${err.response.data.error}`);
      } else {
        alert('❌ Đặt vé thất bại!');
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full">
        <div className="bg-pink-500 text-white px-6 py-4 rounded-t-lg relative">
          <h2 className="text-lg font-bold text-center">Combo - Bắp nước</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {products.length === 0 ? (
            <p className="text-center">Không có combo nào khả dụng.</p>
          ) : (
            <div className="space-y-4">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-pink-600 font-bold">
                      {item.price.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={quantities[item.id] === 0}
                      className="px-2 py-1 border rounded disabled:opacity-30"
                    >
                      -
                    </button>
                    <span>{quantities[item.id] || 0}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <span className="font-semibold">Tổng cộng:</span>
            <span className="text-pink-600 font-bold">
              {total.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <div className="text-right mt-6">
            <button
              onClick={handleConfirm}
              className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
            >
              Đặt vé
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
