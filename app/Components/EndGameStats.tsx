import styles from "../styles/Style.module.css";

interface Props {
  isitresults: boolean;
  score: number;
  error: number;
  onNextClick: () => void;
  onReport: () => void;
}

const EndGameStats = ({
  isitresults,
  score,
  onNextClick: onNextClick,
  error,
  onReport,
}: Props) => {
  const displayStyle: React.CSSProperties = isitresults
    ? { position: "fixed" }
    : { display: "none" };

  return (
    <div style={displayStyle}>
      <div>
        <p className={styles.score}>
          <strong>{score}</strong>
        </p>
        <span className={styles.scoreinfo}>OF 5000 POINTS</span>
        <p className={styles.error}>
          <strong>{error}m</strong>
        </p>
        <span className={styles.errorinfo}>FROM LOCATION</span>
        <button className={styles.nextimg} onClick={onNextClick}>
          Next
        </button>
      </div>
      <div>
        <button className={styles.report} onClick={onReport}>
          <img src="/Icons/ReportFlag.png" className={styles.ReportImg}></img>
        </button>
      </div>
    </div>
  );
};

export default EndGameStats;
