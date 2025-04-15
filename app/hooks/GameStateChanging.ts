import { useEffect, useState } from "react";
import { useMapState } from "@/context/MapStateContext";
import { useGameState } from "@/context/gamestatecontext";
export function useChangeGameState() {
  const {
    isitconclusion,
    isitresults,
    isitpregame,
    setisitconclusion,
    setisitpregame,
    setisitresults,
  } = useGameState();
  const { ismarkeronmap } = useMapState();
  function handleKeyDown(round: number) {
    if (isitresults) {
      setisitresults(false);
      if (round === 5) {
        setisitconclusion(true);
      }
    } else if (isitconclusion) {
      setisitconclusion(false);
      setisitpregame(true);
    } else if (isitpregame) {
      setisitpregame(false);
    } else if (ismarkeronmap) {
      setisitresults(true);
    }
  }
  return { handleKeyDown };
}
