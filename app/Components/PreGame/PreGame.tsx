"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "@/app/styles/conclusionpregame.module.css";
import { useGameState } from "@/context/gamestatecontext";
import Leaderboard from "./Leaderboard";
import {
  PreGameContextProvider,
  usePreGameContext,
} from "@/context/itwas238charactersandgitcouldntreadskillissue";
import { useAPIcalls } from "@/app/hooks/APIcalls";
import PreGameInput from "./PreGameInput";
import BlinkModeSlider from "./blinkmodeslider";
interface Props {
  totalscore: number;
  onstartclick: (blinkmode: boolean) => void;
}

const PreGame = ({ totalscore, onstartclick }: Props) => {
  const { isitpregame, aspectRatio } = useGameState();

  return (
    <PreGameContextProvider>
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
      <BlinkModeSlider></BlinkModeSlider>
      <Leaderboard></Leaderboard>
    </PreGameContextProvider>
  );
};

export default PreGame;
