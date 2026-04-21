
import { Button } from "@chakra-ui/react";
import { useRound } from "../RoundContext";







export function DartsStartButton() {
    const { startNewRound } = useRound();

    return (
        <Button color="primary" onClick={() => startNewRound()}>
            Start Game
        </Button>
    );
}