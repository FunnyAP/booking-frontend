import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ModalSeatForm({ onClose, onSaved, editingSeat, cinemaId }) {
  const [rowNumber, setRowNumber] = useState('');
  const [columnNumber, setColumnNumber] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [seatType, setSeatType] = useState('standard');

  useEffect(() => {
    if (editingSeat) {
      setRowNumber(editingSeat.row_number);
      setColumnNumber(editingSeat.column_number);
      setSeatNumber(editingSeat.seat_number);
      setSeatType(editingSeat.seat_type);
    }
  }, [editingSeat]);

  const handleSubmit = async () => {
    try {
      const payload = {
        cinema_id: cinemaId,
        row_number: rowNumber,
        column_number: parseInt(columnNumber),
        seat_number: seatNumber,
        seat_type: seatType,
      };

      if (editingSeat) {
        await axios.put(`http://localhost:8000/api/admin/seats/${editingSeat.id}`, payload);
      } else {
        await axios.post('http://localhost:8000/api/admin/seats', payload);
      }

      onSaved(); // Reload seat layout
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors?.duplicate) {
        alert('Lỗi: Vị trí hàng/cột này đã có trong rạp!');
      } else {
        alert('Lỗi: không thể lưu ghế');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[350px]">
        <h2 className="text-lg font-semibold mb-4">{editingSeat ? 'Chỉnh sửa ghế' : 'Thêm ghế mới'}</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Hàng (row_number):</label>
            <input
              value={rowNumber}
              onChange={(e) => setRowNumber(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cột (column_number):</label>
            <input
              type="number"
              value={columnNumber}
              onChange={(e) => setColumnNumber(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mã ghế (seat_number):</label>
            <input
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Loại ghế:</label>
            <select
              value={seatType}
              onChange={(e) => setSeatType(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="standard">Ghế thường</option>
              <option value="vip">Ghế VIP</option>
              <option value="couple">Ghế COUPLE</option>
              <option value="unavailable">Không khả dụng</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
