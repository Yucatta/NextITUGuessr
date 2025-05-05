import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "@/app/styles/MapComponent.module.css";
import MapButton from "./MapButton";
import { useMapInteractions } from "@/app/hooks/mapsizechanges";
import { useMapState } from "@/context/MapStateContext";
import { useGameState } from "@/context/gamestatecontext";
import { useChangeInsideOfMap } from "@/app/hooks/insideofmapchanges";
import { useChangeGameState } from "@/app/hooks/GameStateChanging";
import EndGameStats from "../EndGameStats";
import Conclusion from "../Conclusion";
interface Props {
  imglat: number;
  imglng: number;
  rounds: number;
  handletotalscore: (e: number) => void;
  totalscore: number;
}

const MapandSubmit = ({
  imglat,
  totalscore,
  imglng,
  rounds,
  handletotalscore,
}: Props) => {
  const {
    aspectRatio,
    isitpregame,
    isitconclusion,
    rndnum,
    isitresults,
    setrndnum,
    setisitresults,
    setisitpregame,
    setisitconclusion,
  } = useGameState();
  const { mapStyle, submitClassName, ismarkeronmap, Map, setMapStyle, setMap } =
    useMapState();
  const {
    shrinkinstantly,
    shrinksubmitandmap,
    enlargenmapandsubmitbutton,
    handleResize,
  } = useMapInteractions();
  const [scoreanderror, setscoreanderror] = useState([0, 0]);
  const [infovisibility, setinfovisibility] = useState(styles.none);
  const { handleMapClick, handleConclusion, handleSubmit, handleNext } =
    useChangeInsideOfMap();
  const { handleKeyDown } = useChangeGameState();
  useEffect(() => {
    if (typeof window !== "undefined" && Map === null) {
      const mapContainer = document.getElementById("map");
      if (mapContainer && (mapContainer as any)._leaflet_id) {
        return;
      }
      const InitialMap = L.map("map", {
        center: [41.10474805585872, 29.022884681711798],
        zoom: 16,
        maxBounds: [
          [41.08807268468239, 29.00938475141975],
          [41.12383548170815, 29.043887364827734],
        ],
        // maxBoundsViscosity: 1.0,
        minZoom: 15,
      });
      setMap(InitialMap);

      const openstreetmap = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 20,
        }
      );
      openstreetmap.addTo(InitialMap);
      setMap(InitialMap);
    }
    if (Map) {
      Map.on("click", (e) => {
        handleMapClick(e);
      });
    }
  }, [Map]);
  useEffect(() => {
    if (isitconclusion) {
      // setinfovisibility(styles.none);
      handleConclusion();
    } else if (isitresults) {
      setrndnum(Math.floor(Math.random() * 5204));
      if (!Map) {
        return;
      }
      const temp = handleSubmit(imglat, imglng);
      if (temp) {
        handletotalscore(temp[0]);
        if (temp[1] > 8000) {
          setscoreanderror([0, 0]);
          console.log("aaaa", temp);
        } else {
          console.log("bbbb", temp);
          setscoreanderror(temp);
        }
      }
    } else if (isitpregame) {
      setMapStyle({ display: "none" });
    } else {
      handleNext();
    }
  }, [isitconclusion, isitpregame, isitresults, Map]);
  useEffect(() => {
    function controlClick(e: KeyboardEvent) {
      if ((e.code === "Space" || e.code === "Enter") && !isitpregame) {
        handleKeyDown(ismarkeronmap, rounds);
      }
    }

    window.addEventListener("keydown", controlClick);

    return () => {
      window.removeEventListener("keydown", controlClick);
    };
  }, [isitconclusion, isitpregame, isitresults, ismarkeronmap]);
  useEffect(() => {
    if (!isitpregame) {
      shrinkinstantly();
    }
  }, [isitpregame]);
  useEffect(() => {
    handleResize();
  }, [aspectRatio]);
  useEffect(() => {}, [scoreanderror]);
  function handleReport() {
    const query = `?x=${btoa(`${rndnum}`)}&y=${btoa(`${imglat}`)}&z=${btoa(
      `${imglng}`
    )}`;
    window.open(`/report${query}`, "_blank");
  }
  function handlemenu() {
    setisitpregame(true);
    setisitconclusion(false);
  }
  return (
    <div>
      <div className={infovisibility}>
        <button
          onClick={shrinkinstantly}
          className={aspectRatio > 0.85 ? styles.outsideofmap : styles.none}
        ></button>
      </div>

      <div
        onMouseOver={() => {
          enlargenmapandsubmitbutton();
        }}
        onMouseOut={shrinksubmitandmap}
      >
        <div id="map" style={mapStyle}></div>
        <MapButton
          handleButtonClick={() => {
            setisitresults(true);
          }}
          submitClassName={
            !isitconclusion && !isitpregame && !isitresults
              ? submitClassName
              : styles.none
          }
        ></MapButton>
      </div>
      <EndGameStats
        isitresults={isitresults}
        onNextClick={() => {
          setrndnum(Math.floor(Math.random() * 5204));
          setinfovisibility(styles.none);
          if (!Map) {
            return;
          }
          setisitresults(false);
          if (rounds === 5) {
            setisitconclusion(true);
          } else {
            const temp = handleSubmit(imglat, imglng);
            if (temp) {
              setscoreanderror(temp);
            }
          }
        }}
        onReport={handleReport}
        score={scoreanderror[0]}
        error={scoreanderror[1]}
      ></EndGameStats>
      <Conclusion
        isitconclusion={isitconclusion}
        totalscore={totalscore}
        onmenuclick={handlemenu}
      ></Conclusion>
    </div>
  );
};

export default MapandSubmit;
