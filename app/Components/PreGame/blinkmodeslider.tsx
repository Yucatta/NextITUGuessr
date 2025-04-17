import React from "react";
import styles from "@/app/styles/conclusionpregame.module.css";
import { usePreGameContext } from "@/context/PreGameContext";

const BlinkModeSlider = () => {
  const { blinkmode, setblinkmode } = usePreGameContext();
  return (
    <div>
      <span className={styles.blinkmodeexplainer}>
        Blink Mode: Shows the image briefly, then screen goes black.
      </span>
      <button
        className={styles.blinkmodeoffcontainer}
        onClick={() => {
          setblinkmode(!blinkmode);
        }}
      >
        <span
          className={
            blinkmode ? styles.blinkmodeonbutton : styles.blinkmodeoffbutton
          }
        ></span>
      </button>
    </div>
  );
};

export default BlinkModeSlider;
