import styles from "../styles/schedule.module.css";

const movies = [
  { title: "Cái Giá Của Hạnh Phúc", times: ["10:25 - 12:40", "13:10 - 15:25"] },
  { title: "Vây Hãm: Kẻ Trừng Phạt", times: ["15:30 - 17:45", "18:00 - 20:15"] },
];

export default function MovieList({ date, cinema }) {
  return (
    <div className={styles.movieList}>
      <h2>Lịch chiếu tại {cinema || "chọn rạp"}</h2>
      {movies.map((movie, index) => (
        <div key={index} className={styles.movieItem}>
          <h3>{movie.title}</h3>
          <p>Suất chiếu: {movie.times.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
