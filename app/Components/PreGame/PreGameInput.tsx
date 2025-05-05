import React, { useEffect, useRef } from "react";
import styles from "@/app/styles/conclusionpregame.module.css";
import { useInputSubmittion } from "@/app/hooks/NicknameSubmittion";
import { usePreGameContext } from "@/context/PreGameContext";
import { useGameState } from "@/context/gamestatecontext";
import { useAPIcalls } from "@/app/hooks/APIcalls";

// interface Props {}
const PreGameInput = () => {
  const currentparticipant = useRef<HTMLInputElement>(null);
  const { isitpregame, isitconclusion, totalscore, setisitpregame } =
    useGameState();
  const pregameref = useRef(true);
  const buttonref = useRef<HTMLButtonElement>(null);
  const { addparticipant } = useInputSubmittion();
  const {
    blinkmode,
    isinputwrong,
    BlinkModeLeaderboard,
    NormalModeLeaderboard,
    setisinputwrong,
  } = usePreGameContext();
  const { updateCsv } = useAPIcalls();
  function anotaddapart() {
    let temp: boolean;
    temp = addparticipant(currentparticipant.current?.value, blinkmode);
    setisinputwrong(temp);
    if (!temp && currentparticipant.current) {
      setisitpregame(false);
    }
  }
  useEffect(() => {
    if (
      isitconclusion &&
      currentparticipant.current &&
      currentparticipant.current.value
    ) {
      const temp = totalscore;
      console.log(temp);
      updateCsv({
        name: currentparticipant.current.value,
        score: temp,
        blinkmode: blinkmode,
      });
      currentparticipant.current.value = "";
    }
  }, [isitconclusion]);
  useEffect(() => {
    function controlClick(e: KeyboardEvent) {
      if (e.code === "Enter" && pregameref.current) {
        buttonref.current?.click();
      }
    }
    if (typeof window !== "undefined") {
      window.addEventListener("keypress", controlClick);
    }
    return () => {
      window.removeEventListener("keypress", controlClick);
    };
  }, []);
  useEffect(() => {
    pregameref.current = isitpregame;
  }, [isitpregame, BlinkModeLeaderboard, NormalModeLeaderboard]);
  return (
    <>
      <input
        className={styles.inputname}
        ref={currentparticipant}
        style={{
          border: ` ${isinputwrong ? "2px solid #b42727" : "2px solid #ccc"}`,
        }}
        placeholder="Your Username"
      />
      <button
        className={styles.start}
        ref={buttonref}
        onClick={() => anotaddapart()}
        id="start"
      >
        <span className={styles.icon}>➤</span>
      </button>
    </>
  );
};

export default PreGameInput;
