"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Style.module.css";
import { useGameState } from "@/context/gamestatecontext";
import MapandSubmit from "./MapandSubmit";
import { MapStateProvider } from "@/context/MapStateContext";
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
  useEffect(() => {
    // const handleSpaceKey = (e: KeyboardEvent) => {
    //   if (e.code === "Space") {
    //     if (
    //       !isitresults &&
    //       ismarkeronmap.current &&
    //       !isitpregame &&
    //       !isitconclusion
    //     ) {
    //       guessSubmit();
    //     } else if (isitresults && !isitpregame && !isitconclusion) {
    //       onnextclick();
    //     }
    //   }
    // };
    // if (!latlong || !latlong[rndnum]) {
    //   return;
    // }

    imglng.current = latlong[rndnum][3];
    imglat.current = latlong[rndnum][2];

    // function controlclick() {
    //   if (ismarkeronmap.current && youundidtheredotoredidtheredo.current) {
    //     guessSubmit();
    //     youundidtheredotoredidtheredo.current = false;
    //   }
    // }
    // window.addEventListener("keydown", handleSpaceKey);
    // document.getElementById("button")?.addEventListener("click", controlclick);
    return () => {
      window.removeEventListener("keydown", handleSpaceKey);
    };
  }, [latlong, isitresults, isitpregame, isitconclusion]);

  function guessSubmit() {
    const latLngArr = position.current;

    alllocations.current.push([imglat.current, imglng.current]);
    allguesses.current.push(latLngArr);
    mapRef.current?.eachLayer(function (layer) {
      if (!(layer instanceof L.TileLayer)) {
        mapRef.current?.removeLayer(layer);
      }
    });
    if (mapRef.current) {
      L.marker(position.current, { icon: beemarker }).addTo(mapRef.current);
      L.marker([imglat.current, imglng.current], {
        icon: L.icon({
          iconUrl: "/Icons/flag.png",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(mapRef.current);
    }

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
      setMapStyle({
        position: "fixed",
        width: "100%",
        height: "80vh",
        top: "0",
      });

      L.polyline([[imglat.current, imglng.current], position.current], {
        color: "black",
        dashArray: "10, 10",
        dashOffset: "10",
      }).addTo(mapRef.current);

      setSubmitClassName(styles.none);
      setinfovisibility(styles.none);
      setMapCenter([
        (imglat.current + latLngArr[0]) / 2,
        (imglng.current + latLngArr[1]) / 2,
      ]);
      onGuessSubmit(score, error);
      clearInterval(secondsleft.current);
      clearInterval(timerborder.current);
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
        if (secondsleft.current && timerborder.current) {
          clearInterval(secondsleft.current);
          clearInterval(timerborder.current);
        }
        clearTimeout(timeforshrink);
        allguesses.current.push([0, 0]);
        alllocations.current.push([imglat.current, imglng.current]);
        setMapStyle({ position: "fixed", width: "100%", height: "85vh" });
        ismarkeronmap.current = true;
        if (mapRef.current) {
          L.marker([imglat.current, imglng.current], {
            icon: L.icon({
              iconUrl: "/Icons/flag.png",
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            }),
          }).addTo(mapRef.current);
        }

        setSubmitClassName(styles.none);
        setMapCenter([imglat.current, imglng.current]);
        passedtime.current = 0;
        line1.current = 85;
        line2.current = 150;
        line3.current = 20;
        helpertemp.current = 400;
        setstrokeDasharray(helpertemp.current);
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

      ismarkeronmap.current = false;
      yellow.current = 255;
      const buttonElement = document.getElementById("button");

      if (buttonElement && mapRef.current) {
        buttonElement.innerText = "PLACE MARKER ON THE MAP";
        mapRef.current.eachLayer(function (layer) {
          if (!(layer instanceof L.TileLayer) && mapRef.current) {
            mapRef.current.removeLayer(layer);
          }
        });
      }
      youundidtheredotoredidtheredo.current = true;
      timer();
      timerprogress();
      //!timers
    } else if (isitconclusion && !isitpregame) {
      //!conclusion
      const mapid = document.getElementById("map");
      if (mapid) {
        setMapStyle({
          position: "fixed",
          width: "%100",
          height: "70vh",
          top: "0",
        });
      }

      setSubmitClassName(styles.none);
      setinfovisibility(styles.none);
      if (mapRef.current) {
        mapRef.current.eachLayer(function (layer) {
          if (!(layer instanceof L.TileLayer) && mapRef.current) {
            mapRef.current.removeLayer(layer);
          }
        });
        const bounds = L.latLngBounds(
          alllocations.current[0],
          allguesses.current[0]
        );

        for (let i = 0; i < 5; i++) {
          if (
            allguesses.current[i][0] === 0 &&
            allguesses.current[i][1] === 0
          ) {
            L.marker(alllocations.current[i], {
              icon: L.icon({
                iconUrl: `Icons/${i + 1}.svg`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              }),
            }).addTo(mapRef.current);
          } else {
            L.marker(allguesses.current[i], { icon: beemarker }).addTo(
              mapRef.current
            );
            L.marker(alllocations.current[i], {
              icon: L.icon({
                iconUrl: `Icons/${i + 1}.svg`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              }),
            }).addTo(mapRef.current);
            const conclusionline = L.polyline(
              [alllocations.current[i], allguesses.current[i]],
              {
                color: "black",
                weight: 3,
                dashArray: "10, 10",
                dashOffset: "10",
              }
            ).addTo(mapRef.current);
            bounds.extend(conclusionline.getBounds());
          }
        }
        mapRef.current.fitBounds(bounds);
      }
    } else if (isitpregame) {
      //! pregame
      if (aspectRatio > 0.85) {
        setMapStyle({
          ...baseMapStyle,
          opacity: "0.5",
          width: "clamp(200px,20vw,20vw)",
          height: "25vh",
          marginBottom: "5vh",
        } as React.CSSProperties);
      } else {
        setMapStyle({
          position: "fixed",
          width: "100vw",
          height: "calc(100vh - 100vw/4*3)",
          bottom: "0",
          right: "0",
        });
      }

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
  return (
    <MapStateProvider>
      <MapandSubmit></MapandSubmit>
      <Timer
        Rounds={Rounds}
        totalscore={totalscore}
        timerunout={() => handleTimeRunOut()}
      ></Timer>
    </MapStateProvider>
  );
};

export default Map;
