import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import type { Database } from '../../database.types'


export const Route = createFileRoute('/')({ component: App })
type Line = Database['public']['Tables']['lines']['Row']

function App() {
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log("Llamando a Supabase manualmente...");
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("lines").select("*");
        if (error) throw error;
        setLines(data || []);
        console.log("Resultado manual:", data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  console.log("1. Componente App montado");
  console.log("3. Estado:", { isLoading, hasData: !!lines });
  return (
    <main className="page-wrap px-4 pb-8 pt-14 h-[calc(100dvh-20rem)]">
      <h1 className="text-2xl font-bold">Choose the line you want to see the details of!</h1>
      {isLoading && !lines ? <div className="p-2 flex flex-row gap-2">
        <Skeleton className="h-10 w-16 mb-2 bg-accent" />
        <Skeleton className="h-10 w-16 mb-2 bg-accent" />
        <Skeleton className="h-10 w-16 mb-2 bg-accent" />
      </div> : null}
      {lines && (
        <ul className="p-2 flex flex-row gap-2 w-full">
          {lines.map((line: Line) => (
            <li key={line.id}>
              <Link to="/line/$lineId" params={{ lineId: `${line.id}` }} className="flex">
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