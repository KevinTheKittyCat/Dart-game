import { GameProvider } from "@/components/Darts/GameContext";
import { DartsCanvas3D } from "./Canvas/3DCanvas";
import { DartsUIMain } from "./DartsUI/DartsUIMain";
import { RoundProvider } from "./RoundContext";

export function DartsGame() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <GameProvider>
                <RoundProvider>
                    <DartsCanvas3D />
                    <DartsUIMain />
                </RoundProvider>
            </GameProvider>
        </div>
    );
}