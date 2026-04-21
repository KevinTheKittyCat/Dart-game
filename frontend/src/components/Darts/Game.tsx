import { DartsCanvas } from "@/components/Darts/Canvas";
import { GameProvider } from "@/components/Darts/GameContext";
import { DartsUIMain } from "./DartsUI/DartsUIMain";
import { RoundProvider } from "./RoundContext";

export function DartsGame() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <GameProvider>
                <RoundProvider>
                    <DartsCanvas />
                    <DartsUIMain />
                </RoundProvider>
            </GameProvider>
        </div>
    );
}