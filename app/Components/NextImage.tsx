import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const NextImage = () => {
  const [currentImageSrc, setCurrentImageSrc] = useState("");
  const [map, setMap] = useState<L.Map | null>(null);
  const [isMarker, setIsMarker] = useState(false);
  const [sbm, setSbm] = useState(false);
  const [curloc, setCurloc] = useState<L.Marker | null>(null);
  const [guess, setGuess] = useState<L.Marker | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mapInstance = L.map("map").setView(
        [41.10474805585872, 29.022884681711798],
        15
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
      setMap(mapInstance);
    }
  }, []);

  const nextimg = () => {
    const rndnum = Math.floor(Math.random() * latlong.length);
    const newImageSrc = `/images/ordered photos/${rndnum}.jpg`;

    const img = new Image();
    img.onload = function () {
      setCurrentImageSrc(newImageSrc);
      if (curloc) {
        curloc.remove();
        setCurloc(null);
      }
      if (guess) {
        guess.remove();
        setGuess(null);
      }
      setIsMarker(false);
      setSbm(false);
      document.getElementById("results").style.display = "none";
      document.getElementById("map").style.cssText = `
        position: absolute;   
        width: calc(100vw - 100vh/3*4);
        height: 100vh;
        top: 0;
        right: 0;
      `;
      if (map) {
        map.panTo(new L.LatLng(41.1058783968682, 29.04225723149176));
      }
    };

    img.onerror = function () {
      console.error("Image failed to load: " + newImageSrc);
    };

    img.src = newImageSrc;
  };

  return (
    <div>
      <img
        id="currentimage"
        src={currentImageSrc}
        className="image"
        alt="Current"
      />
      <button onClick={nextimg}>Next Image</button>
      <div id="map" style={{ height: "400px", width: "100%" }}></div>
      <div id="results" style={{ display: "none" }}>
        {/* Results content */}
      </div>
    </div>
  );
};

export default NextImage;
