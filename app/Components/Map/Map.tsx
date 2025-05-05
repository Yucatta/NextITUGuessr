"use client";
import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { useGameState } from "@/context/gamestatecontext";
import MapandSubmit from "./MapandSubmit";
import { MapStateProvider } from "@/context/MapStateContext";
import Timer from "./Timer";
interface Props {
  latlong: [string, number, number, number][];
}

const Map = ({ latlong }: Props) => {
  const {
    isitpregame,
    rndnum,
    setisitconclusion,
    setisitresults,
    settotalscore,
  } = useGameState();
  const totalscore = useRef(0);
  const Rounds = useRef(0);

  const pregameref = useRef(true);

  useEffect(() => {
    pregameref.current = isitpregame;
  }, [isitpregame]);
  function handleTimeRunOut() {
    if (Rounds.current === 5) {
      setisitconclusion(true);
    } else {
      setisitresults(true);
    }
  }
  useEffect(() => {
    if (isitpregame) {
      totalscore.current = 0;
      Rounds.current = 0;
      settotalscore(totalscore.current);
    }
  }, [isitpregame]);
  return (
    <MapStateProvider>
      <MapandSubmit
        handletotalscore={(e) => {
          totalscore.current += e;
          Rounds.current++;
          settotalscore(totalscore.current);
        }}
        rounds={Rounds.current}
        imglat={latlong[rndnum][2] ? latlong[rndnum][2] : 0}
        imglng={latlong[rndnum][3] ? latlong[rndnum][3] : 0}
        totalscore={totalscore.current}
      ></MapandSubmit>
      <Timer
        Rounds={Rounds.current}
        totalscore={totalscore.current}
        timerunout={() => {
          handleTimeRunOut();
        }}
      ></Timer>
    </MapStateProvider>
  );
};

export default Map;
