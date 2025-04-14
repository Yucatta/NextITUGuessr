import { useState, useEffect } from "react";
import { useGameState } from "@/context/gamestatecontext";
import styles from "./Style.module.css";
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
let timeforshrink: NodeJS.Timeout;

export function useMapInteractions() {
  const { aspectRatio } = useGameState();
  const [mapCenter, setMapCenter] = useState<[number, number]>();
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
  function enlargenmapandsubmitbutton() {
    if (aspectRatio > 0.85 && Map) {
      const mapcenter = Map.getCenter();
      setMapStyle({
        ...baseMapStyle,
        width: "clamp(70vh,50vw,50vw)",
        height: "clamp(60vh,35vw,70vh)",
        marginBottom: "8vh",
      } as React.CSSProperties);
      if (ismarkeronmap) {
        setSubmitClassName(styles.biggersubmit);
      } else {
        setSubmitClassName(styles.biggerplacemarker);
      }
      setTimeout(() => {
        if (mapcenter) {
          setMapCenter([mapcenter.lat, mapcenter.lng]);
        }
      }, 300);
      clearTimeout(timeforshrink);
    }
  }
  useEffect(() => {
    if (Map && mapCenter) {
      Map.panTo(mapCenter);
      Map.invalidateSize();
    }
  }, [mapCenter]);
  function shrinksubmitandmap() {
    if (aspectRatio > 0.85 && Map) {
      timeforshrink = setTimeout(() => {
        const mapcenter = Map.getCenter();
        setMapStyle({
          ...baseMapStyle,
          opacity: "0.5",
          width: "clamp(200px,20vw,20vw)",
          height: "25vh",
          marginBottom: "5vh",
        } as React.CSSProperties);

        if (ismarkeronmap) {
          setSubmitClassName(styles.submit);
        } else {
          setSubmitClassName(styles.placemarker);
        }
        if (mapcenter) {
          setMapCenter([mapcenter.lat, mapcenter.lng]);
        }
      }, 700);
    }
  }
  function shrinkinstantly() {
    if (Map) {
      const mapcenter = Map.getCenter();
      setMapStyle({
        ...baseMapStyle,
        opacity: "0.5",
        width: "clamp(200px,20vw,20vw)",
        height: "25vh",
        marginBottom: "5vh",
      } as React.CSSProperties);

      if (ismarkeronmap) {
        setSubmitClassName(styles.submit);
      } else {
        setSubmitClassName(styles.placemarker);
      }
      if (mapcenter) {
        setMapCenter([mapcenter.lat, mapcenter.lng]);
      }
    }
  }
  return { shrinkinstantly, shrinksubmitandmap, enlargenmapandsubmitbutton };
}
