"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type GameContext = {
  rndnum: number;
  isitresults: boolean;
  isitconclusion: boolean;
  isitpregame: boolean;
  aspectRatio: number;
  totalscore: number;
  setisitresults: (val: boolean) => void;
  setisitpregame: (val: boolean) => void;
  setisitconclusion: (val: boolean) => void;
  setrndnum: (val: number) => void;
  settotalscore: (val: number) => void;
  setaspectRatio: (val: number) => void;
};
// const initialrndnum = Math.floor(Math.random() * 5205);
const GameStateContext = createContext<GameContext | null>(null);
export function GameStateProvider({ children }: { children: ReactNode }) {
  const [isitresults, setisitresults] = useState(false);
  const [isitconclusion, setisitconclusion] = useState(false);
  const [isitpregame, setisitpregame] = useState(true);
  const [rndnum, setrndnum] = useState<number>(1);
  const [aspectRatio, setaspectRatio] = useState(1);
  const [totalscore, settotalscore] = useState(0);
  return (
    <GameStateContext.Provider
      value={{
        isitresults,
        totalscore,
        isitconclusion,
        isitpregame,
        rndnum,
        aspectRatio,
        setisitconclusion,
        settotalscore,
        setisitpregame,
        setisitresults,
        setrndnum,
        setaspectRatio,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("aaaaaa");
  }
  return context;
}
