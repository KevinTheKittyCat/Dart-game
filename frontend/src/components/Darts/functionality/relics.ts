import { generateDartBoardSegments } from "../GameContext";






export const relics = {
    slicer: {
        name: "Slicer",
        describtion: "Divides the dart board into 30 segments instead of 20.",
        function: (game, setGame, round, setRound) => {
            setGame(prev => ({
                ...prev,
                dartBoard: generateDartBoardSegments(30),
            }));
        }
    }

}