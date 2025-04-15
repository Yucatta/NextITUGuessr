"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import EndGameStats from "./Components/EndGameStats";
import CustomImage from "./Components/CustomImage";
import Papa from "papaparse";
import Conclusion from "./Components/Conclusion";
import Pregame from "./Components/PreGame";
import { useGameState } from "@/context/gamestatecontext";
import { useChangeGameState } from "./hooks/GameStateChanging";
const DynamicMap = dynamic(() => import("@/app/Components/Map/Map"), {
  ssr: false,
});

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const whenhellfreezees = 0;

function Home() {
  const {
    isitresults,
    isitconclusion,
    rndnum,
    aspectRatio,
    setisitconclusion,
    setisitpregame,
    setisitresults,
    setrndnum,
    setaspectRatio,
  } = useGameState();
  const { handleKeyDown } = useChangeGameState();
  const [score, setScore] = useState(0);
  const [error, setError] = useState(0);
  const [isblinkmodeon, setisblinkmodeon] = useState(false);
  const numberofrounds = useRef(0);
  const [latlong, setLatLong] = useState<
    Array<[string, number, number, number]>
  >([]);
  const totalscore = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/FinalCsv.csv");
        const csvText = await response.text();

        Papa.parse<string[]>(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (result) => {
            result.data.shift();
            setLatLong(
              result.data.map((element: string[]) => [
                element[0],
                +element[1],
                +element[2],
                +element[3],
              ])
            );
          },
        });
      } catch (error) {
        console.error("Error loading CSV file:", error);
      }
    };

    fetchData();
  }, []);
  function handleresize() {
    if (typeof window !== "undefined") {
      setaspectRatio(window.innerWidth / window.innerHeight);
    }
  }
  function controlClick(e: KeyboardEvent) {
    if (e.code === "Space" || e.code === "Enter") {
      handleKeyDown(numberofrounds.current);
    }
  }
  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleresize);
    window.addEventListener("keydown", controlClick);
  }

  useEffect(() => {
    setrndnum(rnd(0, 5204));
  }, [whenhellfreezees]);
  function handleSubmit(sc: number, er: number) {
    if (rndnum === null) {
      return;
    } else {
    }
    // console.log(rndnum.current);
    setScore(sc);
    setError(er);
    totalscore.current += sc;
    setrndnum(rnd(0, 5204));
  }
  function handlenext() {
    numberofrounds.current++;
    setisitresults(false);
    console.log(isitconclusion);

    if (numberofrounds.current === 5) {
      numberofrounds.current = 0;
      console.log(isitconclusion);

      setisitconclusion(true);
    }
  }
  function handlemenu() {
    setisitpregame(true);
    setisitconclusion(false);
  }
  function handlestart(blinkmode: boolean) {
    setisitpregame(false);
    setisblinkmodeon(blinkmode);
    totalscore.current = 0;
  }
  function handleReport() {
    const query = `?x=${btoa(`${rndnum}`)}&y=${btoa(
      `${latlong[rndnum][2]}`
    )}&z=${btoa(`${latlong[rndnum][3]}`)}`;
    window.open(`/report${query}`, "_blank");
    // window.open("/report", "_blank");
    // console.log("a");
  }

  return (
    <div>
      <CustomImage isitblinkmode={isblinkmodeon} />
      <DynamicMap
        Rounds={numberofrounds.current}
        latlong={latlong}
        onGuessSubmit={handleSubmit}
        onnextclick={handlenext}
        totalscore={totalscore.current}
      />
      <EndGameStats
        isitresults={isitresults}
        onNextClick={handlenext}
        onReport={handleReport}
        score={score}
        error={error}
      />
      <Conclusion
        isitconclusion={isitconclusion}
        totalscore={totalscore.current}
        onmenuclick={handlemenu}
      ></Conclusion>
      <Pregame
        onstartclick={handlestart}
        totalscore={totalscore.current}
      ></Pregame>
    </div>
  );
}

export default Home;
