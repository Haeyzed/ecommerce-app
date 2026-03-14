"use client"

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react"

interface BrandsCsvPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: Record<string, string>[]
  onConfirm: () => void
  isPending: boolean
}

export function BrandsCsvPreviewDialog({
  open,
  onOpenChange,
  data,
  onConfirm,
  isPending,
}: BrandsCsvPreviewDialogProps) {
  const headers = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-w-2xl">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>Preview import data</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            First 5 rows. Confirm to import {data.length} row(s).
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="max-h-[50vh] overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="capitalize">
                    {header.replace(/_/g, " ")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 5).map((row, i) => (
                <TableRow key={i}>
                  {headers.map((header) => (
                    <TableCell
                      key={`${i}-${header}`}
                      className="max-w-[200px] truncate"
                    >
                      {row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {data.length > 5 && (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className="text-center text-muted-foreground"
                  >
                    ... and {data.length - 5} more rows
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Confirm import"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
