import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../../components/MovieCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PlayingPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/movies").then(res => {
      const nowShowing = res.data.movies.filter(movie => movie.status === "now_showing");
      setMovies(nowShowing);
    });
  }, []);

  return (
    <>
      <Header /> {/* Nếu không muốn Header thì xoá dòng này */}
      <main className="max-w-7xl mx-auto px-4 py-8 pt-[120px]">
        <h1 className="text-3xl font-bold text-white mb-6">Phim Đang Chiếu</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>
      <Footer /> {/* Nếu không muốn Footer thì xoá dòng này */}
    </>
  );
}
