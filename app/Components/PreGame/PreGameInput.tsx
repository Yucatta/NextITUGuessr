import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/styles/conclusionpregame.module.css";
import { useInputSubmittion } from "@/app/hooks/NicknameSubmittion";
import { usePreGameContext } from "@/context/PreGameContext";
import { useChangeGameState } from "@/app/hooks/GameStateChanging";
import { useGameState } from "@/context/gamestatecontext";
import { Just_Another_Hand } from "next/font/google";

interface Props {
  round: number;
}
const PreGameInput = ({ round }: Props) => {
  const currentparticipant = useRef<HTMLInputElement>(null);
  const { isitpregame, setisitpregame } = useGameState();
  const pregameref = useRef(true);
  const { addparticipant } = useInputSubmittion();
  const { blinkmode, isinputwrong, setisinputwrong } = usePreGameContext();
  // const { handleKeyDown } = useChangeGameState();
  function anotaddapart() {
    let temp: boolean;
    temp = addparticipant(currentparticipant.current?.value, blinkmode);
    setisinputwrong(temp);
    if (!temp) {
      setisitpregame(false);
      // console.log(isitpregame);
    }
  }
  function controlClick(e: KeyboardEvent) {
    if (e.code === "Enter" && pregameref.current) {
      console.log(isitpregame);
      anotaddapart();
    }
  }
  if (typeof window !== "undefined") {
    window.addEventListener("keypress", controlClick);
  }
  useEffect(() => {
    pregameref.current = isitpregame;
  }, [isitpregame]);
  return (
    <>
      {/* <p className={styles.inputinfo}></p> */}
      <input
        // className={aspectRatio <= 0.85 ? styles.none : styles.inputname}
        className={styles.inputname}
        ref={currentparticipant}
        style={{
          border: ` ${isinputwrong ? "2px solid #b42727" : "2px solid #ccc"}`,
        }}
        placeholder="Your Username"
      />
      {/* <span className={styles.alert}>THIS NAME IS ALREADY TAKEN</span> */}
      <button
        className={styles.start}
        onClick={() => anotaddapart()}
        id="start"
      >
        <span className={styles.icon}>➤</span>
      </button>
    </>
  );
};

export default PreGameInput;
