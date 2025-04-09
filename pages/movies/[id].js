import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ArrowLeft, CalendarMonth, LocationOn, AccessTime, Star } from "@mui/icons-material";
import { Button, Chip } from "@mui/material";

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const movieRes = await axios.get(`http://localhost:8000/api/movies/${id}`);
        setMovie(movieRes.data.movie);
        const showtimesRes = await axios.get(`http://localhost:8000/api/showtimes/movie/${id}`);
        setShowtimes(showtimesRes.data.showtimes);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-white">Đang tải...</div>;
  if (!movie) return <div className="text-center py-10 text-white">Không tìm thấy phim</div>;

  const dates = Array.from({ length: 10 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const filteredShowtimes = showtimes.filter(s => new Date(s.show_date).getDate() === selectedDate);
  const grouped = filteredShowtimes.reduce((acc, s) => {
    if (!acc[s.cinema.id]) acc[s.cinema.id] = { cinema: s.cinema, times: [] };
    acc[s.cinema.id].times.push(s);
    return acc;
  }, {});

  return (
    <>
      <Head>
        <title>{movie.title} - HCinema</title>
        <meta name="description" content={movie.description} />
      </Head>
      <Header />
      <div className="bg-black text-white py-8 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Button onClick={() => router.back()} startIcon={<ArrowLeft />} sx={{ color: 'white', mb: 2 }}>Quay lại</Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1">
              <Image
                src={`http://localhost:8000/uploads/${movie.poster.split('/').pop()}`}
                alt={movie.title}
                width={400}
                height={600}
                layout="responsive"
              />
            </div>

            <div className="md:col-span-2">
              <h1 className="text-5xl font-bold mb-2 text-white">{movie.title}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <Chip icon={<AccessTime />} label={`${movie.duration}'`} sx={{ color: 'white', borderColor: 'white' }} variant="outlined" />
                <Chip label="VN" sx={{ color: 'white', borderColor: 'white' }} variant="outlined" />
              </div>


              <div className="bg-neutral-900 p-4 rounded mb-4">
                <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
                <p className="mb-2">Đạo diễn: <strong>{movie.director || 'Đang cập nhật'}</strong></p>
                <p className="mb-2">Diễn viên: <strong>{movie.actors || 'Đang cập nhật'}</strong></p>
                <p className="mb-2">Thể loại: <strong>{movie.genres?.map(g => g.name).join(", ") || 'Đang cập nhật'}</strong></p>
                <p>Khởi chiếu: <strong>{new Date(movie.release_date).toLocaleDateString('vi-VN')}</strong></p>
              </div>

              <div className="bg-neutral-900 p-4 rounded mb-4">
                <h2 className="text-xl font-semibold mb-2">Nội dung phim</h2>
                <p className="text-gray-300">{movie.description}</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-4 text-white">Lịch chiếu</h2>

          <div className="flex justify-center flex-wrap gap-3 mb-6">
            {dates.map((date, idx) => {
              const d = date.getDate();
              const formatted = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
              const weekday = date.toLocaleDateString('vi-VN', { weekday: 'short' });
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(d)}
                  className={`px-4 py-2 rounded border text-sm font-semibold ${selectedDate === d ? 'bg-white text-black' : 'border-white text-white hover:bg-white hover:text-black'}`}
                >
                  <div className="text-lg font-bold">{formatted}</div>
                  <div>{weekday}</div>
                </button>
              );
            })}
          </div>

          <h3 className="text-2xl font-bold mb-3 text-white">Danh sách rạp</h3>

          {Object.values(grouped).length === 0 ? (
            <p className="text-gray-300">Không có suất chiếu cho ngày này.</p>
          ) : (
            Object.values(grouped).map((group, idx) => (
              <div key={idx} className="bg-neutral-800 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-bold text-white mb-1">{group.cinema.name}</h4>
                <p className="text-sm text-gray-400 mb-3">{group.cinema.address}</p>
                <div className="flex flex-wrap gap-2">
                  {group.times.map((s, i) => (
                    <button
                      key={i}
                      className="border border-white px-4 py-2 rounded text-white hover:bg-white hover:text-black transition"
                      onClick={() => router.push({
                        pathname: `/book/${s.id}`,
                        query: { cinema_id: group.cinema.id, movie_id: id }
                      })}
                    >
                      {new Date(`${s.show_date}T${s.show_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="text-center mt-8">
            <Button variant="contained" sx={{ backgroundColor: 'white', color: 'black', '&:hover': { backgroundColor: 'gray' } }} onClick={() => router.push('/')}>Quay lại trang chủ</Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}