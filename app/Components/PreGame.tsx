"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./conclusionpregame.module.css";
import Papa from "papaparse";

interface Props {
  isitpregame: boolean;
  totalscore: number;
  onstartclick: (blinkmode: boolean) => void;
}

const PreGame = ({ isitpregame, totalscore, onstartclick }: Props) => {
  const participants = useRef([["a", "a"]]);
  const normalmode = useRef([["a", "a"]]);
  const blinkmode = useRef([["a", "a"]]);
  const [leaderboard, setleaderboard] = useState<string[][]>([]);
  const currentparticipant = useRef<HTMLInputElement>(null);
  const [isblinkmodeon, setisblinkmodeon] = useState(false);
  const [isinputwrong, setisinputwrong] = useState(false);
  const aspectRatio = useRef(1);

  useEffect(() => {
    const updateAspectRatio = () => {
      if (typeof window !== "undefined") {
        aspectRatio.current = window.innerWidth / window.innerHeight;
      }
    };

    updateAspectRatio();
    window.addEventListener("resize", updateAspectRatio);

    return () => {
      window.removeEventListener("resize", updateAspectRatio);
    };
  }, []);

  function addparticipant() {
    let goodornah = true;
    participants.current.forEach((element) => {
      if (element[0] == currentparticipant.current?.value) {
        goodornah = false;
      }
    });
    if (
      currentparticipant.current &&
      currentparticipant.current.value.trim().length > 1 &&
      goodornah
    ) {
      onstartclick(isblinkmodeon);
      setisinputwrong(false);
    } else {
      setisinputwrong(true);
    }
  }
  useEffect(() => {
    if (isitpregame && totalscore) {
      let temp;
      if (currentparticipant.current) {
        temp = currentparticipant.current.value;
        currentparticipant.current.value = "";
      }
      const participantinformations = {
        name: temp,
        score: totalscore,
        blinkmode: isblinkmodeon,
      };
      const appendtocsv = async () => {
        try {
          const res = await fetch("/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(participantinformations),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Unknown error");
          }

          // console.log("Server Response:", data.message);
        } catch (error) {
          console.error("Error submitting score:", error);
        }
      };
      appendtocsv();
    }
  }, [isitpregame]);
  useEffect(() => {
    if (isblinkmodeon) {
      setleaderboard(blinkmode.current.slice(1, 51));
    } else {
      setleaderboard(normalmode.current.slice(1, 51));
    }
  }, [participants.current, isblinkmodeon]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/test.csv");
        const csvText = await response.text();

        Papa.parse<string[]>(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (result) => {
            participants.current = result.data;
            participants.current.forEach((element) => {
              if (element[2] === "true") {
                if (blinkmode.current.length === 1) {
                  blinkmode.current[0] = [element[0], element[1]];
                }
                blinkmode.current.push([element[0], element[1]]);
              } else if (element[2] === "false") {
                if (normalmode.current.length === 1) {
                  normalmode.current[0] = [element[0], element[1]];
                }
                normalmode.current.push([element[0], element[1]]);
              }
            });
            // console.log(blinkmode.current, normalmode.current);
          },
        });
      } catch (a) {
        console.log(a);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div className={isitpregame ? "" : styles.none}>
        {/* <p className={styles.inputinfo}></p> */}
        <input
          // className={aspectRatio <= 0.85 ? styles.none : styles.inputname}
          className={styles.inputname}
          ref={currentparticipant}
          style={{
            border: ` ${isinputwrong ? "2px solid #b42727" : "2px solid #ccc"}`,
          }}
          placeholder=" 3-30 Character Name"
        />
        {/* <span className={styles.alert}>THIS NAME IS ALREADY TAKEN</span> */}
        <button className={styles.start} onClick={addparticipant} id="start">
          <span className={styles.icon}>➤</span>
        </button>
        <div>
          <img
            src={"/Icons/ituailogo.png"}
            className={styles.logoimage}
            alt="ITU AI Logo"
          />
          <span className={styles.logoname}>
            ITUAI <br></br>ITUGuessr
          </span>
        </div>
        <div>
          <div className={styles.participantsListContainer}>
            <ol
              className={
                aspectRatio.current <= 0.85
                  ? styles.mobileparticipantlist
                  : styles.participantsList
              }
            >
              {leaderboard.map((participant, index) => (
                <li key={participant[0] || index}>
                  {" "}
                  <span
                    className={
                      aspectRatio.current <= 0.85
                        ? styles.mobilelistparticipant
                        : styles.listparticipant
                    }
                  >
                    {index + 1}.{participant[0]}
                  </span>
                  <span
                    className={
                      aspectRatio.current <= 0.85
                        ? styles.mobilelistscore
                        : styles.listscore
                    }
                  >
                    :{participant[1]}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div
            className={
              aspectRatio.current <= 0.85
                ? styles.mobileleaderboardinfo
                : styles.leaderboardinfo
            }
          >
            <strong>
              <span
                className={
                  aspectRatio.current <= 0.85
                    ? styles.mobileleaderboardinfopart
                    : styles.leaderboardinfopart
                }
              >
                {isblinkmodeon
                  ? "Blink Mode Leaderboard"
                  : "Normal Mode Leaderboard"}
              </span>
            </strong>
          </div>
        </div>
        <div>
          <span className={styles.blinkmodeexplainer}>
            Blink Mode: Shows the image briefly, then screen goes black.
          </span>
          <button
            className={styles.blinkmodeoffcontainer}
            onClick={() => setisblinkmodeon(!isblinkmodeon)}
          >
            <span
              className={
                isblinkmodeon
                  ? styles.blinkmodeonbutton
                  : styles.blinkmodeoffbutton
              }
            ></span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PreGame;
