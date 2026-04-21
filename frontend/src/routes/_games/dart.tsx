import { DartsGame } from '@/components/Darts/Game';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_games/dart')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DartsGame />;
}
