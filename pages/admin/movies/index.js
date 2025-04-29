import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchMovies = async (page = 1) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/movies?page=${page}`);
      setMovies(res.data.data); // ✅ CHỈ lấy data
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
    } catch (error) {
      console.error('Lỗi fetch movies:', error);
      setMovies([]);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc muốn xoá phim này?')) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/movies/${id}`);
        fetchMovies(currentPage);
      } catch (error) {
        console.error('Lỗi xóa phim:', error);
      }
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Danh sách phim</h1>
          <Link href="/admin/movies/create">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              + Thêm phim
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-700">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Tên phim</th>
                <th className="p-3 border">Poster</th>
                <th className="p-3 border">Thể loại</th>
                <th className="p-3 border">Thời lượng</th>
                <th className="p-3 border text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(movies) && movies.length > 0 ? (
                movies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-gray-50 text-sm text-gray-800">
                    <td className="p-3 border align-middle">{movie.id}</td>
                    <td className="p-3 border align-middle">{movie.title}</td>
                    <td className="p-3 border align-middle">
                      {movie.poster && (
                        <img
                          src={`http://localhost:8000/uploads/${movie.poster.split('/').pop()}?t=${Date.now()}`}
                          alt={movie.title}
                          className="w-16 h-auto rounded"
                        />
                      )}
                    </td>
                    <td className="p-3 border align-middle">
                      {Array.isArray(movie.genres) ? movie.genres.map((g) => g.name).join(', ') : ''}
                    </td>
                    <td className="p-3 border align-middle">{movie.duration} phút</td>
                    <td className="p-3 border text-center space-x-2 align-middle">
                      <Link href={`/admin/movies/${movie.id}`}>
                        <button className="text-blue-600 hover:underline">Sửa</button>
                      </Link>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="text-red-600 hover:underline"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    Không có phim nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Trước
            </button>
            {[...Array(lastPage)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index + 1)}
                className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Sau
            </button>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
