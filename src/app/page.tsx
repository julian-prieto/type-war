"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useFocusOnType } from "@/hooks/useFocusOnType";

const message =
  "Trámite póstumo ipsum dolor sit amet, consectetur adipiscing elit. Morbi vulputate commodo convallis. Suspendisse potenti. Vivamus erat nisl, sodales non rutrum eget, convallis sed neque. Aenean tempor blandit est a viverra. Praesent et augue libero. Duis in mi quis augue tempor varius sit amet non urna. Aenean eros lacus, faucibus vel tortor nec, ultricies condimentum purus.";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  useFocusOnType(inputRef);
  const [gameState, setGameState] = useState<{
    playerText: string;
    playerTextStateArray: Array<boolean | undefined>;
  }>(() => ({
    playerText: "",
    playerTextStateArray: Array.from({ length: message.length }),
  }));

  const isLetterCorrect = (userLetter: string, messageLetter: string) => {
    return userLetter === messageLetter;
  };

  const isPastingLongWords = (userValue: string, playerText: string) => {
    return userValue.length > playerText.length + 1;
  };

  const isLongerThanOriginalMessage = (userValue: string, messageText: string) => {
    return userValue.length > messageText.length;
  };

  const isDeleting = (userValue: string, playerText: string) => {
    return userValue.length < playerText.length;
  };

  const handlePlayerTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    // Disable pasting long phrases
    if (isPastingLongWords(value, gameState.playerText)) return;

    // Disable writing more than the original message
    if (isLongerThanOriginalMessage(value, message)) return;

    const newPlayerTextStateArray = [...gameState.playerTextStateArray];
    const letterIndexToCompare = value.length - 1;

    if (isDeleting(value, gameState.playerText)) {
      // Clean deleted letters state
      newPlayerTextStateArray.fill(undefined, value.length);
    } else {
      // // Disallow more letters if there is already an error
      // if (gameState.playerTextStateArray.some((l) => l === false)) return;

      if (isLetterCorrect(value[letterIndexToCompare], message[letterIndexToCompare])) {
        newPlayerTextStateArray[letterIndexToCompare] = true;
      } else {
        newPlayerTextStateArray[letterIndexToCompare] = false;
      }
    }

    setGameState((prevGameState) => ({
      ...prevGameState,
      playerText: value,
      playerTextStateArray: newPlayerTextStateArray,
    }));
  };

  // useEffect(() => {
  //   console.log("gameState.playerTextStateArray>>>", gameState.playerTextStateArray);
  // }, [gameState.playerTextStateArray]);
  // useEffect(() => {
  //   console.log("gameState.playerText>>>", gameState.playerText);
  // }, [gameState.playerText]);

  return (
    <main>
      <div>
        <div className="flex flex-wrap text-xl select-none">
          {Array.from(message).map((letter, letterIndex) => {
            let state: "untouched" | "correct" | "wrong" = "untouched";
            const letterState = gameState.playerTextStateArray[letterIndex];

            if (letterState === true) {
              state = "correct";
            } else if (letterState === false) {
              state = "wrong";
            }

            if (letterIndex === gameState.playerText.length) {
              return (
                <div key={letterIndex} className="relative">
                  <Cursor />
                  <Letter value={letter} state={state} />
                </div>
              );
            }

            return <Letter key={letterIndex} value={letter} state={state} />;
          })}
        </div>
        <input
          ref={inputRef}
          value={gameState.playerText}
          onInput={handlePlayerTextChange}
          className="mt-4 bg-white/10 w-[1px] h-[1px] opacity-0"
        />
      </div>
    </main>
  );
}

const Cursor = () => {
  return <span className="w-[2px] h-4 absolute animate-wiggle bg-yellow-300" />;
};

interface LetterProps {
  value: string;
  state: "untouched" | "correct" | "wrong";
}

const Letter = ({ value, state }: LetterProps) => {
  const letter = value === " " ? <LetterSpace isWrong={state === "wrong"} /> : value;
  const style = {
    untouched: "text-white/20",
    correct: "text-white",
    wrong: "text-red-500",
  };
  return <span className={style[state]}>{letter}</span>;
};

const LetterSpace = ({ isWrong }: { isWrong: boolean }) =>
  isWrong ? <span className="bg-red-500">&nbsp;</span> : <>&nbsp;</>;
