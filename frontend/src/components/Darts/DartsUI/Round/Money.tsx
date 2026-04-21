import { Flex, Text } from "@chakra-ui/react";
import { useGame } from "../../GameContext";





export default function DartsMoney() {
    const { currency } = useGame();
    return (
        <Flex bg="#2b2a28" borderRadius={4} fontSize={32}>
            <Flex gap={2} w="100%" p={2} bg="#ffb9153e" borderRadius={4} justifyContent="end" alignItems="center">
                <Text>{currency}</Text>
                <Text>$</Text>
            </Flex>
        </Flex>
    )
}