"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Style.module.css";
import Image from "next/image";
interface Props {
  rndnum: number | null;
  isitresults: boolean;
  isitconclusion: boolean;
  isitpregame: boolean;
  isitblinkmode: boolean;
}

const CustomImage = ({
  rndnum,
  isitresults,
  isitconclusion,
  isitpregame,
  isitblinkmode,
}: Props) => {
  const [imagevisibility, setimagevisibility] = useState(styles.none);
  const [isitloaded, setisitloaded] = useState(false);
  const imagereloadtry = useRef(0);
  const [imageSrc, setImageSrc] = useState(
    `https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/${rndnum}.jpg`
  );
  const isitblinked = useRef(false);
  const [mobilefullscreen, setmobilefullscreen] = useState(false);
  useEffect(() => {
    if (isitresults) {
      setisitloaded(false);
      isitblinked.current = false;
      imagereloadtry.current = 0;
    }
    if (!isitconclusion && !isitpregame && !isitresults) {
      if (isitloaded && !isitblinked.current && isitblinkmode) {
        blink();
      }
      setimagevisibility(styles.image);
    } else {
      setimagevisibility(styles.none);
    }
    // console.log(isitblinked.current);
  }, [isitconclusion, isitresults, isitpregame]);

  function blink() {
    let a = 0;
    const blinkmodeinterval = setInterval(() => {
      if (a >= 2) {
        setimagevisibility(styles.none);
        clearInterval(blinkmodeinterval);
      } else {
      }
      a++;
    }, 50);
    isitblinked.current = true;
  }
  function onLoad() {
    if (!isitresults && isitblinkmode && !isitresults && !isitpregame) {
      blink();
    }
    setisitloaded(true);
  }
  function handleImageError() {
    if (imagereloadtry.current > 3) {
      setImageSrc(
        `https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/${rndnum}.jpg?retry=${Date.now()}`
      );
    }
    imagereloadtry.current++;
  }
  useEffect(() => {
    setImageSrc(
      `https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/${rndnum}.jpg`
    );
  }, [rndnum]);
  function handleExpand() {
    setmobilefullscreen(true);
  }
  return (
    <>
      <div
        className={
          isitresults
            ? styles.mobileresultsbackground
            : isitconclusion
            ? styles.mobileconclusionbackground
            : isitblinked.current
            ? styles.mobileblinkedbackground
            : styles.background
        }
      ></div>
      <div
        className={
          isitloaded &&
          !isitblinked.current &&
          !isitresults &&
          !isitpregame &&
          !isitconclusion
            ? ""
            : styles.none
        }
      >
        <button
          onClick={() => {
            setmobilefullscreen(!mobilefullscreen);
          }}
          className={mobilefullscreen ? styles.collapse : styles.none}
        ></button>
        <button onClick={handleExpand} className={styles.fullscreen}>
          <img src={"Icons/fullscreen.webp"} className={styles.expand}></img>
        </button>
        <div
          style={{
            width: "calc(100vw/3*4)",
            height: "100vw",
            position: "fixed",
            top: "calc(50vh - 50vw/3*4)",
            left: "50.5%",
            transform: "translateX(-50%) rotate(90deg)",
            zIndex: "11",
          }}
          className={mobilefullscreen ? "" : styles.none}
        >
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // src={`compressed-images/${rndnum}.jpg`}
            src={imageSrc}
            alt="Current image"
            style={{ objectFit: "contain" }}
            fill
            loading="lazy"
            // onError={handleImageError}
          />
          {/* <img
        //   src={`https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/${rndnum}.jpg`}
          // src={`compressed-images/${rndnum}.jpg`}
          loading="lazy"
          className={mobilefullscreen ? styles.fullscreenimage : styles.none}
         ></img>  */}
        </div>
      </div>
      <div className={imagevisibility === styles.none ? imagevisibility : ""}>
        <div
          style={{
            width: "clamp(40vw, calc(99.7vh * 4 / 3), 100vw)",
            height: "clamp(30vw, calc(99.7vh), 75vw)",
            position: "fixed",
            top: "0",
            left: "50%",
            transform: "translatex(-50%)",
            zIndex: "-6",
          }}
          // className={styles.image}
        >
          <Image
            id="currentimage"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // src={`compressed-images/${rndnum}.jpg`}
            src={imageSrc}
            alt="Current image"
            className={imagevisibility}
            style={{ objectFit: "contain" }}
            fill
            onLoad={onLoad}
            onError={handleImageError}
          />
        </div>

        {/* <img
          id="currentimage"
          // src={imageSrc}
          src={
            imageSrc
              ? `https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?cs=srgb&dl=pexels-francesco-ungaro-1525041.jpg&fm=jpg`
              : `https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/${rndnum}.jpg`
            // `compressed-images/${rndnum}.jpg`
          }
          // src={`https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?cs=srgb&dl=pexels-francesco-ungaro-1525041.jpg&fm=jpg`}
          // src={`compressed-images/${rndnum}.jpg`}
          className={imagevisibility}
          onError={handleImageError}
          style={isitloaded ? { display: "block" } : { display: "none" }}
          onLoad={onLoad}
          alt="Current image"
        ></img> */}
        <img
          src="Gray_circles_rotate.gif"
          className={isitloaded ? styles.none : styles.loadinggif}
        ></img>
      </div>
    </>
  );
};

export default CustomImage;
