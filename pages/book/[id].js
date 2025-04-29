// ✅ File: /pages/book/[id].js (kết hợp chọn ghế + mở ComboModal chọn bắp nước riêng)
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Box, Typography, Button, IconButton, CircularProgress, Paper, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ComboModal from '../../components/ComboModal';

export default function SeatBookingPage() {
  const router = useRouter();
  const { id: showtimeId, cinema_id, movie_id } = router.query;
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [cinema, setCinema] = useState(null);
  const [openCombo, setOpenCombo] = useState(false);

  useEffect(() => {
    if (!cinema_id || !movie_id || !showtimeId) return;

    const fetchData = async () => {
      try {
        const seatRes = await axios.get(`http://localhost:8000/api/seats/cinema/${cinema_id}`);
        const showtimeRes = await axios.get(`http://localhost:8000/api/showtimes/movie/${movie_id}`);
        const movieRes = await axios.get(`http://localhost:8000/api/movies/${movie_id}`);

        const currentShowtime = showtimeRes.data.showtimes.find(s => s.id === parseInt(showtimeId));
        if (!currentShowtime) throw new Error('Suất chiếu không tồn tại');

        setSeats(seatRes.data.seats.sort((a, b) => {
          if (a.row_number === b.row_number) {
            return a.column_number - b.column_number;
          }
          return a.row_number.localeCompare(b.row_number);
        }));

        setShowtime(currentShowtime);
        setMovie(movieRes.data.movie);
        setCinema(currentShowtime.cinema);
      } catch (err) {
        console.error('Lỗi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cinema_id, movie_id, showtimeId]);

  const handleToggleSeat = (seatId) => {
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const getSeatColor = (seat) => {
    if (selectedSeats.includes(seat.id)) return '#FF4081';
    return seat.seat_type === 'vip' ? '#EF5350' : '#7C4DFF';
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row_number]) acc[seat.row_number] = [];
    acc[seat.row_number].push(seat);
    return acc;
  }, {});

  const estimatedEndTime = showtime && movie
    ? dayjs(`${showtime.show_date}T${showtime.show_time}`).add(movie.duration, 'minute').format('HH:mm')
    : '';

  const totalPrice = selectedSeats.length * (showtime?.ticket_price || 0);

  return (
    <Box
      sx={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999,
        width: '100vw', height: '100vh', bgcolor: '#1a1a1a',
        overflow: 'auto', display: 'flex', justifyContent: 'center',
        alignItems: 'flex-start', p: 2
      }}
    >
      <Paper sx={{ width: '90%', maxWidth: 1000, borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: '#ec407a', p: 2, position: 'relative' }}>
          <Typography variant="h6" color="white" align="center">
            Mua vé xem phim
          </Typography>
          <IconButton
            onClick={() => router.back()}
            sx={{ position: 'absolute', top: 8, left: 8, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ bgcolor: '#121212', px: 4, py: 2 }}>
          {loading || !showtime || !movie || !cinema ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          ) : (
            <>
              <Box textAlign="center" mb={2}>
                <Typography variant="subtitle2" color="white" gutterBottom>
                  MÀN HÌNH
                </Typography>
                <Box sx={{ width: '100%', height: 8, bgcolor: 'white', borderRadius: 1, mb: 3 }} />
              </Box>

              <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                {Object.entries(groupedSeats).map(([row, rowSeats]) => (
                  <Box
                    key={row}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${rowSeats.length}, 36px)`,
                      gap: '8px',
                      justifyContent: 'center',
                      mb: 1
                    }}
                  >
                    {rowSeats.map((seat) => (
                      <Button
                        key={seat.id}
                        variant="contained"
                        onClick={() => handleToggleSeat(seat.id)}
                        sx={{
                          width: 36, height: 36, fontSize: '0.7rem',
                          bgcolor: getSeatColor(seat), fontFamily: 'monospace',
                          minWidth: 0, p: 0,
                          '&:hover': { bgcolor: getSeatColor(seat) },
                        }}
                      >
                        {seat.seat_number}
                      </Button>
                    ))}
                  </Box>
                ))}
              </Box>

              <Box display="flex" justifyContent="center" gap={2} mt={4}>
                <Chip label="Ghế bạn chọn" sx={{ bgcolor: '#FF4081', color: 'white' }} />
                <Chip label="Ghế thường" sx={{ bgcolor: '#7C4DFF', color: 'white' }} />
                <Chip label="Ghế VIP" sx={{ bgcolor: '#EF5350', color: 'white' }} />
              </Box>

              <Box mt={4} bgcolor="#fff" borderRadius={2} p={2}>
                <Typography variant="h6" fontWeight="bold">{movie.title}</Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {dayjs(`${showtime.show_date}T${showtime.show_time}`).format('HH:mm')} - Dự kiến {estimatedEndTime} • {dayjs(showtime.show_date).format('D/M/YYYY')} • {cinema.name} • 2D Phụ đề
                </Typography>

                <Typography variant="body1"><strong>Chỗ ngồi</strong></Typography>
                <Typography mb={1}>
                  {selectedSeats.length === 0 ? 'Chưa chọn' : seats.filter(s => selectedSeats.includes(s.id)).map(s => s.seat_number).join(', ')}
                </Typography>

                <Typography variant="body1" fontWeight="bold">
                  Tạm tính
                  <span style={{ float: 'right', color: 'blue' }}>
                    {totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </Typography>

                <Box textAlign="right" mt={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={selectedSeats.length === 0}
                    onClick={() => setOpenCombo(true)}
                  >
                    MUA VÉ
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Paper>

      {/* Combo chọn bắp nước */}
      <ComboModal
        open={openCombo}
        onClose={() => setOpenCombo(false)}
        selectedSeats={selectedSeats}
        showtime={showtime}
        movie={movie}
        cinema={cinema}
        totalTicketPrice={totalPrice}
      />
    </Box>
  );
}
