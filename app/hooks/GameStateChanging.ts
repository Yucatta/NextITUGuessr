import { useRef, useEffect, useState } from "react";
import { useMapState } from "@/context/MapStateContext";
import { useGameState } from "@/context/gamestatecontext";
import { usePreGameContext } from "@/context/PreGameContext";
import { useInputSubmittion } from "./NicknameSubmittion";
export function useChangeGameState() {
  const {
    isitconclusion,
    isitresults,
    isitpregame,
    rndnum,
    setrndnum,
    setisitconclusion,
    setisitpregame,
    setisitresults,
  } = useGameState();
  const markeref = useRef(false);
  // const { isinputwrong, setisinputwrong } = usePreGameContext();
  // const { addparticipant } = useInputSubmittion();
  function handleKeyDown(round: number, ismarkeronmap: boolean) {
    console.log(markeref.current);
    console.log(isitresults);
    if (isitresults) {
      setisitresults(false);

      if (round === 5) {
        setisitconclusion(true);
      }
    } else if (isitconclusion) {
      setisitconclusion(false);
      setisitpregame(true);
    } else if (ismarkeronmap) {
      setisitresults(true);
    }
  }
  function handlePregameskip(user: string, blinkmode: boolean) {}
  return { handleKeyDown };
}
