import React, { useEffect, useRef, useState } from "react";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "@/app/styles/MapComponent.module.css";
import MapButton from "./MapButton";
import { useMapInteractions } from "@/app/hooks/mapinteractions";
import { useMapState } from "@/context/MapStateContext";
import { useGameState } from "@/context/gamestatecontext";
import { useChangeInsideOfMap } from "@/app/hooks/insideofmapchanges";
interface Props {
  infovisibility: string;
  imglat: number;
  imglng: number;
}

const beemarker = L.icon({
  iconUrl: "/Icons/Bee-Marker.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
});

const MapandSubmit = ({ infovisibility, imglat, imglng }: Props) => {
  const {
    aspectRatio,
    isitpregame,
    isitconclusion,
    isitresults,
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
  const { handleMapClick, handleConclusion, handleSubmit, handleNext } =
    useChangeInsideOfMap();
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
        ]
        maxBoundsViscosity: 1.0,
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
      // setinfovisibility(styles.none);
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
  }, [isitconclusion, isitpregame, isitresults, Map]);

  useEffect(() => {
    if (!isitpregame) {
      shrinkinstantly();
    }
  }, [isitpregame]);
  useEffect(() => {
    handleResize();
  }, [aspectRatio]);
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
