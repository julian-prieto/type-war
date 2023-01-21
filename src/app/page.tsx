"use client";

import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { useFocusOnType } from "@/hooks/useFocusOnType";
import { useSocket } from "@/hooks/useSocket";

const message =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vulputate commodo convallis. Suspendisse potenti. Vivamus erat nisl, sodales non rutrum eget, convallis sed neque. Aenean tempor blandit est a viverra. Praesent et augue libero. Duis in mi quis augue tempor varius sit amet non urna. Aenean eros lacus, faucibus vel tortor nec, ultricies condimentum purus.";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  useFocusOnType(inputRef);
  const [gameState, setGameState] = useState<{
    playerName: string;
    gameRoom: string;
    playerText: string;
    playerTextStateArray: Array<boolean | undefined>;
    enemyPlayers: { [key: string]: number };
  }>(() => ({
    playerText: "",
    playerName: "",
    gameRoom: "",
    playerTextStateArray: Array.from({ length: message.length }),
    enemyPlayers: {},
  }));
  const [playerData, setPlayerData] = useState({
    username: "",
    room: "",
  });

  const onPlayerPositionChange = useCallback(({ position, user }) => {
    console.log("onPlayerPositionChange:", { position, user });
    setGameState((gs) => ({
      ...gs,
      enemyPlayers: {
        ...gs.enemyPlayers,
        [user]: position,
      },
    }));
  }, []);
  const { joinRoom, changePlayerPosition } = useSocket({ onPlayerPositionChange });

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
      // Disallow more letters if there is already an error
      if (gameState.playerTextStateArray.some((l) => l === false)) return;

      if (isLetterCorrect(value[letterIndexToCompare], message[letterIndexToCompare])) {
        newPlayerTextStateArray[letterIndexToCompare] = true;
      } else {
        newPlayerTextStateArray[letterIndexToCompare] = false;
      }
    }
    console.log("about to change position");
    changePlayerPosition({ position: value.length, room: gameState.gameRoom, user: gameState.playerName });

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
      {(!gameState.playerName || !gameState.gameRoom) && (
        <div className="flex flex-col space-y-8">
          <label>
            Name
            <input
              className="text-black"
              placeholder="John Doe..."
              value={playerData.username}
              onChange={(e) => setPlayerData((p) => ({ ...p, username: e.target.value }))}
            />
          </label>
          <label>
            Room
            <input
              className="text-black"
              placeholder="Join room..."
              value={playerData.room}
              onChange={(e) => setPlayerData((p) => ({ ...p, room: e.target.value }))}
            />
          </label>
          <button
            onClick={() => {
              setGameState((p) => ({ ...p, playerName: playerData.username, gameRoom: playerData.room }));
              joinRoom(playerData.room);
            }}
          >
            Join game room
          </button>
        </div>
      )}
      {gameState.playerName && gameState.gameRoom && (
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

              return (
                <div key={letterIndex} className="relative">
                  {letterIndex === gameState.playerText.length && <Cursor />}
                  {Object.entries(gameState.enemyPlayers).map(
                    ([player, position]) => letterIndex === position && <EnemyPlayer key={player} />
                  )}
                  <Letter value={letter} state={state} />
                </div>
              );
            })}
          </div>
          <input
            ref={inputRef}
            value={gameState.playerText}
            onInput={handlePlayerTextChange}
            className="mt-4 bg-white/10 w-[1px] h-[1px] opacity-0"
          />
        </div>
      )}
    </main>
  );
}

const Cursor = () => {
  return <span className="w-[2px] h-4 absolute animate-wiggle bg-yellow-300" />;
};

const EnemyPlayer = () => {
  return <span className="w-[2px] h-4 absolute animate-wiggle bg-green-300" />;
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
