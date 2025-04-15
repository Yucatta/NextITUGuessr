"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/conclusionpregame.module.css";
import { useGameState } from "@/context/gamestatecontext";
import Leaderboard from "./Leaderboard";
import { PreGameContextProvider } from "@/context/PreGameContext";
interface Props {
  totalscore: number;
  onstartclick: (blinkmode: boolean) => void;
}

const PreGame = ({ totalscore, onstartclick }: Props) => {
  const { isitpregame, aspectRatio } = useGameState();
  const participants = useRef<string[][]>([]);
  const normalmode = useRef<string[][]>([]);
  const blinkmode = useRef<string[][]>([]);
  const [leaderboard, setleaderboard] = useState<string[][]>([]);
  const currentparticipant = useRef<HTMLInputElement>(null);
  const [isblinkmodeon, setisblinkmodeon] = useState(false);
  const [isinputwrong, setisinputwrong] = useState(false);
  const [updateleaderboard, setupdateleaderboard] = useState(1);

  useEffect(() => {
    fetchcsv();
  }, []);

  function addparticipant() {
    let goodornah = true;
    participants.current.forEach((element) => {
      if (element[0] == currentparticipant.current?.value) {
        goodornah = false;
      }
    });
    if (
      currentparticipant.current &&
      currentparticipant.current.value.length < 31 &&
      currentparticipant.current.value.trim().length > 2 &&
      goodornah
    ) {
      onstartclick(isblinkmodeon);
      setisinputwrong(false);
    } else {
      setisinputwrong(true);
    }
  }

  useEffect(() => {
    if (isitpregame && totalscore) {
      let temp;
      if (currentparticipant.current) {
        temp = currentparticipant.current.value;
        currentparticipant.current.value = "";
      }
      const participantinformations = {
        name: temp,
        score: totalscore,
        blinkmode: isblinkmodeon,
      };

      // appendtocsv();
    }
    function handleenter(e: KeyboardEvent) {
      if (e.code === "Enter") {
        addparticipant();
      }
    }
    window.addEventListener("keydown", handleenter);
    if (leaderboard.length) {
      setTimeout(() => {
        setleaderboard(normalmode.current.slice(0, 50));
      }, 50);
    }
  }, [isitpregame]);
  useEffect(() => {
    if (participants.current[0]) {
      if (isblinkmodeon) {
        setleaderboard(
          blinkmode.current.slice(
            0,
            blinkmode.current.length >= 50 ? 50 : blinkmode.current.length
          )
        );
      } else {
        setleaderboard(normalmode.current.slice(0, 50));
      }
    }
  }, [isblinkmodeon, updateleaderboard]);

  return (
    <PreGameContextProvider>
      <div className={isitpregame ? "" : styles.none}>
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
        <button className={styles.start} onClick={addparticipant} id="start">
          <span className={styles.icon}>➤</span>
        </button>
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
        <Leaderboard></Leaderboard>
        <div>
          <span className={styles.blinkmodeexplainer}>
            Blink Mode: Shows the image briefly, then screen goes black.
          </span>
          <button
            className={styles.blinkmodeoffcontainer}
            onClick={() => setisblinkmodeon(!isblinkmodeon)}
          >
            <span
              className={
                isblinkmodeon
                  ? styles.blinkmodeonbutton
                  : styles.blinkmodeoffbutton
              }
            ></span>
          </button>
        </div>
      </div>
    </PreGameContextProvider>
  );
};

export default PreGame;
