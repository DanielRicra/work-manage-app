import { createFileRoute } from '@tanstack/react-router'
import useSWR from "swr"
import { Skeleton } from "#/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { Database } from '../../database.types'
import { supabase } from '../lib/supabase'


export const Route = createFileRoute('/entry/$entryId')({
  component: RouteComponent,
})

type ProductionEntry = Database['public']['Tables']['production_entries']['Row']

const EntriesSkeleton = () => (
  <div className="flex flex-col gap-4 page-wrap h-[calc(100dvh-20rem)] mt-14">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-40 w-full" />
  </div>
)

function RouteComponent() {
  const { entryId } = Route.useParams()
  const { data: entryDetails, error, isLoading } = useSWR<ProductionEntry>(`entry-${entryId}`, async () => {
    const response = await supabase
      .from("production_entries")
      .select("*, packaging_breakdown(*)")
      .eq("id", entryId)
      .single();
    return response.data;
  })

  if (error) {
    return (
      <div className="flex flex-col gap-4 page-wrap h-[calc(100dvh-20rem)] mt-14">
        <p>Error loading line details.</p>
      </div>
    );
  }

  return (
    <div className="mx-14 mt-14 h-[calc(100dvh-24rem)]">
      <h1 className="text-2xl font-bold mb-3">Entry Details</h1>

      {isLoading ? <EntriesSkeleton /> : entryDetails && (
        <div className="flex flex-col gap-4 justify-start [&_div]:border-b [&_div]:border-amber-200/75">
          <div className="flex self-start gap-1"><strong>OC: </strong> {entryDetails.oc}</div>
          <div className="flex self-start gap-1"><strong>OP: </strong> {entryDetails.op}</div>
          <div className="flex self-start gap-1"><strong>Color: </strong> {entryDetails.color}</div>
          <div className="flex self-start gap-1"><strong>Quantity: </strong> {entryDetails.quantity}</div>
          <div className="flex self-start gap-1 "><strong>EP: </strong> {entryDetails.ep}</div>
          <div className="flex self-start gap-1"><strong>Entry Date: </strong> {entryDetails.entry_date ? new Date(entryDetails.entry_date).toLocaleDateString() : 'N/A'}</div>
          <div className="flex self-start gap-1"><strong>Liquidation Status: </strong> {entryDetails.liquidation_status}</div>
          <div className="flex self-start gap-1"><strong>Completed Garments: </strong> {entryDetails.completed_garments}</div>
          <div className="flex self-start gap-1"><strong>Standard Minutes: </strong> {entryDetails.std_mins}</div  >
          <div className="flex self-start gap-1"><strong>STD mins left: </strong> {Math.round(entryDetails.std_mins * (entryDetails.quantity - (entryDetails.completed_garments ?? 0)) * 100) / 100} </div>
        </div>
      )}
      Package breakdown
      <ul className="list-disc list-inside">
        <li>Package 1: 50 garments</li>
        <li>Package 2: 50 garments</li>
        <li>Package 3: 50 garments</li>
        <li>Package 4: 50 garments</li>
      </ul>
    </div>
  )
}