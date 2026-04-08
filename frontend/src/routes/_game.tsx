import { Flex } from "@chakra-ui/react"
import { Outlet, createFileRoute } from "@tanstack/react-router"


export const Route = createFileRoute("/_game")({
  component: GameLayout,
})

function GameLayout() {
  return (
    <Flex direction="column" h="100vh" w="100vw" overflow="hidden">
      {/*<Navbar />*/}
      <Outlet />
    </Flex>
  )
}

export default GameLayout
