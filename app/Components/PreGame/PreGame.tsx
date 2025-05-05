"use client";
import React from "react";
import styles from "@/app/styles/conclusionpregame.module.css";
import { useGameState } from "@/context/gamestatecontext";
import Leaderboard from "./Leaderboard";
import { PreGameContextProvider } from "@/context/PreGameContext";
import PreGameInput from "./PreGameInput";
import BlinkModeSlider from "./blinkmodeslider";
interface Props {
  handleBlinkMode: () => void;
}

const PreGame = ({ handleBlinkMode }: Props) => {
  const { isitpregame } = useGameState();

  return (
    <PreGameContextProvider>
      <div className={isitpregame ? "" : styles.none}>
        <PreGameInput></PreGameInput>
        <div className={isitpregame ? "" : styles.none}>
          <div>
            <img
              src={"/Icons/ituailogo.png"}
              className={styles.logoimage}
              alt="ITU AI Logo"
            />
            <span className={styles.logoname}>
              ITUAI <br></br>ITUGuessr
            </span>
          </div>
        </div>
        <BlinkModeSlider handleBlinkMode={handleBlinkMode}></BlinkModeSlider>
        <Leaderboard></Leaderboard>
      </div>
    </PreGameContextProvider>
  );
};

export default PreGame;
