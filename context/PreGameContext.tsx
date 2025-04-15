import React, { ReactNode, useContext, createContext, useState } from "react";

type PreGameContextType = {
  BlinkModeLeaderboard: string[][];
  NormalModeLeaderboard: string[][];
  CompleteLeaderboard: string[][];
  setBlinkModeLeaderboard: React.Dispatch<React.SetStateAction<string[][]>>;
  setNormalModeLeaderboard: React.Dispatch<React.SetStateAction<string[][]>>;
  setCompleteLeaderboard: React.Dispatch<React.SetStateAction<string[][]>>;
};

const PreGameContext = createContext<PreGameContextType | null>(null);

export function PreGameContextProvider({ children }: { children: ReactNode }) {
  const [BlinkModeLeaderboard, setBlinkModeLeaderboard] = useState<string[][]>(
    []
  );
  const [NormalModeLeaderboard, setNormalModeLeaderboard] = useState<
    string[][]
  >([]);
  const [CompleteLeaderboard, setCompleteLeaderboard] = useState<string[][]>(
    []
  );

  return (
    <PreGameContext.Provider
      value={{
        BlinkModeLeaderboard,
        NormalModeLeaderboard,
        CompleteLeaderboard,
        setBlinkModeLeaderboard,
        setNormalModeLeaderboard,
        setCompleteLeaderboard,
      }}
    >
      {children}
    </PreGameContext.Provider>
  );
}

export function usePreGameContext() {
  const context = useContext(PreGameContext);
  if (!context) {
    throw new Error("nooooooooooooo");
  }
  return context;
}
