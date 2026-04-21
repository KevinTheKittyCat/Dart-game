import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRound } from "../../RoundContext";






export function DartsScore() {
    const { points } = useRound();
    const multiplier = 2; // Placeholder multiplier, replace with actual logic as needed
    return (
        <Flex direction="column" gap={2} fontSize={32}>
            <Flex gap={2} alignItems="center">
                <Score points={points} />
                X
                <Multiplier multiplier={multiplier} />
            </Flex>
            <TotalScore total={points * multiplier} />
        </Flex>
    )
}
function CountUp({ points }: { points: number }) {
    const [displayedPoints, setDisplayedPoints] = useState(points);


    useEffect(() => {
        //TODO: Fast start, slow end animation
        if (points !== displayedPoints) {
            const increment = (points - displayedPoints) / 20;
            let currentPoints = displayedPoints;
            const interval = setInterval(() => {
                currentPoints += increment;
                if ((increment > 0 && currentPoints >= points) || (increment < 0 && currentPoints <= points)) {
                    currentPoints = points;
                    clearInterval(interval);
                }
                setDisplayedPoints(Math.round(currentPoints));
            }, 50);
            return () => clearInterval(interval);
        }
    }, [points]);

    return <>{displayedPoints}</>;
}

function Score({ points }: { points?: number }) {

    return (
        <Flex w="100%" p={2} bg="#2d2d88" borderRadius={4} justifyContent="center">
            <CountUp points={points || 0} />
        </Flex>
    )
}

function Multiplier({ multiplier }: { multiplier?: number }) {
    return (
        <Flex w="100%" p={2} bg="#c2411d" borderRadius={4} justifyContent="center">
            <CountUp points={multiplier || 0} />
        </Flex>
    )
}

function TotalScore({ total }: { total?: number }) {
    return (
        <Flex w="100%" p={2} bg="#ffffff" color={"black"} borderRadius={4} justifyContent="center">
            <CountUp points={total || 0} />
        </Flex>
    )
}