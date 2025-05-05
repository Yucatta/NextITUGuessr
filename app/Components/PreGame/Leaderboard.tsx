import styles from "@/app/styles/conclusionpregame.module.css";
import { usePreGameContext } from "@/context/PreGameContext";
import React, { useEffect } from "react";
import { useGameState } from "@/context/gamestatecontext";
import { useAPIcalls } from "@/app/hooks/APIcalls";

// interface Props {
//   blinkmode: boolean;
// }

const Leaderboard = () => {
  const { aspectRatio } = useGameState();
  const { BlinkModeLeaderboard, NormalModeLeaderboard, blinkmode } =
    usePreGameContext();

  const { fetchCsv } = useAPIcalls();
  useEffect(() => {
    fetchCsv();
  }, []);
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
          {(blinkmode
            ? BlinkModeLeaderboard.slice(0, 50)
            : NormalModeLeaderboard.slice(0, 50)
          ).map((participant, index) => (
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
            {blinkmode ? "Blink Mode Leaderboard" : "Normal Mode Leaderboard"}
          </span>
        </strong>
      </div>
    </div>
  );
};

export default Leaderboard;
