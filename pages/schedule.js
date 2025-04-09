import { useState } from "react";

const cinemas = [
  "HCinema Hà Nội Centerpoint",
  "HCinema Mac Plaza",
  "HCinema Vincom Royal City",
  "HCinema Ocean Park",
  "HCinema Aeon Hà Đông",
];

const dates = ["15", "16", "17", "18", "19", "20", "21"];

const movies = [
  {
    title: "Cái Giá Của Hạnh Phúc",
    image: "/movie1.jpg",
    times: ["10:25 - 12:40", "13:10 - 15:25"],
  },
  {
    title: "Vây Hãm: Kẻ Trừng Phạt",
    image: "/movie2.jpg",
    times: ["15:30 - 17:45", "18:00 - 20:15"],
  },
];

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState("18");
  const [selectedCinema, setSelectedCinema] = useState(cinemas[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lịch chiếu phim</h1>

      {/* Chọn ngày */}
      <div className="flex flex-wrap gap-2 mb-6">
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
              selectedDate === date
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {date}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Danh sách rạp */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Chọn rạp</h2>
          <ul className="space-y-2">
            {cinemas.map((cinema, index) => (
              <li
                key={index}
                onClick={() => setSelectedCinema(cinema)}
                className={`cursor-pointer px-3 py-2 rounded-md transition ${
                  selectedCinema === cinema
                    ? "bg-pink-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {cinema}
              </li>
            ))}
          </ul>
        </div>

        {/* Danh sách phim */}
        <div className="md:col-span-3">
          <h2 className="text-lg font-semibold mb-4">
            Lịch chiếu tại {selectedCinema}
          </h2>

          <div className="space-y-6">
            {movies.map((movie, index) => (
              <div key={index} className="flex gap-4 bg-white rounded-lg shadow p-4">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-32 h-44 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.times.map((time, idx) => (
                      <button
                        key={idx}
                        className="px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}