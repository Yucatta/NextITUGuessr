"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import CustomImage from "./Components/CustomImage";
import Papa from "papaparse";
import Conclusion from "./Components/Conclusion";
import PreGame from "./Components/PreGame/PreGame";
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
  // function controlClick(e: KeyboardEvent) {
  //   if (e.code === "Space" || e.code === "Enter") {
  //     handleKeyDown(numberofrounds.current);
  //   }
  // }
  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleresize);
    // window.addEventListener("keydown", controlClick);
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

  return (
    <div>
      <CustomImage isitblinkmode={isblinkmodeon} />
      <DynamicMap
        Rounds={numberofrounds.current}
        latlong={latlong}
        totalscore={totalscore.current}
      />
      <PreGame></PreGame>
    </div>
  );
}

export default Home;
