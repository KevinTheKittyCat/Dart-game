import { DartsCanvas } from '@/components/Darts/Canvas';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_games/dart')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DartsCanvas />;
}
