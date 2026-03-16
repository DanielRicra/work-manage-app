import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react"
import useSWR from "swr"
import { Skeleton } from "#/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Database } from '../../database.types'
import { supabase } from '../lib/supabase'


export const Route = createFileRoute('/entry/$entryId')({
  component: RouteComponent,
})

type ProductionEntry = Database['public']['Tables']['production_entries']['Row'] & { packaging_breakdown: Database['public']['Tables']['packaging_breakdown']['Row'][] }

const EntriesSkeleton = () => (
  <div className="flex flex-col gap-4 page-wrap h-[calc(100dvh-20rem)] mt-14">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-40 w-full" />
  </div>
)

const Card = ({ label, value }: { label: string, value: string | number | null }) => (
  <div className="flex self-start gap-1 border border-amber-200/75 p-2 px-4 rounded font-bold">
    <strong>{label}: </strong> {value}
  </div>
)

function RouteComponent() {
  const [packageWithMeta, setPackageWithMeta] = useState<string | null>(null)
  const [metaMins, setMetaMins] = useState<number>(0)
  const { entryId } = Route.useParams()
  const { data: entryDetails, error, isLoading } = useSWR<ProductionEntry>(`entry-${entryId}`, async () => {
    const response = await supabase
      .from("production_entries")
      .select("*, packaging_breakdown(id, *)")
      .eq("id", entryId)
      .single();

    response.data?.packaging_breakdown.sort((a: any, b: any) => a.number - b.number) || []
    return response.data;
  })

  function calculateMeta() {
    if (!entryDetails) return;

    const goalInGarments = Math.floor(metaMins / entryDetails.std_mins);

    // a la catidad total le restamos las prendas confeccionadas, de ahi sumamos las prendas y calculamos en que paquete ce esa catidad, esa sera la meta a alcanzar
    const goal = goalInGarments + (entryDetails.completed_garments ?? 0);

    let count = 0;
    for (const breakdown of entryDetails.packaging_breakdown) {
      count += breakdown.quantity || 0;
      console.log(`Count: ${count}, Goal: ${goal}`);
      if (count >= goal) {
        setPackageWithMeta(`Debes alcanzar al menos el paquete número ${breakdown.number} (talla ${breakdown.size}) para cumplir tu meta de ${metaMins} minutos (${goalInGarments} prendas).`);
        return;
      }
    }
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 page-wrap h-[calc(100dvh-20rem)] mt-14 overflow-hidden overflow-y-scroll">
        <p>Error loading line details.</p>
      </div>
    );
  }

  return (
    <div className="mx-14 mt-14 h-[calc(100dvh-24rem)]">
      <h1 className="text-2xl font-bold mb-3">Entry Details {entryDetails?.liquidation_status === 'liquidated' ? '(🟢 Liquidated)' : entryDetails?.liquidation_status === 'pending' ? '(🟡 Pending)' : '(🔴 In Progress)'}</h1>

      {isLoading ? <EntriesSkeleton /> : entryDetails && (
        <div className="flex gap-4 justify-start flex-wrap my-8">
          <Card label="OC" value={entryDetails.oc} />
          <Card label="OP" value={entryDetails.op} />
          <Card label="Color" value={entryDetails.color} />
          <Card label="Quantity" value={entryDetails.quantity} />
          <Card label="EP" value={entryDetails.ep} />
          <Card label="Entry Date" value={entryDetails.entry_date ? new Date(entryDetails.entry_date).toLocaleDateString() : 'N/A'} />
          <Card label="Liquidation Status" value={entryDetails.liquidation_status} />
          <Card label="Completed Garments" value={entryDetails.completed_garments} />
          <Card label="Standard Minutes" value={entryDetails.std_mins} />
          <Card label="STD mins left" value={Math.round(entryDetails.std_mins * (entryDetails.quantity - (entryDetails.completed_garments ?? 0)) * 100) / 100} />
        </div>
      )}

      <h2 className="text-xl font-bold mb-3">Package breakdown</h2>

      <Table>
        <TableCaption>Completed 100% :v</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Number</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody  >
          {entryDetails?.packaging_breakdown.map((breakdown: any) => (
            <TableRow key={breakdown.id}>
              <TableCell className="font-medium">{breakdown.number}</TableCell>
              <TableCell>{breakdown.size}</TableCell>
              <TableCell>{breakdown.quantity}</TableCell>
              <TableCell className="text-right">{breakdown.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{entryDetails?.packaging_breakdown.reduce((sum, breakdown) => sum + (breakdown.quantity || 0), 0)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>


      <section className="my-5">
        <Field orientation="horizontal">
          <Input
            type="number"
            placeholder="Coloca los minutos.. (Jalemos Prenda Por prenda :V :V haha)"
            onChange={(e) => {
              const value = e.target.value;
              setMetaMins(value === "" ? 0 : Number(value));
            }}
          />
          <Button onClick={() => calculateMeta()}>Calcular Meta</Button>
        </Field>

        {packageWithMeta !== null && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <p className="text-green-800 font-bold">{packageWithMeta}</p>
          </div>
        )}
      </section>
    </div>
  )
}