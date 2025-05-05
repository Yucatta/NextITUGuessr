import React from "react";
import styles from "@/app/styles/conclusionpregame.module.css";
import { usePreGameContext } from "@/context/PreGameContext";
interface Props {
  handleBlinkMode: () => void;
}
const BlinkModeSlider = ({ handleBlinkMode }: Props) => {
  const { blinkmode, setblinkmode } = usePreGameContext();
  return (
    <div>
      <span className={styles.blinkmodeexplainer}>
        Blink Mode: Shows the image briefly, then screen goes black.
      </span>
      <button
        className={styles.blinkmodeoffcontainer}
        onClick={() => {
          handleBlinkMode();
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
