
import { Button } from "@chakra-ui/react";
import { gameEvents } from "../../../Common/Events";
import { useRound } from "../../RoundContext";





export function DartsStartButton() {
    const { startNewRound } = useRound();

    const onClick = () => {
        gameEvents.emit("roundEnd", null);
        //gameEvents.emit("addRelic", relics.slicer);
        startNewRound();
    }

    return (
        <Button color="primary" onClick={onClick}>
            Next Round
        </Button>
    );
}