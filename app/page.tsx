"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import EndGameStats from "./Components/EndGameStats";
import CustomImage from "./Components/CustomImage"; // Import the renamed component
import Papa from "papaparse";
import Conclusion from "./Components/Conclusion";
import Pregame from "./Components/PreGame";
const DynamicMap = dynamic(() => import("@/app/Components/Map"));

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const transformArrayOfArrays = (
  data: string[][]
): [string, number, number, number][] => {
  return data.map(
    (row) =>
      [row[0], ...row.slice(1).map(Number)] as [string, number, number, number]
  );
};

function Home() {
  const [score, setScore] = useState(0);
  const [error, setError] = useState(0);
  const [isitresults, setIsItResults] = useState(false);
  const [isitconclusion, setisitconclusion] = useState(false);
  const [isitpregame, setisitpregame] = useState(true);
  const [isblinkmodeon, setisblinkmodeon] = useState(false);
  const rndnum = useRef(rnd(0, 5204));
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
            setLatLong(transformArrayOfArrays(result.data));
          },
        });
      } catch (error) {
        console.error("Error loading CSV file:", error);
      }
    };

    fetchData();
  }, []);

  function handleSubmit(sc: number, er: number) {
    console.log(rndnum.current);
    setScore(sc);
    setError(er);
    totalscore.current += sc;
    rndnum.current = rnd(0, 5204);
    setIsItResults(true);
  }
  function handlenext() {
    numberofrounds.current++;
    setIsItResults(false);
    console.log(numberofrounds.current);
    if (numberofrounds.current === 5) {
      numberofrounds.current = 0;
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
    console.log("a");
  }
  return (
    <div>
      <CustomImage
        rndnum={rndnum.current}
        isitresults={isitresults}
        isitconclusion={isitconclusion}
        isitpregame={isitpregame}
        isitblinkmode={isblinkmodeon}
      />
      <DynamicMap
        Rounds={numberofrounds.current}
        isitconclusion={isitconclusion}
        isitpregame={isitpregame}
        rndnum={rndnum.current}
        latlong={latlong}
        onGuessSubmit={handleSubmit}
        onnextclick={handlenext}
        isitresults={isitresults}
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
        isitpregame={isitpregame}
      ></Pregame>
    </div>
  );
}

export default Home;
