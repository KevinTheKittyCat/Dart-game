import { createFileRoute } from '@tanstack/react-router'
import { DartsUIMain } from '../../components/Darts/DartsUI/DartsUIMain'

export const Route = createFileRoute('/_games/dartUi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DartsUIMain />
}
