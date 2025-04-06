"use client";
import React, { useState, useEffect, useRef } from "react";
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
  const [imageSrc, setImageSrc] = useState(
    `https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/${rndnum}.jpg`
  );
  const isitblinked = useRef(false);
  useEffect(() => {
    if (isitresults) {
      setisitloaded(false);
      isitblinked.current = false;
    }
    if (!isitconclusion && !isitpregame && !isitresults) {
      if (!isitblinked.current && isitblinkmode) {
        blink();
      }
      setimagevisibility(styles.image);
    } else {
      setimagevisibility(styles.none);
    }
    // console.log(isitblinked.current);
  }, [isitconclusion, isitresults, isitpregame]);
  useEffect(() => {
    // if (!isitresults && !isitpregame) {
    //   setisitloaded(true);
    // }
    if (!isitresults && isitblinkmode && !isitresults) {
      let a = 0;
      const blinkmodeinterval = setInterval(() => {
        if (a >= 2) {
          setimagevisibility(styles.none);
          clearInterval(blinkmodeinterval);
        } else {
          // console.log("a", a);
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
    isitblinked.current = true;
  }
  useEffect(() => {
    setImageSrc(
      `https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/${rndnum}.jpg`
    );
  }, [rndnum]);
  function onLoad() {
    if (!isitresults && isitblinkmode && !isitresults && !isitpregame) {
      blink();
    }
    setisitloaded(true);
  }
  function handleImageError() {
    console.error("image couldnt reload retry");
    setImageSrc("a");
    setImageSrc(
      `https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/${rndnum}.jpg`
    );
  }
  // console.log(isitloaded);
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
          src={imageSrc}
          // src={`https://pub-59d21c2a645a499d865c0405a00dce02.r2.dev/${rndnum}.jpg`}
          // src={`https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?cs=srgb&dl=pexels-francesco-ungaro-1525041.jpg&fm=jpg`}
          // src={`compressed-images/${rndnum}.jpg`}
          className={imagevisibility}
          onError={handleImageError}
          style={isitloaded ? { display: "block" } : { display: "none" }}
          onLoad={onLoad}
          alt="Current image"
        ></img>
        <img
          src="Gray_circles_rotate.gif"
          className={isitloaded ? styles.none : styles.loadinggif}
        ></img>
      </div>
    </>
  );
};

export default CustomImage;
