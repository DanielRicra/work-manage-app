import { createFileRoute, Link } from '@tanstack/react-router'
import useSWR from 'swr'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Database } from '../../database.types'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/')({ component: App })
type Line = Database['public']['Tables']['lines']['Row']
function App() {
  const { data: lines, error, isLoading } = useSWR<any>('lines', async () => {
    const { data } = await supabase
      .from("lines")
      .select("*")

    return data || []
  })

  return (
    <main className="page-wrap px-4 pb-8 pt-14 h-[calc(100dvh-20rem)]">
      <h1 className="text-2xl font-bold">Choose the line you want to see the details of!</h1>
      {isLoading ? <div className="p-2 flex flex-row gap-2">
        <Skeleton className="h-10 w-16 mb-2 bg-accent" />
        <Skeleton className="h-10 w-16 mb-2 bg-accent" />
        <Skeleton className="h-10 w-16 mb-2 bg-accent" />
      </div> : lines && (
        <ul className="p-2 flex flex-row gap-2 w-full">
          {lines.map((line: Line) => (
            <li key={line.id}>
              <Link to="/line/$lineId" params={{ lineId: line.id }} className="flex">
                <Button variant="secondary" className="bg-accent px-4 text-lg capitalize font-bold p-2">{line.name}</Button>
              </Link>
            </li>
          ))}
        </ul>

      )}
      {error && <p>Error loading lines.</p>}
    </main>
  )
}
