import { Badge, Flex } from "@chakra-ui/react";


const skills = [
    { name: "Skill 1", color: "blue" },
    { name: "Skill 2", color: "red" },
];

export function DartSkills() {
    return (
        <Flex wrap={"wrap"} p={2} bg="#28282B" borderRadius={4}>
            {skills.map((skill, index) => (
                <Badge key={index} size="lg" m={1} bg={skill.color} color={"white"}>
                    {skill.name}
                </Badge>
            ))}
        </Flex>
    )
}