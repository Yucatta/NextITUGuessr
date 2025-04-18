"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import EndGameStats from "../EndGameStats";
import "leaflet/dist/leaflet.css";
import styles from "@/app/styles/Style.module.css";
import { useGameState } from "@/context/gamestatecontext";
import MapandSubmit from "./MapandSubmit";
import { MapStateProvider } from "@/context/MapStateContext";
import { useChangeInsideOfMap } from "@/app/hooks/insideofmapchanges";
import Timer from "./Timer";
import { useMapState } from "@/context/MapStateContext";
import { useChangeGameState } from "@/app/hooks/GameStateChanging";
interface Props {
  latlong: [string, number, number, number][];
  totalscore: number;
  Rounds: number;
}

let score = 0;

const Map = ({ latlong, totalscore, Rounds }: Props) => {
  const {
    isitresults,
    isitconclusion,
    isitpregame,
    rndnum,
    aspectRatio,
    setisitconclusion,
    setisitresults,
    setrndnum,
  } = useGameState();
  const {
    mapStyle,
    submitClassName,
    ismarkeronmap,
    Map,
    isitmobile,
    setMapStyle,
    setSubmitClassName,
    setismarkeronmap,
    setMap,
  } = useMapState();
  const { handleMapClick, handleConclusion, handleSubmit, handleNext } =
    useChangeInsideOfMap();

  // const { handleKeyDown } = useChangeGameState();
  const pregameref = useRef(true);
  const imglat = useRef(0);
  const imglng = useRef(0);

  useEffect(() => {
    pregameref.current = isitpregame;
  }, [isitpregame]);
  function handleTimeRunOut() {
    if (Rounds === 5) {
      console.log("are you triggering ");
      setisitconclusion(true);
    } else {
      setisitresults(true);
    }
  }
  // useEffect(() => {
  //   // console.log(Map);

  //   if (isitconclusion) {
  //     // setinfovisibility(styles.none);
  //     // handleConclusion();
  //   } else if (isitresults) {
  //     // setinfovisibility(styles.none);
  //     // handleSubmit(imglat.current, imglng.current);
  //     // console.log("handlegamstatechanges");
  //   } else if (isitpregame) {
  //     setinfovisibility(styles.none);
  //   } else {
  //     setinfovisibility("");
  //     // handleNext();
  //   }
  // }, [isitconclusion, isitpregame, isitresults, Map]);
  // useEffect(() => {
  //   if (isitconclusion) {
  //     setinfovisibility(styles.none);
  //     handleConclusion();
  //   } else if (isitresults) {
  //     setrndnum(Math.floor(Math.random() * 5204));
  //     setinfovisibility(styles.none);
  //     console.log("a");
  //     const temp = handleSubmit(latlong[rndnum][2], latlong[rndnum][3]);
  //     if (temp) {
  //       setscoreanderror(temp);
  //     }
  //   } else if (isitpregame) {
  //     setMapStyle({ display: "none" });
  //     setinfovisibility(styles.none);
  //   } else if (!isitpregame && !isitconclusion && !isitresults) {
  //     setinfovisibility("");
  //     handleNext();
  //   }
  // }, [isitconclusion, isitpregame, isitresults, Map]);

  return (
    <MapStateProvider>
      <MapandSubmit
        rounds={Rounds}
        imglat={latlong[rndnum][2]}
        imglng={latlong[rndnum][3]}
      ></MapandSubmit>
      <Timer
        Rounds={Rounds}
        totalscore={totalscore}
        timerunout={() => handleTimeRunOut()}
      ></Timer>
    </MapStateProvider>
  );
};

export default Map;
