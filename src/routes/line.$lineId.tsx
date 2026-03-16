import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import useSWR from "swr";
import { Skeleton } from "#/components/ui/skeleton";
import { supabase } from "#/lib/supabase";
import { Button } from "@/components/ui/button";
import type { Database } from "../../database.types";

type ProductionEntry = Database['public']['Tables']['production_entries']['Row'];

export const Route = createFileRoute("/line/$lineId")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { lineId } = Route.useParams();
  const { data: lineDetails, error, isLoading } = useSWR<any>(`line-${lineId}`, async () => {
    const response = await supabase
      .from("lines")
      .select(`
        id, *,
        production_entries (
          id, oc, op, color, quantity, ep, entry_date, liquidation_status, completed_garments, std_mins
        )
        `)
      .eq("id", lineId)
      .single();
    return response.data;
  })

  const getStatusClasses = (status: string | null) => {
    switch (status) {
      case 'liquidated':
        return 'bg-green-700/30 border-green-500';
      case 'blocked':
        return 'bg-red-800/30 border-red-500';
      case 'pending':
        return 'bg-yellow-700/30 border-yellow-500';
      default:
        return 'bg-purple-800/10';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 page-wrap h-[calc(100dvh-20rem)] mt-14">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col gap-4 page-wrap h-[calc(100dvh-20rem)] mt-14">
        <p>Error loading line details.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 page-wrap h-[calc(100dvh-20rem)]">
      <main className="py-4 h-full">
        <h1 className="text-2xl font-extrabold mb-1 uppercase text-primary">{lineDetails?.name}</h1>
        <h2 className="my-1">Line Details</h2>
        <div>Description: {lineDetails?.description}</div>

        <div className="flex justify-between mt-3">
          <h3 className="text-xl font-semibold mt-4">Cortes:</h3>
          <Link to="/entries/new" className="mt-2">
            <Button>Add New Entry</Button>
          </Link>
        </div>

        <div className="grid gap-4 mt-2  py-4 rounded-lg">
          {lineDetails?.production_entries?.map((entry: ProductionEntry) => {
            const handleNavigate = async () => {
              await navigate({ to: "/entry/$entryId", params: { entryId: entry.id } });
            };
            const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleNavigate();
              }
            };
            return (
              <button
                key={entry.id}
                type="button"
                className={`p-4 border rounded-md tracking-wide hover:brightness-75 cursor-pointer text-left w-full ${getStatusClasses(entry.liquidation_status)}`}
                onClick={handleNavigate}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                aria-label={`View entry ${entry.id}`}
              >
                <div className="grid grid-cols-2 gap-2 text-base [&_strong]:text-gray-400 [&_strong]:font-medium">
                  <div><strong>OC:</strong> {entry.oc}</div>
                  <div><strong>OP:</strong> {entry.op}</div>
                  <div><strong>Color:</strong> {entry.color}</div>
                  <div><strong>Quantity:</strong> {entry.quantity}</div>
                  <div><strong>EP:</strong> {entry.ep}</div>
                  <div><strong>Completed Garments:</strong> {entry.completed_garments}</div>
                  <div><strong>Std Mins:</strong> {entry.std_mins}</div>
                  <div><strong>Liquidation Status:</strong> {entry.liquidation_status}</div>
                  <div><strong>STD mins left:</strong> {Math.round(entry.std_mins * (entry.quantity - (entry.completed_garments ?? 0)) * 100) / 100} </div>
                </div>
              </button>
            );
          })}
        </div>


      </main>
    </div>
  );
}
