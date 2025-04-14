import { useState, useEffect } from "react";
import { useGameState } from "@/context/gamestatecontext";
import styles from "@/app/styles/MapComponent.module.css";
import { useMapInteractions } from "./mapinteractions";
import { useMapState } from "@/context/MapStateContext";
interface MapProps {}
const baseMapStyle = {
  position: "fixed",
  bottom: "0",
  right: "0",
  marginRight: "2vw",
  zIndex: "5",
  transition: "width 0.3s ease, height 0.3s ease",
};

export function useMapClassChanges() {
  const { aspectRatio } = useGameState();
  const {
    mapStyle,
    submitClassName,
    ismarkeronmap,
    Map,
    isitmobile,
    setMapStyle,
    setSubmitClassName,
    setisitmobile,
    setismarkeronmap,
    setMap,
  } = useMapState();
  const [mapCenter, setMapCenter] = useState<[number, number]>();
  const { shrinkinstantly } = useMapInteractions();

  function handleNextClass() {
    setMapStyle({
      ...baseMapStyle,
      opacity: "0.5",
      width: "clamp(200px,20vw,20vw)",
      height: "25vh",
      marginBottom: "5vh",
    } as React.CSSProperties);
    console.log(mapStyle);
    setSubmitClassName(styles.placemarker);
  }
  function handleSubmitClass(
    imglat: number,
    imglng: number,
    guesslat: number,
    guesslng: number
  ) {
    setMapStyle({
      position: "fixed",
      width: "100%",
      height: "80vh",
      top: "0",
    });
    setMapStyle({ position: "fixed", width: "100%", height: "85vh" });

    setSubmitClassName(styles.none);
    setMapCenter([(imglat + guesslat) / 2, (imglng + guesslng) / 2]);
  }
  function handleConclusionClass() {
    setMapStyle({
      position: "fixed",
      width: "%100",
      height: "70vh",
      top: "0",
    });

    setSubmitClassName(styles.none);
  }
  return { handleConclusionClass, handleNextClass, handleSubmitClass };
}
