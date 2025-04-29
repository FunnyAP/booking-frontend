import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';
import ModalSeatForm from '@/components/admin/ModalSeatForm';

const seatColors = {
  standard: 'bg-purple-500',
  vip: 'bg-red-500',
  couple: 'bg-pink-500',
  unavailable: 'bg-black',
};

export default function SeatList() {
  const [seats, setSeats] = useState({});
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSeat, setEditingSeat] = useState(null);

  useEffect(() => {
    fetchCinemas();
  }, []);

  useEffect(() => {
    if (selectedCinemaId) fetchSeats(selectedCinemaId);
  }, [selectedCinemaId]);

  const fetchCinemas = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/cinemas');
      setCinemas(res.data);
      if (res.data.length > 0) {
        setSelectedCinemaId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch cinemas', err);
    }
  };

  const fetchSeats = async (cinemaId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/seats?cinema_id=${cinemaId}`);
      const seatData = res.data.data ?? res.data;
      const grouped = {};
      seatData.forEach((seat) => {
        if (!grouped[seat.row_number]) {
          grouped[seat.row_number] = [];
        }
        grouped[seat.row_number].push(seat);
      });
      Object.keys(grouped).forEach((row) => {
        grouped[row].sort((a, b) => a.column_number - b.column_number);
      });
      setSeats(grouped);
    } catch (err) {
      console.error('Failed to fetch seats', err);
    }
  };

  const openModal = (seat = null) => {
    setEditingSeat(seat);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingSeat(null);
    setShowModal(false);
  };

  const handleDelete = async (seatId) => {
    if (!confirm('Bạn có chắc chắn muốn xoá ghế này không?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/seats/${seatId}`);
      fetchSeats(selectedCinemaId);
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="mr-2 font-semibold">Chọn rạp:</label>
            <select
              className="border px-2 py-1"
              value={selectedCinemaId}
              onChange={(e) => setSelectedCinemaId(e.target.value)}
            >
              {cinemas.map((cinema) => (
                <option key={cinema.id} value={cinema.id}>
                  {cinema.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => openModal()}
          >
            + Thêm ghế
          </button>
        </div>

        <div className="bg-black text-white text-center py-2 font-semibold mb-4">
          MÀN HÌNH
        </div>

        <div className="space-y-2">
          {Object.keys(seats).map((row) => (
            <div key={row} className="flex gap-2 justify-center">
              {seats[row].map((seat) => (
                <div
                  key={seat.id}
                  className={`relative text-xs text-white w-8 h-8 flex items-center justify-center rounded ${seatColors[seat.seat_type]}`}
                >
                  {seat.seat_number}
                  <div className="absolute -top-1 -right-1 flex space-x-1">
                    <span
                      onClick={() => openModal(seat)}
                      className="cursor-pointer text-xs px-1 bg-white text-black rounded"
                    >✏️</span>
                    <span
                      onClick={() => handleDelete(seat.id)}
                      className="cursor-pointer text-xs px-1 bg-white text-black rounded"
                    >🗑️</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500"></div>
            Ghế thường
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500"></div>
            Ghế VIP
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-500"></div>
            Ghế COUPLE
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black"></div>
            Không khả dụng
          </div>
        </div>
      </div>

      {showModal && (
        <ModalSeatForm
          onClose={closeModal}
          onSaved={() => {
            fetchSeats(selectedCinemaId);
            closeModal();
          }}
          editingSeat={editingSeat}
          cinemaId={selectedCinemaId}
        />
      )}
    </AdminLayout>
  );
}
