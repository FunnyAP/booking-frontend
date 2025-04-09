import styles from "../styles/schedule.module.css";

const dates = ["15", "16", "17", "18", "19", "20", "21"];

export default function DateSelector({ selectedDate, onSelect }) {
  return (
    <div className={styles.dateSelector}>
      <h2>Chọn ngày</h2>
      <div className={styles.dates}>
        {dates.map((date) => (
          <button
            key={date}
            className={selectedDate === date ? styles.active : ""}
            onClick={() => onSelect(date)}
          >
            {date}
          </button>
        ))}
      </div>
    </div>
  );
}
