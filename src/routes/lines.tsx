import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lines')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lines"!</div>
}
