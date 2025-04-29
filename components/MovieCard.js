import Link from "next/link";

export default function MovieCard({ movie }) {
  return (
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
              <span className="text-yellow-400 font-semibold">{movie.rating}/10</span>
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
}
