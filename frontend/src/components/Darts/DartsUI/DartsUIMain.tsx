import { Flex } from "@chakra-ui/react";
import { useGame } from "../GameContext";
import { RoundOverview } from "./RoundOverview";
//import { useGame } from "../GameContext";
//import { useRound } from "../RoundContext";


export const UI_INDEX = 5;

export function DartsUIMain() {
    const { uiRef } = useGame();

    return (
        <Flex ref={uiRef}
            pointerEvents={"none"}
            zIndex={UI_INDEX}
            //w="100%"
            h="100vh"
            direction="column"
        //position="absolute" top={0} left={0}
        >
            <Flex w="100%" h="100%" pos={"relative"} direction="column" className="only-children-clickable">
                <RoundOverview />
                {/* Placeholder for the main UI, such as score display, round info, etc. */}
            </Flex>
        </Flex>
    );
}