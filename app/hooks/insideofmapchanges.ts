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
  const allGuesses = useRef<Array<[number, number]>>([]);
  const allLocations = useRef<Array<[number, number]>>([]);
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
  function handleSubmit(imglat: number, imglng: number) {
    if (!Map) {
      return;
    }
    allLocations.current.push([imglat, imglng]);

    if (ismarkeronmap) {
      L.marker([imglat, imglng], {
        icon: L.icon({
          iconUrl: "/Icons/flag.png",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(Map);
      allGuesses.current.push(position.current);
    } else {
      L.marker([imglat, imglng], {
        icon: L.icon({
          iconUrl: "/Icons/flag.png",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(Map);
      allGuesses.current.push([0, 0]);
    }
  }
  function handleNext() {
    if (Map) {
      Map.eachLayer(function (layer) {
        if (!(layer instanceof L.TileLayer)) {
          Map.removeLayer(layer);
        }
      });
    }
  }
  function handleConclusion() {
    if (!Map) {
      return;
    }
    Map.eachLayer(function (layer) {
      if (!(layer instanceof L.TileLayer)) {
        Map.removeLayer(layer);
      }
    });
    const bounds = L.latLngBounds(
      allLocations.current[0],
      allGuesses.current[0]
    );
    for (let i = 0; i < 5; i++) {
      if (allGuesses.current[i][0] === 0 && allGuesses.current[i][1] === 0) {
        L.marker(allLocations.current[i], {
          icon: L.icon({
            iconUrl: `Icons/${i + 1}.svg`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
        }).addTo(Map);
      } else {
        L.marker(allGuesses.current[i], { icon: beemarker }).addTo(Map);
        L.marker(allLocations.current[i], {
          icon: L.icon({
            iconUrl: `Icons/${i + 1}.svg`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
        }).addTo(Map);
        const conclusionline = L.polyline(
          [allLocations.current[i], allGuesses.current[i]],
          {
            color: "black",
            weight: 3,
            dashArray: "10, 10",
            dashOffset: "10",
          }
        ).addTo(Map);
        bounds.extend(conclusionline.getBounds());
      }
    }
    Map.fitBounds(bounds);
  }
  return { handleMapClick, handleNext, handleConclusion, handleSubmit };
}
