import { useGameState } from "@/context/gamestatecontext";
export function useChangeGameState() {
  const {
    isitconclusion,
    isitresults,
    setisitconclusion,
    setisitpregame,
    setisitresults,
  } = useGameState();
  function handleKeyDown(ismarkeronmap: boolean, rounds: number) {
    console.log(isitresults);
    if (isitresults) {
      setisitresults(false);
      if (rounds === 5) {
        setisitconclusion(true);
      }
    } else if (isitconclusion) {
      setisitconclusion(false);
      setisitpregame(true);
    } else if (ismarkeronmap) {
      setisitresults(true);
    }
  }
  // function handlePregameskip(user: string, blinkmode: boolean) {}
  return { handleKeyDown };
}
