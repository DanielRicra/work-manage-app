import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/entry/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/entry/new"!</div>
}
