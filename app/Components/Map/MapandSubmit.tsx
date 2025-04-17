import React, { useEffect, useRef, useState } from "react";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "@/app/styles/MapComponent.module.css";
import MapButton from "./MapButton";
import { useMapInteractions } from "@/app/hooks/mapinteractions";
import { useMapState } from "@/context/MapStateContext";
import { useGameState } from "@/context/gamestatecontext";
import { useChangeInsideOfMap } from "@/app/hooks/insideofmapchanges";
import { useChangeGameState } from "@/app/hooks/GameStateChanging";
interface Props {
  infovisibility: string;
  imglat: number;
  imglng: number;
  rounds: number;
}

const beemarker = L.icon({
  iconUrl: "/Icons/Bee-Marker.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
});

const MapandSubmit = ({ rounds, infovisibility, imglat, imglng }: Props) => {
  const {
    aspectRatio,
    isitpregame,
    isitconclusion,
    isitresults,
    setrndnum,
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
  const {
    shrinkinstantly,
    shrinksubmitandmap,
    enlargenmapandsubmitbutton,
    handleResize,
  } = useMapInteractions();
  const pregameref = useRef(true);
  const ismarkeronmapref = useRef(false);

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
      handleSubmit(imglat, imglng);
    } else if (isitpregame) {
      // setinfovisibility(styles.none);
    } else {
      // setinfovisibility("");
      handleNext();
    }
    // console.log(
    //   "isitconlusion",
    //   isitconclusion,
    //   "isitpregame",
    //   isitpregame,
    //   "isitresults",
    //   isitresults,
    //   "ismarkeronmap",
    //   ismarkeronmap
    // );
  }, [isitconclusion, isitpregame, isitresults, Map]);
  useEffect(() => {
    function controlClick(e: KeyboardEvent) {
      if ((e.code === "Space" || e.code === "Enter") && !pregameref.current) {
        console.log(ismarkeronmapref.current, "is marker on map");
        handleKeyDown(rounds, ismarkeronmapref.current);
      }
    }

    window.addEventListener("keydown", controlClick);

    return () => {
      window.removeEventListener("keydown", controlClick); // ✅ clean up
    };
  }, [isitconclusion, isitpregame, isitresults, ismarkeronmap]);
  useEffect(() => {
    if (!isitpregame) {
      shrinkinstantly();
    }
    pregameref.current = isitpregame;
    // console.log(pregameref.current, "is changed pregameref");
  }, [isitpregame]);
  useEffect(() => {
    handleResize();
  }, [aspectRatio]);
  useEffect(() => {
    ismarkeronmapref.current = ismarkeronmap;
    console.log(ismarkeronmap, "ismarkeronmap");
  }, [ismarkeronmap]);
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
          submitClassName={infovisibility ? infovisibility : submitClassName}
        ></MapButton>
      </div>
    </div>
  );
};

export default MapandSubmit;
