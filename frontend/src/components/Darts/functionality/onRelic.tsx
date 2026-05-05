import { useEffect } from "react";
import { gameEvents } from "../../Common/Events";
import { useGame } from "../GameContext";
import { useRound } from "../RoundContext";
import { Relic } from "./interface";






export function RelicEventListener() {
    const { setGame, ...game } = useGame();
    const { setRound, ...round } = useRound();

    const onAddRelic = (relic: Relic) => {
        console.log("executing relic:", relic.name);
        relic?.function(game, setGame, round, setRound);
    }

    useEffect(() => {
        gameEvents.on("addRelic", onAddRelic);

        return () => {
            gameEvents.off("addRelic", onAddRelic);
        }
    }, [game, round]);

    return null;
}
