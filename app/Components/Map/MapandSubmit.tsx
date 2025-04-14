import React, { useEffect, useRef, useState } from "react";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Style.module.css";
import MapButton from "./MapButton";
import { useMapInteractions } from "@/app/hooks/mapinteractions";
import { useMapState } from "@/context/MapStateContext";
import { useGameState } from "@/context/gamestatecontext";
interface Props {
  isitmobile: boolean;
}

const beemarker = L.icon({
  iconUrl: "/Icons/Bee-Marker.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
});

const MapandSubmit = ({ isitmobile }: Props) => {
  const { aspectRatio } = useGameState();
  const {
    mapStyle,
    submitClassName,
    ismarkeronmap,
    Map,
    setMapStyle,
    setSubmitClassName,
    setismarkeronmap,
    setMap,
  } = useMapState();
  const isitsubmitted = useRef(false);
  const guessRef = useRef<L.Marker | null>(null);
  const position = useRef<[number, number]>(null);

  const { shrinkinstantly, shrinksubmitandmap, enlargenmapandsubmitbutton } =
    useMapInteractions();

  useEffect(() => {
    if (typeof window !== "undefined" && Map === null) {
      setMap(
        L.map("map", {
          center: [41.10474805585872, 29.022884681711798],
          zoom: 16,
          maxBounds: [
            [41.08807268468239, 29.00938475141975],
            [41.12383548170815, 29.043887364827734],
          ],
          maxBoundsViscosity: 1.0,
          minZoom: 15,
        })
      );
      const openstreetmap = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 20,
        }
      );
      if (Map instanceof L.Map {
        openstreetmap.addTo(Map);
        Map.on("click", (e) => {
          if (!isitsubmitted) {
            if (ismarkeronmap) {
              if (guessRef.current) {
                guessRef.current.setLatLng(e.latlng);
                position.current = [e.latlng.lat, e.latlng.lng];
              }
            } else {
              guessRef.current = L.marker(e.latlng, {
                icon: beemarker,
                draggable: true,
              }).addTo(Map);
              position.current = [e.latlng.lat, e.latlng.lng];
              setismarkeronmap(true);
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
    }
  }, []);

  return (
    <>
      <button
        onClick={shrinkinstantly}
        className={
          infovisibility === styles.none
            ? infovisibility
            : aspectRatio > 0.85
            ? styles.outsideofmap
            : styles.none
        }
      ></button>
      <div
        onMouseOver={enlargenmapandsubmitbutton}
        onMouseOut={shrinksubmitandmap}
      >
        <div
          id="map"
          style={mapStyle}
          className={isitmobile ? styles.down : ""}
        ></div>
        <MapButton submitClassName={submitClassName}></MapButton>
      </div>
    </>
  );
};

export default MapandSubmit;
