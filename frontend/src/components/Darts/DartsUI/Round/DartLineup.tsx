import { Flex } from "@chakra-ui/react";
import { useRound } from "../../RoundContext";





export function DartLineup() {
    const { darts, currentDart } = useRound();
    return (
        <Flex
            gap={4} direction={"column"}
            pos="absolute" top={0} right={0}
            translate="50% 0"
            transform={"scaleX(-1)"}
            w="100%"
            zIndex={-1}
        >
            {darts.map((dart) => {
                //if (dart.id === currentDart?.id) return null; // Don't show the current dart in the lineup
                return (
                    <Flex key={dart.id} w="100%" opacity={dart.id === currentDart?.id ? 0 : 1}>
                        <img src="assets/darts/Dart-placeholder.png" alt="Current Dart" height="100%" />
                    </Flex>
                );
            })}
        </Flex>
    )
}