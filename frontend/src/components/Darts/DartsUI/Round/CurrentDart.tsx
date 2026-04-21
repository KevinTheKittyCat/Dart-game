import { Flex, Image } from "@chakra-ui/react";
import { useRound } from "../../RoundContext";
import { DartSkills } from "./Skills";
import { DartTags } from "./Tags";




export function CurrentDart() {
    const { currentDart } = useRound();
    return (
        <Flex gap={2} direction={"column"} color="white" borderRadius={4}>
            <Flex
                gap={2} direction={"column"}
                color="white" borderRadius={4} bg="#262630"
                boxShadow="inset 0 4px 5px 6px #05040b3e"
                key={currentDart ? currentDart.id : "placeholder"}
            >
                <Image animation={currentDart ? "animate-dart-in 0.5s ease-out" : undefined}
                    transform="scaleX(-1)" opacity={currentDart ? 1 : 0}
                    src="assets/darts/Dart-placeholder.png" alt="Current Dart" height="100%"
                />
            </Flex>
            {/* TODO: Image/3d model of dart*/}
            <DartSkills />
            <DartTags />
        </Flex>
    )
}