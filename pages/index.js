import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Banner from '../components/Banner';

export default function Home() {
  const [moviesNow, setMoviesNow] = useState([]);
  const [moviesComingSoon, setMoviesComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get("http://localhost:8000/api/movies");
        const movies = response.data.movies;
        
        setMoviesNow(movies.filter(movie => movie.status === 'now_showing'));
        setMoviesComingSoon(movies.filter(movie => movie.status === 'coming_soon'));
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Không thể tải danh sách phim. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const MovieCard = ({ movie }) => (
    <Link href={`/movies/${movie.id}`} passHref>
      <div className="h-full flex flex-col rounded-lg overflow-hidden shadow-none border border-gray-700 cursor-pointer no-underline bg-gray-800 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-500">
        <img
          src={`http://localhost:8000/uploads/${movie.poster.split('/').pop()}`}
          alt={movie.title}
          className="h-[380px] w-full object-cover transition-transform duration-300 hover:scale-103"
        />
        <div className="flex-grow p-4">
          <h3 className="font-bold text-lg mb-2 text-white min-h-[3rem] line-clamp-2">
            {movie.title}
          </h3>
          
          <p className="text-sm mb-3 text-gray-400">
            <span className="font-semibold text-white mr-1">Thể loại:</span> 
            {movie.genres?.map(g => g.name).join(", ") || "Đang cập nhật"}
          </p>

          <div className="flex justify-between items-center mt-auto">
            <p className="text-sm">
              <span className="text-gray-400 mr-1">Đánh giá:</span> 
              <span className="text-yellow-400 font-semibold">
                {movie.rating}/10
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-400 mr-1">Thời lượng:</span> 
              {movie.duration}'
            </p>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <>
      <Head>
        <title>HCinema - Phim chiếu rạp</title>
        <meta name="description" content="Trang chủ phim chiếu rạp HCinema" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Banner />

      {/* Main content with proper spacing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Now Showing Movies */}
        <section className="mb-12">
          <div className="max-w-6xl mx-auto px-2 sm:px-0">
            <h2 className="text-2xl font-bold mb-6 pb-2 relative inline-block">
              PHIM ĐANG CHIẾU
              <span className="absolute bottom-0 left-0 w-full h-1 bg-white rounded"></span>
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 bg-gray-800 bg-opacity-50 rounded-lg">
                <p className="text-red-500">{error}</p>
              </div>
            ) : moviesNow.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {moviesNow.map((movie) => (
                  <div key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-800 bg-opacity-50 rounded-lg">
                <p>Hiện không có phim đang chiếu</p>
              </div>
            )}
          </div>
        </section>

        {/* Coming Soon Movies */}
        <section className="mt-16">
          <div className="max-w-6xl mx-auto px-2 sm:px-0">
            <h2 className="text-2xl font-bold mb-6 pb-2 relative inline-block">
              PHIM SẮP CHIẾU
              <span className="absolute bottom-0 left-0 w-full h-1 bg-white rounded"></span>
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 bg-gray-800 bg-opacity-50 rounded-lg">
                <p className="text-red-500">{error}</p>
              </div>
            ) : moviesComingSoon.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {moviesComingSoon.map((movie) => (
                  <div key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-800 bg-opacity-50 rounded-lg">
                <p>Hiện không có phim sắp chiếu</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}