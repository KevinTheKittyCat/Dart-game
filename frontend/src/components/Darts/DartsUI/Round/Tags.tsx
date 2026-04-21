import { Badge, Flex } from "@chakra-ui/react";



const tags = [
    { name: "Magnetic", color: "grey" },
    { name: "Accurate", color: "red" },
];

export function DartTags() {
    return (
        <Flex wrap={"wrap"} p={2} bg="#28282B" borderRadius={4}>
            {tags.map((tag, index) => (
                <Badge key={index} size="lg" m={1} bg={tag.color} color={"white"}>
                    {tag.name}
                </Badge>
            ))}
        </Flex>
    )
}