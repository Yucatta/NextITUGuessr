"use client";
import React, { useEffect } from "react";
interface Props {
  isitconclusion: boolean;
  totalscore: number;
  onmenuclick: () => void;
}
// className={isitconclusion ? "" : styles.none}
import styles from "./Style.module.css";
const Conclusion = ({ totalscore, isitconclusion, onmenuclick }: Props) => {
  return (
    <div className={isitconclusion ? "" : styles.none}>
      <progress
        className={styles.progressbar}
        value={totalscore}
        max="25000"
      ></progress>
      <p className={styles.points}>{totalscore}</p>
      <button onClick={onmenuclick} className={styles.menu}>
        RETURN TO MENU
      </button>
    </div>
  );
};

export default Conclusion;
