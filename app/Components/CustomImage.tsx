"use client";
import React, { useState, useEffect } from "react";
import styles from "./Style.module.css";
// import Image from "next/image";
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
  useEffect(() => {
    if (!isitconclusion && !isitpregame && !isitresults) {
      setisitloaded(false);
      setimagevisibility(styles.image);
    } else {
      setimagevisibility(styles.none);
    }
  }, [isitconclusion, isitresults, isitpregame]);
  useEffect(() => {
    // console.log("blink mode is", isitblinkmode);
    if (!isitresults && !isitpregame) {
      setisitloaded(true);
    }
    if (!isitresults && isitblinkmode && !isitresults) {
      let a = 0;
      const blinkmodeinterval = setInterval(() => {
        if (a >= 2) {
          setimagevisibility(styles.none);
          clearInterval(blinkmodeinterval);
        } else {
          console.log("a", a);
        }
        a++;
      }, 50);
    }
  }, [isitpregame]);
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
  }
  function onLoad() {
    if (!isitresults && isitblinkmode && !isitresults) {
      blink();
    }
    setisitloaded(true);
  }

  return (
    <>
      <div className={styles.background}></div>
      <div className={imagevisibility === styles.none ? imagevisibility : ""}>
        {/* <Image
          id="currentimage"
          src={`https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/${rndnum}.jpg`}
          alt="Current image"
          layout="fill" // Use layout="fill" for responsive images
          objectFit="contain"
          className={imagevisibility}
          onLoadingComplete={() => setisitloaded(true)} // Handle when the image is fully loaded
        /> */}
        <img
          id="currentimage"
          src={`https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/${rndnum}.jpg`}
          className={imagevisibility}
          style={isitloaded ? { display: "block" } : { display: "none" }}
          onLoad={onLoad}
          alt="Current image"
        ></img>
      </div>
    </>
  );
};

export default CustomImage;
