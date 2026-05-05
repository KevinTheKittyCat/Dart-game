import { Flex, Text } from "@chakra-ui/react";
import { useRound } from "../../RoundContext";




export function ShotsLeft() {
    const { darts } = useRound();
    return (
        <Flex bg="#2b2a28" borderRadius={4} fontSize={32} 
            position={"absolute"} right={0} transform={"translate(110%, 50%)"}
        >
            <Flex gap={2} w="100%" p={2} color={"black"} bg="#ffffff" borderRadius={4} justifyContent="end" alignItems="center">
                <Text>{darts.length}</Text>
                <Text>Shots Left</Text>
            </Flex>
        </Flex>
    )
}