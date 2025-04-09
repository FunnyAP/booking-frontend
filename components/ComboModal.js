import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ComboModal({ open, onClose }) {
  const [combos, setCombos] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (open) {
      axios.get('http://localhost:8000/api/products/combos')
        .then(res => {
          setCombos(res.data.combos || []);
          const initialQuantities = {};
          res.data.combos.forEach(combo => {
            initialQuantities[combo.id] = 0;
          });
          setQuantities(initialQuantities);
        })
        .catch(err => console.error('Lỗi lấy combo:', err));
    }
  }, [open]);

  const updateQuantity = (comboId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [comboId]: Math.max(0, (prev[comboId] || 0) + delta)
    }));
  };

  const total = combos.reduce((acc, combo) => {
    const qty = quantities[combo.id] || 0;
    return acc + combo.price * qty;
  }, 0);

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
          {combos.length === 0 ? (
            <p className="text-center">Không có combo nào khả dụng.</p>
          ) : (
            <div className="space-y-4">
              {combos.map(combo => (
                <div key={combo.id} className="flex items-center gap-4 border-b pb-4">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{combo.name}</h3>
                    <p className="text-sm text-gray-600">{combo.description}</p>
                    <p className="text-pink-600 font-bold">
                      {combo.price.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(combo.id, -1)}
                      disabled={quantities[combo.id] === 0}
                      className="px-2 py-1 border rounded disabled:opacity-30"
                    >-</button>
                    <span>{quantities[combo.id] || 0}</span>
                    <button
                      onClick={() => updateQuantity(combo.id, 1)}
                      className="px-2 py-1 border rounded"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <span className="font-semibold">Tổng cộng:</span>
            <span className="text-pink-600 font-bold">{total.toLocaleString('vi-VN')}đ</span>
          </div>

          <div className="text-right mt-6">
            <button
              onClick={onClose}
              className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}