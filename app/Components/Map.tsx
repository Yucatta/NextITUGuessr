"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Style.module.css";

interface Props {
  rndnum: number;
  latlong: [string, number, number, number][];
  onGuessSubmit: (score: number, error: number) => void;
  isitresults: boolean;
  isitconclusion: boolean;
  isitpregame: boolean;
  onnextclick: () => void;
  totalscore: number;
  Rounds: number;
}

const latlengthmeter = 111.32 * 1000;
const longtiduelengthmeter = (40075 * 1000 * 0.75346369194) / 360; // 0.75346369194 is cosine of latitude

// const sizeofitü = Math.floor(
//   Math.sqrt(
//     (0.00944033377 * latlengthmeter) ** 2 +
//       (0.01506450233 ** longtiduelengthmeter) ** 2
//   )
// );
let score = 0;
const beemarker = L.icon({
  iconUrl: "/Icons/Bee-Marker.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
});
let timeforshrink: NodeJS.Timeout;

const Map = ({
  isitresults,
  rndnum,
  latlong,
  onGuessSubmit,
  onnextclick,
  isitconclusion,
  isitpregame,
  totalscore,
  Rounds,
}: Props) => {
  const isitsubmitted = useRef(false);
  const position = useRef<[number, number]>([0, 0]);
  const guessRef = useRef<L.Marker | null>(null);
  const mapRef = useRef<L.Map | null>(null);
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
  const secondsleft = useRef<NodeJS.Timeout | null>(null);
  const passedtime = useRef(0);
  // const [passedtime,setpassedtime] = useState(0);
  const [mapStyle, setMapStyle] = useState<React.CSSProperties>({
    position: "fixed",
    width: "20vw",
    height: "25vh",
    bottom: "0",
    right: "0",
    marginRight: "2vw",
    marginBottom: "5vh",
  });
  const [submitClassName, setSubmitClassName] = useState(styles.placemarker);
  const [updater, setupdater] = useState(0);
  const [path, setpath] = useState(`
    M 85 0 
    L 20 0 
    A 20 20 0 1 0 20 40 
    L 150 40 
    A 20 20 0 0 0 150 0 
    L 85 0
    `);
  const timerborder = useRef<NodeJS.Timeout | null>(null);
  const line1 = useRef(85);
  const line2 = useRef(150);
  const line3 = useRef(20);
  const helpertemp = useRef(400);
  const [strokeDasharray, setstrokeDasharray] = useState(helpertemp.current);
  const isitmobile = useRef(false);
  const aspectRatio = window.innerWidth / window.innerHeight;
  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current === null) {
      const map = L.map("map", {
        center: mapCenter,
        zoom: 16,
        maxBounds: [
          [41.08807268468239, 29.00938475141975],
          [41.12383548170815, 29.043887364827734],
        ],
        maxBoundsViscosity: 1.0,
        minZoom: 15,
      });
      mapRef.current = map;

      const openstreetmap = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 20,
        }
      );

      openstreetmap.addTo(map);

      map.on("click", (e) => {
        if (!isitsubmitted.current) {
          if (ismarkeronmap.current) {
            if (guessRef.current) {
              guessRef.current.setLatLng(e.latlng);
              position.current = [e.latlng.lat, e.latlng.lng];
            }
          } else {
            guessRef.current = L.marker(e.latlng, {
              icon: beemarker,
              draggable: true,
            }).addTo(map);
            position.current = [e.latlng.lat, e.latlng.lng];
            ismarkeronmap.current = true;
            const buttonElement = document.getElementById("button");

            if (buttonElement) {
              buttonElement.innerText = "SUBMIT";
            }
            if (aspectRatio > 0.85) {
              setSubmitClassName(styles.biggersubmit);
            } else {
              setSubmitClassName(styles.mobilesubmit);
            }
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(new L.LatLng(mapCenter[0], mapCenter[1]));
      mapRef.current.invalidateSize();
    }
  }, [mapCenter]);

  useEffect(() => {
    const handleSpaceKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (
          !isitresults &&
          ismarkeronmap.current &&
          !isitpregame &&
          !isitconclusion
        ) {
          guessSubmit();
        } else if (isitresults && !isitpregame && !isitconclusion) {
          onnextclick();
        }
      }
    };
    if (!latlong || !latlong[rndnum]) {
      return;
    }

    imglng.current = latlong[rndnum][3];
    imglat.current = latlong[rndnum][2];

    function guessSubmit() {
      const latLngArr = position.current;

      alllocations.current.push([imglat.current, imglng.current]);
      allguesses.current.push(latLngArr);
      mapRef.current?.eachLayer(function (layer) {
        if (!(layer instanceof L.TileLayer)) {
          mapRef.current?.removeLayer(layer);
        }
        setMapCenter([41.10474805585872, 29.022884681711798]);
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

      isitsubmitted.current = true;

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
        setMapCenter([41.1058783968682, 29.04225723149176]);
        setMapStyle({ position: "fixed", width: "100%", height: "85vh" });

        L.polyline([[imglat.current, imglng.current], position.current], {
          color: "black",
          dashArray: "10, 10",
          dashOffset: "10",
        }).addTo(mapRef.current);

        setSubmitClassName(styles.none);
        setinfovisibility(styles.none);

        onGuessSubmit(score, error);
        clearInterval(secondsleft.current);
        clearInterval(timerborder.current);
      }

      passedtime.current = 0;
      line1.current = 85;
      line2.current = 150;
      line3.current = 20;
      helpertemp.current = 400;
      setstrokeDasharray(helpertemp.current);
    }
    function controlclick() {
      if (ismarkeronmap.current && youundidtheredotoredidtheredo.current) {
        guessSubmit();
        youundidtheredotoredidtheredo.current = false;
      }
    }
    window.addEventListener("keydown", handleSpaceKey);
    document.getElementById("button")?.addEventListener("click", controlclick);
    return () => {
      window.removeEventListener("keydown", handleSpaceKey);
    };
  }, [latlong, isitresults, isitpregame, isitconclusion]);

  useEffect(() => {
    function timer() {
      secondsleft.current = setInterval(() => {
        if (passedtime.current === 500) {
          if (secondsleft.current) {
            clearInterval(secondsleft.current);
          }
          timerunout();
        }

        passedtime.current++;
        setupdater(passedtime.current);
      }, 1000);
      if (passedtime.current > 500) {
        console.log(updater);
      }
    }
    function timerprogress() {
      timerborder.current = setInterval(() => {
        if (line1.current < 150) {
          line1.current += 0.5;
        } else if (helpertemp.current > 257) {
          if (helpertemp.current === 400) {
            helpertemp.current = 320;
            setstrokeDasharray(helpertemp.current);
          }
          helpertemp.current -= 0.5;
          setstrokeDasharray(helpertemp.current);
        } else if (line2.current > 20) {
          line2.current -= 0.5;
        } else if (helpertemp.current > 65) {
          if (helpertemp.current === 257) {
            helpertemp.current = 126;
            setstrokeDasharray(126);
          }
          helpertemp.current -= 0.5;
          setstrokeDasharray(helpertemp.current);
        } else if (line3.current < 85) {
          line3.current += 0.5;
        } else {
          if (timerborder.current) {
            clearInterval(timerborder.current);
          }
        }
        if (line1.current < 150) {
          setpath(`M 85 0 
      L ${line3.current} 0 
      A 20 20 0 1 0 20 40 
      L ${line2.current} 40 
      A 20 20 0 0 0 150 0 
      L ${line1.current} 0`);
          // console.log("line1", line1.current);
        } else if (helpertemp.current > 257) {
          // console.log("dashoffset1", helpertemp.current);
        } else if (line2.current > 20) {
          setpath(`M 85 0 
      L ${line3.current} 0 
      A 20 20 0 1 0 20 40 
      L ${line2.current} 40
      `);
          // console.log("line2", line2.current);
        } else if (helpertemp.current > 65) {
          // console.log("dashoffset2", helpertemp.current);
        } else {
          setpath(`M 85 0 
      L ${line3.current} 0 
      `);
          // console.log("line3", line3.current);
        }
      }, 39);
    }
    function timerunout() {
      if (ismarkeronmap.current) {
        // console.log(ismarkeronmap.current);
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

        isitsubmitted.current = true;
        setSubmitClassName(styles.none);
        setMapCenter([41.1058783968682, 29.04225723149176]);
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
          width: "clamp(200px,20vw,20vw)",
          height: "25vh", //clamp(120px,12vw,25vh)
          bottom: "0",
          right: "0",
          marginRight: "2vw",
          marginBottom: "5vh",
        });
      } else {
        setMapStyle({
          position: "fixed",
          width: "100vw",
          height: "calc(100vh - 100vw/4*3)",
          bottom: "0",
          right: "0",
        });
      }
      if (aspectRatio > 0.85) {
        setSubmitClassName(styles.placemarker);
      } else {
        setSubmitClassName(styles.mobileplacemarker);
      }
      setinfovisibility("");

      isitsubmitted.current = false;
      ismarkeronmap.current = false;
      const buttonElement = document.getElementById("button");

      if (buttonElement && mapRef.current) {
        buttonElement.innerText = "PLACE MARKER ON THE MAP";
        mapRef.current.eachLayer(function (layer) {
          if (!(layer instanceof L.TileLayer) && mapRef.current) {
            mapRef.current.removeLayer(layer);
          }
          setMapCenter([41.10474805585872, 29.022884681711798]);
        });
      }

      youundidtheredotoredidtheredo.current = true;
      timer();
      timerprogress();
      //! timers
    } else if (isitconclusion && !isitpregame) {
      //!conclusion
      const mapid = document.getElementById("map");
      if (mapid) {
        setMapStyle({ position: "fixed", width: "%100", height: "70vh" });
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
          position: "fixed",
          width: "clamp(200px,20vw,20vw)",
          height: "25vh", //clamp(120px,12vw,25vh)
          bottom: "0",
          right: "0",
          marginRight: "2vw",
          marginBottom: "5vh",
        });
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
  useEffect(() => {
    console.log("aspect ratio is:", aspectRatio);
    if (aspectRatio < 0.85 && !isitmobile.current) {
      isitmobile.current = true;
      setMapStyle({
        position: "fixed",
        width: "100vw",
        height: "calc(100vh - 100vw/4*3)",
        bottom: "0",
        right: "0",
      });

      if (ismarkeronmap.current) {
        setSubmitClassName(styles.mobilesubmit);
      } else {
        setSubmitClassName(styles.mobileplacemarker);
      }
    } else if (isitmobile && aspectRatio > 0.85) {
      const mapcenter = mapRef.current?.getCenter();
      if (mapcenter) {
        setMapCenter([mapcenter.lat, mapcenter.lng]);
      }
      setMapStyle({
        position: "fixed",
        width: "clamp(200px,20vw,20vw)",
        height: "25vh", //clamp(120px,12vw,25vh)
        bottom: "0",
        right: "0",
        marginRight: "2vw",
        marginBottom: "5vh",
      });
      if (ismarkeronmap.current) {
        setSubmitClassName(styles.submit);
      } else {
        setSubmitClassName(styles.placemarker);
      }
      isitmobile.current = false;
    }
  }, [aspectRatio]);
  function enlargenmapandsubmitbutton() {
    if (!isitresults && !isitconclusion && !isitpregame && aspectRatio > 0.85) {
      const mapcenter = mapRef.current?.getCenter();
      if (mapcenter) {
        setMapCenter([mapcenter.lat, mapcenter.lng]);
      }
      setMapStyle({
        position: "fixed",
        width: "clamp(70vh,50vw,50vw)",
        height: "clamp(60vh,35vw,70vh)",
        bottom: "0",
        right: "0",
        marginRight: "2vw",
        marginBottom: "8vh",
        zIndex: "5",
      });
      if (ismarkeronmap.current) {
        setSubmitClassName(styles.biggersubmit);
      } else {
        setSubmitClassName(styles.biggerplacemarker);
      }
      clearTimeout(timeforshrink);
    }
  }
  function shrinksubmitandmap() {
    if (!isitresults && !isitconclusion && !isitpregame && aspectRatio > 0.85) {
      timeforshrink = setTimeout(() => {
        const mapcenter = mapRef.current?.getCenter();
        if (mapcenter) {
          setMapCenter([mapcenter.lat, mapcenter.lng]);
        }
        setMapStyle({
          position: "fixed",
          width: "clamp(200px,20vw,20vw)",
          height: "25vh", //clamp(120px,12vw,25vh)
          bottom: "0",
          right: "0",
          marginRight: "2vw",
          marginBottom: "5vh",
        });
        if (ismarkeronmap.current) {
          setSubmitClassName(styles.submit);
        } else {
          setSubmitClassName(styles.placemarker);
        }
      }, 700);
    }
  }

  return (
    <>
      {" "}
      <div
        onMouseOver={enlargenmapandsubmitbutton}
        onMouseOut={shrinksubmitandmap}
        className={!isitpregame ? "" : styles.none}
      >
        <div id="map" style={mapStyle}></div>
        <div>
          <button id="button" className={submitClassName}>
            PLACE MARKER ON THE MAP
          </button>
        </div>
      </div>
      <div className={infovisibility}>
        <div className={styles.timerdiv}>
          <p className={styles.timer}>
            00:
            {passedtime.current < 0
              ? "00"
              : 30 - passedtime.current < 10
              ? "0" + (30 - passedtime.current)
              : 30 - passedtime.current}
          </p>
        </div>
        <svg
          width="175"
          height="50"
          viewBox="-5 -5 180 50"
          className={styles.timerprogress}
        >
          <path
            d={path}
            fill="none"
            stroke="white"
            strokeWidth="5"
            strokeDasharray={`${strokeDasharray}`}
            strokeDashoffset="0"
          />
        </svg>
        <div className={styles.ingamedetails}>
          <p className={styles.tournumber}>{Rounds}/5</p>
          <p className={styles.tournumberinfo}>Rounds</p>
          <p className={styles.totalscore}>{totalscore}</p>
          <p className={styles.totalscoreinfo}>Score</p>
        </div>
      </div>
    </>
  );
};

export default Map;
