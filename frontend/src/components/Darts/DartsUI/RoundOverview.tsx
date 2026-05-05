import { Flex } from "@chakra-ui/react";
import { CurrentDart } from "./Round/CurrentDart";
import { DartLineup } from "./Round/DartLineup";
import DartsMoney from "./Round/Money";
import { DartsScore } from "./Round/Score";
import { ShotsLeft } from "./Round/ShotsLeft";
import { DartsStartButton } from "./Round/Start";




export function RoundOverview(props: React.ComponentProps<typeof Flex>) {

    return (
        <Flex
            gap={4} pos={"relative"} direction={"column"}
            bg="#323239" color="white"
            w={400} h="100%"
            p={4} borderRadius={4}
            justify={"space-between"}
            {...props}>
            <Flex gap={4} direction={"column"}>
                <CurrentDart />
                <ShotsLeft />
                <DartLineup />
            </Flex>
            <Flex gap={4} direction={"column"}>
                <DartsScore />
                <DartsMoney />
                <DartsStartButton />
            </Flex>
        </Flex>
    )
}