import { Flex, Text } from "@chakra-ui/react";
import { useRound } from "../RoundContext";
import { CurrentDart } from "./CurrentDart.tsx/CurrentDart";
import { DartsStartButton } from "./Start";




export function CurrentDarts(props: React.ComponentProps<typeof Flex>) {
    const { darts } = useRound();

    return (
        <Flex direction={"column"} bg="red" w={200} h="fit-content" {...props}>
            <CurrentDart />
            {darts.map((dart, index) => (
                <Flex key={index} bg="red" w={50} h={50} m={1} justify="center" align="center">
                    <Text>{dart.id}</Text>
                </Flex>
            ))}
            <DartsStartButton />
        </Flex>
    )
}