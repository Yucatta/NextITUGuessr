import React, { useRef, useState } from "react";
import styles from "@/app/styles/conclusionpregame.module.css";
import { useInputSubmittion } from "@/app/hooks/NicknameSubmittion";
import { usePreGameContext } from "@/context/itwas238charactersandgitcouldntreadskillissue";

interface Props {}
const PreGameInput = () => {
  const [isinputwrong, setisinputwrong] = useState(false);
  const currentparticipant = useRef<HTMLInputElement>(null);
  const { addparticipant } = useInputSubmittion();
  const { blinkmode } = usePreGameContext();
  function addparticipantbutitsinthisfileinsteadofhookbecaueseithastobelikethattherewasnhowayinconceviableuniversethatitcanbeannydifferentitsmostefficientandonlywaythatcanbemade() {
    let temp: boolean;
    temp = addparticipant(currentparticipant.current?.value, blinkmode);
    setisinputwrong(temp);
  }
  return (
    <>
      {/* <p className={styles.inputinfo}></p> */}
      <input
        // className={aspectRatio <= 0.85 ? styles.none : styles.inputname}
        className={styles.inputname}
        ref={currentparticipant}
        style={{
          border: ` ${isinputwrong ? "2px solid #b42727" : "2px solid #ccc"}`,
        }}
        placeholder="Your Username"
      />
      {/* <span className={styles.alert}>THIS NAME IS ALREADY TAKEN</span> */}
      <button
        className={styles.start}
        onClick={
          addparticipantbutitsinthisfileinsteadofhookbecaueseithastobelikethattherewasnhowayinconceviableuniversethatitcanbeannydifferentitsmostefficientandonlywaythatcanbemade
        }
        id="start"
      >
        <span className={styles.icon}>➤</span>
      </button>
    </>
  );
};

export default PreGameInput;
