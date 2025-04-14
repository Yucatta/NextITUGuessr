"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Style.module.css";
import { useGameState } from "@/context/gamestatecontext";
import MapandSubmit from "./MapandSubmit";
import { MapStateProvider } from "@/context/MapStateContext";
import { useChangeInsideOfMap } from "@/app/hooks/insideofmapchanges";
import Timer from "./Timer";
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
  const { handleMapClick, handleConclusion, handleSubmit, handleNext } =
    useChangeInsideOfMap();
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    41.10474805585872, 29.022884681711798,
  ]);
  const [infovisibility, setinfovisibility] = useState(styles.none);
  const imglat = useRef(0);
  const imglng = useRef(0);
  const youundidtheredotoredidtheredo = useRef(true);
  const allguesses = useRef<Array<[number, number]>>([]);
  const alllocations = useRef<Array<[number, number]>>([]);
  const ismarkeronmap = useRef<boolean>(false);
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

      setinfovisibility(styles.none);

      onGuessSubmit(score, error);
    }
  }
  useEffect(() => {
    function timerunout() {
      if (ismarkeronmap.current) {
        const event = new KeyboardEvent("keydown", {
          key: " ",
          code: "Space",
          keyCode: 32,
          which: 32,
          bubbles: true,
        });
        document.dispatchEvent(event);
      } else {
        alllocations.current.push([imglat.current, imglng.current]);
        setMapStyle({ position: "fixed", width: "100%", height: "85vh" });

        setSubmitClassName(styles.none);
        setMapCenter([imglat.current, imglng.current]);
        setinfovisibility(styles.none);
        onGuessSubmit(0, 0);
      }
    }

    //! this is supposed to be next but idk nextim
    if (!isitresults && !isitconclusion && !isitpregame) {
      if (aspectRatio > 0.85) {
        setMapStyle({
          position: "fixed",
          bottom: "0",
          right: "0",
          marginRight: "2vw",
          zIndex: "5",
          opacity: "0.5",
          width: "clamp(200px,20vw,20vw)",
          height: "25vh",
          marginBottom: "5vh",
        });
        shrinksubmitandmap();
        mapRef.current?.invalidateSize(true);
      } else {
        setMapStyle({
          position: "fixed",
          width: "100vw",
          height: "calc(100vh - 100vw/4*3)",
          bottom: "0",
          right: "0",
        });
        setMapCenter([41.10474805585872, 29.022884681711798]);
      }

      if (aspectRatio > 0.85) {
        setSubmitClassName(styles.placemarker);
      } else {
        setSubmitClassName(styles.mobileplacemarker);
      }
      setinfovisibility("");

      //!timers
    } else if (isitconclusion && !isitpregame) {
      //!conclusion
      setinfovisibility(styles.none);
    } else if (isitpregame) {
      allguesses.current = [];
      alllocations.current = [];
    }
  }, [isitresults, isitpregame, isitconclusion]);
  function handleTimeRunOut() {
    if (Rounds === 5) {
      setisitconclusion(true);
    } else {
      setisitresults(true);
    }
  }
  useEffect(() => {
    if (isitconclusion) {
      handleConclusion;
    } else if (isitresults) {
      handleSubmit(imglat.current, imglng.current);
    } else if (isitpregame) {
    } else {
      handleNext;
    }
  }, [isitconclusion, isitpregame, isitresults]);
  return (
    <MapStateProvider>
      <MapandSubmit
        imglat={imglat.current}
        imglng={imglng.current}
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
