import { usePreGameContext } from "@/context/PreGameContext";
import styles from "../styles/conclusionpregame.module.css";

import React from "react";

const Leaderboard = () => {
  const { BlinkModeLeaderboard, NormalModeLeaderboard } = usePreGameContext();
  return (
    <div>
      <div className={styles.participantsListContainer}>
        <ol
          className={
            aspectRatio <= 0.85
              ? styles.mobileparticipantlist
              : styles.participantsList
          }
        >
          {leaderboard.map((participant, index) => (
            <li key={participant[0] || index}>
              {" "}
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
            {isblinkmodeon
              ? "Blink Mode Leaderboard"
              : "Normal Mode Leaderboard"}
          </span>
        </strong>
      </div>
    </div>
  );
};

export default Leaderboard;
