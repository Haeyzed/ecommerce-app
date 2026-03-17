"use client"

import Image from "next/image"
import { CheckCircle2, XCircle } from "lucide-react"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ImageZoom } from "@/components/ui/image-zoom"

import type { Product } from "../types"

interface ProductsViewDialogProps {
  currentRow: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsViewDialog({
                                     currentRow,
                                     open,
                                     onOpenChange,
                                   }: ProductsViewDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-3xl">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>Product Details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Comprehensive view of product information.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-2 pe-3 max-h-[75vh] overflow-y-auto">
          <ProductViewContent currentRow={currentRow} />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

function ProductViewContent({ currentRow }: { currentRow: Product }) {
  const images = currentRow.image_urls || []

  const BooleanFlag = ({ label, value }: { label: string; value: boolean }) => (
    <div className="flex items-center justify-between border-b pb-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {value ? (
        <CheckCircle2 className="size-4 text-green-500" />
      ) : (
        <XCircle className="size-4 text-muted-foreground/40" />
      )}
    </div>
  )

  const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="space-y-1">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value ?? "—"}</div>
    </div>
  )

  return (
    <div className="space-y-8 pb-4">
      {/* Images section */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Product Images</div>
          {images.length > 1 ? (
            <Carousel className="w-full max-w-sm mx-auto">
              <CarouselContent>
                {images.map((url, i) => (
                  <CarouselItem key={i}>
                    <div className="relative h-64 w-full overflow-hidden rounded-md border bg-muted">
                      <ImageZoom>
                        <Image
                          src={url}
                          alt={`${currentRow.name} - ${i + 1}`}
                          width={800}
                          height={600}
                          className="h-full w-full object-contain"
                          unoptimized
                        />
                      </ImageZoom>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            <div className="relative h-64 w-full max-w-sm mx-auto overflow-hidden rounded-md border bg-muted">
              <ImageZoom>
                <Image
                  src={images[0]}
                  alt={currentRow.name}
                  width={800}
                  height={600}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              </ImageZoom>
            </div>
          )}
        </div>
      )}

      {/* Main Info */}
      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">General Info</h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InfoItem label="Name" value={currentRow.name} />
          <InfoItem label="Code" value={currentRow.code} />
          <InfoItem label="Type" value={<Badge className="capitalize" variant="secondary">{currentRow.type}</Badge>} />
          <InfoItem label="Category" value={currentRow.category?.name} />
          <InfoItem label="Brand" value={currentRow.brand?.name} />
          <InfoItem label="Barcode" value={currentRow.barcode_symbology} />
        </div>
      </div>

      <Separator />

      {/* Pricing & Units */}
      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">Pricing & Inventory</h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoItem label="Price" value={`$${Number(currentRow.price).toFixed(2)}`} />
          <InfoItem label="Cost" value={currentRow.cost ? `$${Number(currentRow.cost).toFixed(2)}` : "—"} />
          <InfoItem label="Wholesale Price" value={currentRow.wholesale_price ? `$${Number(currentRow.wholesale_price).toFixed(2)}` : "—"} />
          <InfoItem label="Tax" value={currentRow.tax?.name ? `${currentRow.tax.name} (${currentRow.tax.rate}%)` : "—"} />
          <InfoItem label="In Stock" value={currentRow.qty} />
          <InfoItem label="Alert Quantity" value={currentRow.alert_quantity} />
          <InfoItem label="Base Unit" value={currentRow.unit?.name} />
          <InfoItem label="Sale Unit" value={currentRow.sale_unit?.name} />
        </div>
      </div>

      <Separator />

      {/* Flags & Configuration */}
      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">Configuration</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
          <BooleanFlag label="Active" value={currentRow.is_active} />
          <BooleanFlag label="Featured" value={currentRow.featured} />
          <BooleanFlag label="Sell Online" value={currentRow.is_online} />
          <BooleanFlag label="Track Inventory" value={currentRow.track_inventory} />
          <BooleanFlag label="In Stock Override" value={currentRow.in_stock} />
          <BooleanFlag label="Sync Disabled" value={currentRow.is_sync_disable} />
          <BooleanFlag label="Has Variants" value={currentRow.is_variant} />
          <BooleanFlag label="Has IMEI" value={currentRow.is_imei} />
          <BooleanFlag label="Is Recipe" value={currentRow.is_recipe} />
        </div>
      </div>

      <Separator />

      {/* Descriptions & SEO */}
      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">Details & SEO</h4>
        <div className="space-y-4">
          <InfoItem label="Short Description" value={currentRow.short_description} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem label="Meta Title" value={currentRow.meta_title} />
            <InfoItem label="Tags" value={currentRow.tags} />
          </div>
        </div>
      </div>
    </div>
  )
}