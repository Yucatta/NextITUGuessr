import React from "react";
import styles from "./Style.module.css";
interface Props {
  isitconclusion: boolean;
  totalscore: number;
  onmenuclick: () => void;
}
const Conclusion = ({ totalscore, isitconclusion, onmenuclick }: Props) => {
  return (
    <div className={isitconclusion ? "" : styles.none}>
      <span className={styles.progressbarcontainer}>
        <span
          style={{
            backgroundColor: `rgb(${(255 * totalscore) / 25000} ${
              255 - (255 * totalscore) / 25000
            } 0)`,
            width: `calc(clamp(30vh,40vw,42vw)*${totalscore / 25000})`,
          }}
          className={styles.progressbarprogress}
        ></span>
      </span>

      <p className={styles.points}>
        <strong>{totalscore}</strong>
      </p>
      <button onClick={onmenuclick} className={styles.menu}>
        MENU
      </button>
    </div>
  );
};

export default Conclusion;
