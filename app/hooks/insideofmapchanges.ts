import React, { useEffect, useRef, useState } from "react";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapInteractions } from "@/app/hooks/mapinteractions";
import styles from "@/app/styles/MapComponent.module.css";
import { useMapState } from "@/context/MapStateContext";
import { useGameState } from "@/context/gamestatecontext";
interface Props {}

const beemarker = L.icon({
  iconUrl: "/Icons/Bee-Marker.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
});

export function useChangeInsideOfMap() {
  const { aspectRatio } = useGameState();
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
  const position = useRef<[number, number]>([0, 0]);
  const guessRef = useRef<L.Marker | null>(null);
  function handleMapClick(e: L.LeafletMouseEvent) {
    if (Map) {
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
  }
  return { handleMapClick };
}
