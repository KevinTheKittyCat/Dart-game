import { GameProvider } from "@/components/Darts/GameContext";
import { Flex } from "@chakra-ui/react";
import { DartsCanvas3D } from "./Canvas/3DCanvas";
import { DartsUIMain } from "./DartsUI/DartsUIMain";
import { RoundProvider } from "./RoundContext";

export function DartsGame() {
    return (
        <Flex style={{ width: '100%', height: '100%' }}>
            <GameProvider>
                <RoundProvider>
                    <DartsUIMain />
                    <DartsCanvas3D />
                </RoundProvider>
            </GameProvider>
        </Flex>
    );
}