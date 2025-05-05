"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "@/app/styles/MapComponent.module.css";
import { useSearchParams } from "next/navigation";
const baseMapStyle = {
  position: "fixed",
  bottom: "0",
  right: "0",
  marginRight: "2vw",
  zIndex: "5",
  transition: "width 0.3s ease, height 0.3s ease",
};

let timeforshrink: NodeJS.Timeout;

const Report = () => {
  // const isitsubmitted = useRef(false);
  // const position = useRef<[number, number]>([0, 0]);
  // const guessRef = useRef<L.Marker | null>(null);
  // const [mapCenter, setMapCenter] = useState<[number, number]>([
  //   41.10474805585872, 29.022884681711798,
  // ]);
  const mapRef = useRef<L.Map | null>(null);
  const ismarkeronmap = useRef<boolean>(false);
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
  const isitmobile = useRef(false);
  const aspectRatio = useRef(1);
  // const [updater, setupdater] = useState(0);
  const searchParams = useSearchParams();
  const [imagedata, setimagedata] = useState({});

  useEffect(() => {
    if (searchParams) {
      setimagedata({
        rndnum: searchParams.get("x") ? +atob(searchParams.get("x")!) : 0,
        imglat: searchParams.get("y") ? +atob(searchParams.get("y")!) : 0,
        imglng: searchParams.get("z") ? +atob(searchParams.get("z")!) : 0,
      });
    }
  }, [searchParams]);
  console.log(imagedata);

  useEffect(() => {
    const initializeMap = async () => {
      if (typeof window !== "undefined" && mapRef.current === null) {
        const L = (await import("leaflet")).default;

        // const beemarker = L.icon({
        //   iconUrl: "/Icons/Bee-Marker.png",
        //   iconSize: [20, 30],
        //   iconAnchor: [10, 30],
        // });

        const map = L.map("map", {
          center: [41.10474805585872, 29.022884681711798],
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
      }
    };

    initializeMap();
  }, []);
  useEffect(() => {
    if (aspectRatio.current < 0.85 && !isitmobile.current) {
      const mapcenter = mapRef.current?.getCenter();
      isitmobile.current = true;
      setMapStyle({
        position: "absolute",
        width: "100vw",
        height: "calc(100vh - 100vw/4*3)",
        zIndex: "-50",
        right: "0",
      });

      if (ismarkeronmap.current) {
        setSubmitClassName(styles.mobilesubmit);
      } else {
        setSubmitClassName(styles.mobileplacemarker);
      }
      if (mapcenter) {
        // setMapCenter([mapcenter.lat, mapcenter.lng]);
      }
    } else if (isitmobile && aspectRatio.current > 0.85) {
      const mapcenter = mapRef.current?.getCenter();
      setMapStyle({
        ...baseMapStyle,
        opacity: "0.5",
        width: "clamp(200px,20vw,20vw)",
        height: "25vh",
        marginBottom: "5vh",
      } as React.CSSProperties);
      if (mapcenter) {
        // setMapCenter([mapcenter.lat, mapcenter.lng]);
      }
      if (ismarkeronmap.current) {
        setSubmitClassName(styles.submit);
      } else {
        setSubmitClassName(styles.placemarker);
      }
      isitmobile.current = false;
    }
  }, [aspectRatio.current]);
  function enlargenmapandsubmitbutton() {
    if (aspectRatio.current > 0.85) {
      const mapcenter = mapRef.current?.getCenter();
      setMapStyle({
        ...baseMapStyle,
        width: "clamp(70vh,50vw,50vw)",
        height: "clamp(60vh,35vw,70vh)",
        marginBottom: "8vh",
      } as React.CSSProperties);
      if (ismarkeronmap.current) {
        setSubmitClassName(styles.biggersubmit);
      } else {
        setSubmitClassName(styles.biggerplacemarker);
      }
      setTimeout(() => {
        if (mapcenter) {
          // setMapCenter([mapcenter.lat, mapcenter.lng]);
        }
      }, 300);
      clearTimeout(timeforshrink);
    }
  }
  function shrinksubmitandmap() {
    if (aspectRatio.current > 0.85) {
      timeforshrink = setTimeout(() => {
        const mapcenter = mapRef.current?.getCenter();
        setMapStyle({
          ...baseMapStyle,
          opacity: "0.5",
          width: "clamp(200px,20vw,20vw)",
          height: "25vh",
          marginBottom: "5vh",
        } as React.CSSProperties);

        if (ismarkeronmap.current) {
          setSubmitClassName(styles.submit);
        } else {
          setSubmitClassName(styles.placemarker);
        }
        if (mapcenter) {
          // setMapCenter([mapcenter.lat, mapcenter.lng]);
        }
      }, 700);
    }
  }
  function shrinkinstantly() {
    const mapcenter = mapRef.current?.getCenter();
    setMapStyle({
      ...baseMapStyle,
      opacity: "0.5",
      width: "clamp(200px,20vw,20vw)",
      height: "25vh",
      marginBottom: "5vh",
    } as React.CSSProperties);

    if (ismarkeronmap.current) {
      setSubmitClassName(styles.submit);
    } else {
      setSubmitClassName(styles.placemarker);
    }
    if (mapcenter) {
      // setMapCenter([mapcenter.lat, mapcenter.lng]);
    }
  }

  return (
    <div>
      <div className={styles.background}></div>
      <button
        onClick={shrinkinstantly}
        className={
          aspectRatio.current > 0.85 ? styles.outsideofmap : styles.none
        }
      ></button>
      <div
        onMouseOver={enlargenmapandsubmitbutton}
        onMouseOut={shrinksubmitandmap}
      >
        <div
          id="map"
          style={mapStyle}
          className={isitmobile.current ? styles.down : ""}
        ></div>
        <div>
          <button
            id="button"
            style={{
              transition: "width 0.3s ease, height 0.3s ease",
              zIndex: "5",
            }}
            className={submitClassName}
          >
            PLACE MARKER ON THE MAP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
