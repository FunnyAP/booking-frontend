import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../../components/MovieCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ComingSoonPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/movies");
        const comingSoon = res.data.movies.filter(movie => movie.status === "coming_soon");
        setMovies(comingSoon);
      } catch (err) {
        setError("Không thể tải danh sách phim sắp chiếu");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <>
      <Header /> {/* Bỏ dòng này nếu bạn không muốn Header */}
      <main className="max-w-7xl mx-auto px-4 py-8 pt-[120px]">
        <h1 className="text-3xl font-bold text-white mb-6">Phim Sắp Chiếu</h1>

        {loading ? (
          <div className="text-center text-white py-10">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-10">Hiện không có phim sắp chiếu</div>
        )}
      </main>
      <Footer /> {/* Bỏ dòng này nếu bạn không muốn Footer */}
    </>
  );
}
