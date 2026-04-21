import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Dart, ThrownDart } from "./functionality/interface";
import { useGame } from "./GameContext";

export interface RoundState {
    darts: Dart[];
    points: number;
    throws: number; // Throws made already, and what is hit.
    thrownDarts: ThrownDart[];
}

export type RoundFunctions = {
    startNewRound: () => void;
    addThrownDart: (dart: ThrownDart) => void;
}

export type RoundHelpers = {
    currentDart: Dart | null;
}

const defaultRoundState: RoundState = {
    darts: [],
    points: 0,
    throws: 0, // Throws made already, and what is hit.
    thrownDarts: []
};

const RoundContext = createContext<RoundState & RoundFunctions & RoundHelpers>({
    ...defaultRoundState,
} as RoundState & RoundFunctions & RoundHelpers);

export function RoundProvider({ children }: { children: React.ReactNode }) {
    const [round, setRound] = useState<RoundState>(defaultRoundState);
    const { darts } = useGame();
    const currentDart = useMemo(() => {
        if (!round.darts?.[0]) return null;
        return round.darts[0];
    }, [round.darts]);

    const startNewRound = useCallback(() => {
        // Random darts from inventory slots.
        let randomDarts = [...darts].sort(() => Math.random() - 0.5).slice(0, 3);

        setRound(current => ({
            ...current,
            darts: randomDarts,
        }));
    }, [darts]);

    const addThrownDart = useCallback((dart: ThrownDart) => {
        setRound(current => ({
            ...current,
            darts: current.darts.filter(d => d.id !== dart.parentId),
            thrownDarts: [...current.thrownDarts, dart],
            throws: current.throws + 1,
        }));
    }, [round]);

    return (
        <RoundContext.Provider value={{ ...round, startNewRound, addThrownDart, currentDart }}>
            {children}
        </RoundContext.Provider>
    );
}

export const useRound = () => {
    const context = useContext(RoundContext);
    if (!context) {
        throw new Error("useRound must be used within a RoundProvider");
    }
    return context;
}