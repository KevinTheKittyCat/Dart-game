import { createContext, useContext, useState } from "react";
import { Dart, dartboardRadius, Relic } from "./functionality/interface";
import { RoundState } from "./RoundContext";

const defaultGameState: GameState = {
    round: 0,
    darts: [new Dart(), new Dart(), new Dart()],
    previousRounds: [],
    relics: [],
    currency: 0,
    accuracy: 250 * (dartboardRadius / 300),

    throws: 3,

    totalThrows: 0,
    totalPoints: 0,
}
const GameContext = createContext<GameState>(defaultGameState);

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
}

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [game, setGame] = useState<GameState>(defaultGameState);
    return (
        <GameContext.Provider value={game}>
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