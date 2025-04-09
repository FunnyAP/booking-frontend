import styles from "../styles/schedule.module.css";

const cinemas = [
  "HCinema Hà Nội Centerpoint",
  "HCinema Mac Plaza",
  "HCinema Vincom Royal City",
  "HCinema Ocean Park",
  "HCinema Aeon Hà Đông",
];

export default function CinemaList({ onSelect }) {
  return (
    <div className={styles.cinemaList}>
      <h2>Chọn rạp</h2>
      <ul>
        {cinemas.map((cinema, index) => (
          <li key={index} onClick={() => onSelect(cinema)}>
            {cinema}
          </li>
        ))}
      </ul>
    </div>
  );
}
