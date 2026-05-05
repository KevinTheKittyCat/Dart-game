import { createContext, useContext, useEffect, useRef, useState } from "react";
import { gameEvents } from "../Common/Events";
import { Dart, DartBoardSegment, Relic } from "./functionality/interface";
import { RoundState } from "./RoundContext";


export function generateDartBoardSegments(amount: number) {
    const numbers = new Array(amount).fill(0);
    return numbers.map((_, i) => {
        const angleStep = 360 / numbers.length;
        const offsetToPut20AtTop = angleStep / 2 + 90;
        const rotation = i * angleStep - offsetToPut20AtTop;
        return new DartBoardSegment({
            index: i,
            value: i + 1,
            rotation,
            offset: offsetToPut20AtTop,
            isEven: i % 2 === 0,
            angleStep,
        });
    });
}

const defaultGameState: GameState = {
    round: 0,
    darts: [new Dart(), new Dart(), new Dart()],
    previousRounds: [],
    relics: [],
    currency: 0,
    accuracy: 1,//250 * (dartboardRadius / 300),

    throws: 3,

    totalThrows: 0,
    totalPoints: 0,

    dartBoard: generateDartBoardSegments(20),
}
const GameContext = createContext<GameState & ExtraGameContext>({} as GameState & ExtraGameContext);

type ExtraGameContext = {
    uiRef: React.RefObject<HTMLDivElement>;
    addRelic: (relic: Relic) => void;
}

export interface GameState {
    round: number;
    darts: Dart[];
    previousRounds: RoundState[];
    relics: Relic[]; // Placeholder for relics or power-ups
    accuracy: number; // Base accuracy for throws, can be modified by relics or upgrades

    currency: number; // Currency for upgrades or purchases

    // TODO: SEe if we want to base the game on having 15 different "darts", or having 1-5 "slots" that they replace and upgrade.
    throws: number; // Throws per round.

    totalThrows: number; // Total throws made in the game, can be used for stats or achievements
    totalPoints: number; // Total points scored across all rounds

    dartBoard: DartBoardSegment[]; // Pre-calculated segments of the dartboard for hit detection
}

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [game, setGame] = useState<GameState>(defaultGameState);
    const uiRef = useRef<HTMLDivElement>(null); // Reference to the UI layer for potential future use, such as measuring dimensions or attaching events
    
    
    const addRelic = (relic: Relic) => {
        console.log("Adding relic:", relic.name);
        setGame(prev => ({
            ...prev,
            relics: [...prev.relics, relic],
        }));
    }

    useEffect(() => {
        gameEvents.on("addRelic", addRelic);

        return () => {
            gameEvents.off("addRelic", addRelic);
        }
    }, []);
    
    return (
        <GameContext.Provider value={{ ...game, uiRef, addRelic, setGame }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}