"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import CustomImage from "./Components/CustomImage";
import Papa from "papaparse";
import PreGame from "./Components/PreGame/PreGame";
import { useGameState } from "@/context/gamestatecontext";
const DynamicMap = dynamic(() => import("@/app/Components/Map/Map"), {
  ssr: false,
});

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const whenhellfreezees = 0;

function Home() {
  const { setrndnum, setaspectRatio } = useGameState();
  const [isblinkmodeon, setisblinkmodeon] = useState(false);
  const [latlong, setLatLong] = useState<
    Array<[string, number, number, number]>
  >([["a", 0, 0, 0]]);

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
  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleresize);
  }

  useEffect(() => {
    setrndnum(rnd(0, 5204));
  }, [whenhellfreezees]);

  return (
    <div>
      <CustomImage isitblinkmode={isblinkmodeon} />
      <DynamicMap latlong={latlong} />
      <PreGame
        handleBlinkMode={() => {
          setisblinkmodeon(!isblinkmodeon);
        }}
      ></PreGame>
    </div>
  );
}

export default Home;
