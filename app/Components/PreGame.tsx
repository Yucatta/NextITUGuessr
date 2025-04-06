"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./conclusionpregame.module.css";
import Papa from "papaparse";

interface Props {
  isitpregame: boolean;
  totalscore: number;
  onstartclick: (blinkmode: boolean) => void;
}

const PreGame = ({ isitpregame, onstartclick }: Props) => {
  const participants = useRef([["a", "a"]]);
  const [sortedParticipants, setSortedParticipants] = useState<string[][]>([]);
  const currentparticipant = useRef<HTMLInputElement>(null);
  const [isblinkmodeon, setisblinkmodeon] = useState(false);
  const [updater, setupdater] = useState(1);
  const aspectRatio = window.innerWidth / window.innerHeight;

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
    }
  }

  useEffect(() => {
    if (participants.current.length > 0) {
      const sorted = [...participants.current].sort(
        (a, b) => Number(b[1]) - Number(a[1])
      );
      setSortedParticipants(sorted.slice(1, 51));
    }
  }, [participants.current]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/Participants.csv");
        const csvText = await response.text();

        Papa.parse<string[]>(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (result) => {
            participants.current = result.data;
          },
        });
      } catch (a) {
        console.log(a);
        console.log(updater);
      }
    };
    fetchData();
    let a = 1;
    setInterval(() => {
      a++;
      setupdater(a);
    }, 250);
  }, []);
  return (
    <>
      <div className={isitpregame ? "" : styles.none}>
        {/* <p className={styles.inputinfo}></p> */}
        <input
          // className={aspectRatio <= 0.85 ? styles.none : styles.inputname}
          className={styles.inputname}
          ref={currentparticipant}
          placeholder="  Enter Your Name"
        />
        <button className={styles.start} onClick={addparticipant} id="start">
          {">"}
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
                aspectRatio <= 0.85
                  ? styles.mobileparticipantlist
                  : styles.participantsList
              }
            >
              {sortedParticipants.map((participant, index) => (
                <li key={participant[0] || index}>
                  {" "}
                  {/* Use participant[0] if it's unique, fallback to index */}
                  <span
                    className={
                      aspectRatio <= 0.85
                        ? styles.mobilelistparticipant
                        : styles.listparticipant
                    }
                  >
                    {index + 1}.{participant[0]}
                  </span>
                  <span
                    className={
                      aspectRatio <= 0.85
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
              aspectRatio <= 0.85
                ? styles.mobileleaderboardinfo
                : styles.leaderboardinfo
            }
          >
            <strong>
              <span
                className={
                  aspectRatio <= 0.85
                    ? styles.mobileleaderboardinfopart
                    : styles.leaderboardinfopart
                }
              >
                {" "}
                Participant
              </span>
              <span className={styles.leaderboardinfoscor}>Score</span>
            </strong>
          </div>
        </div>
        <div>
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
            <span
              className={
                aspectRatio <= 0.85 ? styles.none : styles.blinkmodeexplainer
              }
            >
              With Blink Mode image shows up for only 0.1 seconds
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PreGame;
