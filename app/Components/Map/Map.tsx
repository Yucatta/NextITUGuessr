"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "@/app/styles/Style.module.css";
import { useGameState } from "@/context/gamestatecontext";
import MapandSubmit from "./MapandSubmit";
import { MapStateProvider } from "@/context/MapStateContext";
import { useChangeInsideOfMap } from "@/app/hooks/insideofmapchanges";
import Timer from "./Timer";
import { useMapState } from "@/context/MapStateContext";
interface Props {
  latlong: [string, number, number, number][];
  onGuessSubmit: (score: number, error: number) => void;
  onnextclick: () => void;
  totalscore: number;
  Rounds: number;
}

const latlengthmeter = 111.32 * 1000;
const longtiduelengthmeter = (40075 * 1000 * 0.75346369194) / 360; // 0.75346369194 is cosine of latitude

let score = 0;

const Map = ({
  latlong,
  onGuessSubmit,
  onnextclick,
  totalscore,
  Rounds,
}: Props) => {
  const {
    isitresults,
    isitconclusion,
    isitpregame,
    rndnum,
    aspectRatio,
    setisitconclusion,
    setisitresults,
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    41.10474805585872, 29.022884681711798,
  ]);
  const [infovisibility, setinfovisibility] = useState(styles.none);
  const imglat = useRef(0);
  const imglng = useRef(0);
  const youundidtheredotoredidtheredo = useRef(true);
  function guessSubmit() {
    const error = Math.floor(
      Math.sqrt(
        ((imglat.current - latLngArr[0]) * latlengthmeter) ** 2 +
          ((imglng.current - latLngArr[1]) * longtiduelengthmeter) ** 2
      )
    );
    if (mapRef.current && secondsleft.current && timerborder.current) {
      score =
        Math.floor(
          5000 *
            Math.E **
              ((-5 *
                Math.sqrt(
                  (imglat.current - latLngArr[0]) ** 2 +
                    (imglng.current - latLngArr[1]) ** 2
                )) /
                0.01947557727)
        ) + 1;

      onGuessSubmit(score, error);
    }
  }
  useEffect(() => {
    // function timerunout() {
    //   if (ismarkeronmap.current) {
    //     const event = new KeyboardEvent("keydown", {
    //       key: " ",
    //       code: "Space",
    //       keyCode: 32,
    //       which: 32,
    //       bubbles: true,
    //     });
    //     document.dispatchEvent(event);
    //   } else {
    //     alllocations.current.push([imglat.current, imglng.current]);

    //     setSubmitClassName(styles.none);
    //     setMapCenter([imglat.current, imglng.current]);
    //     onGuessSubmit(0, 0);
    //   }
    // }

    //! this is supposed to be next but idk nextim
    if (!isitresults && !isitconclusion && !isitpregame) {
      if (aspectRatio > 0.85) {
        //   setMapStyle({
        //     position: "fixed",
        //     bottom: "0",
        //     right: "0",
        //     marginRight: "2vw",
        //     zIndex: "5",
        //     opacity: "0.5",
        //     width: "clamp(200px,20vw,20vw)",
        //     height: "25vh",
        //     marginBottom: "5vh",
        //   });
        //   shrinksubmitandmap();
        //   mapRef.current?.invalidateSize(true);
        // } else {
        //   setMapStyle({
        //     position: "fixed",
        //     width: "100vw",
        //     height: "calc(100vh - 100vw/4*3)",
        //     bottom: "0",
        //     right: "0",
        //   });
        setMapCenter([41.10474805585872, 29.022884681711798]);
      }
    }
  }, [isitresults, isitpregame, isitconclusion]);
  function handleTimeRunOut() {
    if (Rounds === 5) {
      console.log("are you triggering");
      setisitconclusion(true);
    } else {
      setisitresults(true);
    }
  }
  function handleGameStateChanges() {}
  useEffect(() => {
    // console.log(Map);

    if (isitconclusion) {
      setinfovisibility(styles.none);
      // handleConclusion();
    } else if (isitresults) {
      setinfovisibility(styles.none);
      // handleSubmit(imglat.current, imglng.current);
      // console.log("handlegamstatechanges");
    } else if (isitpregame) {
      setinfovisibility(styles.none);
    } else {
      setinfovisibility("");
      // handleNext();
    }
  }, [isitconclusion, isitpregame, isitresults, Map]);
  return (
    <MapStateProvider>
      <MapandSubmit
        imglat={latlong[rndnum][2]}
        imglng={latlong[rndnum][3]}
        infovisibility={infovisibility}
      ></MapandSubmit>
      <Timer
        infovisibility={infovisibility}
        Rounds={Rounds}
        totalscore={totalscore}
        timerunout={() => handleTimeRunOut()}
      ></Timer>
    </MapStateProvider>
  );
};

export default Map;
