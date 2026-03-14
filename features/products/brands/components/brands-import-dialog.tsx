"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CloudUpload, Download, FileText } from "lucide-react"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import {
  useBrandsImport,
  useBrandsTemplateDownload,
} from "../api"
import {
  brandImportSchema,
  type BrandImportFormData,
} from "../schemas"
import { BrandsCsvPreviewDialog } from "./brands-csv-preview-dialog"

interface BrandsImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split("\n").filter((line) => line.trim() !== "")
  if (lines.length === 0) return []
  const headers = lines[0].split(",").map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(",")
    return headers.reduce(
      (obj, header, i) => {
        obj[header] = values[i]?.trim() ?? ""
        return obj
      },
      {} as Record<string, string>
    )
  })
}

export function BrandsImportDialog({
  open,
  onOpenChange,
}: BrandsImportDialogProps) {
  const { mutate: importBrands, isPending } = useBrandsImport()
  const { mutate: downloadTemplate, isPending: isDownloading } =
    useBrandsTemplateDownload()

  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [previewData, setPreviewData] = React.useState<Record<string, string>[]>([])

  const form = useForm<BrandImportFormData>({
    resolver: zodResolver(brandImportSchema),
    defaultValues: { file: [] },
  })

  const handlePreview = (data: BrandImportFormData) => {
    const file = data.file[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = (e.target?.result as string) ?? ""
        setPreviewData(parseCSV(text))
        setPreviewOpen(true)
      }
      reader.readAsText(file)
    }
  }

  const handleConfirmImport = () => {
    const file = form.getValues().file[0]
    if (file) {
      importBrands(file, {
        onSuccess: () => {
          setPreviewOpen(false)
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      form.reset()
      setPreviewOpen(false)
    }
    onOpenChange(value)
  }

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
        <ResponsiveDialogContent className="sm:max-w-md">
          <ResponsiveDialogHeader className="text-start">
            <ResponsiveDialogTitle>Import Brands</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Bulk create brands by uploading a CSV file.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <form
            id="import-form"
            onSubmit={form.handleSubmit(handlePreview)}
            className="grid gap-4 py-4"
          >
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => downloadTemplate()}
                disabled={isDownloading}
                className="text-muted-foreground"
              >
                {isDownloading ? (
                  <>
                    <Spinner className="mr-2" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 size-4" />
                    Download Sample CSV
                  </>
                )}
              </Button>
            </div>

            <FieldGroup>
              <div className="space-y-2 rounded-md border bg-muted/50 p-3 text-sm">
                <div className="font-medium">Required: name</div>
                <div className="text-muted-foreground">
                  Optional: short_description, image_url, page_title
                </div>
              </div>

              <Controller
                control={form.control}
                name="file"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="import-file">Upload File</FieldLabel>
                    <FileUpload
                      value={field.value}
                      onValueChange={field.onChange}
                      accept=".csv,text/csv,application/vnd.ms-excel"
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024}
                      onFileReject={(_file, message) => {
                        form.setError("file", { message })
                      }}
                    >
                      <FileUploadDropzone className="flex flex-col items-center justify-center gap-2 border-dashed p-8 text-center">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <CloudUpload className="size-5" />
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-primary">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                          <br />
                          <span className="text-muted-foreground">
                            CSV (max 5MB)
                          </span>
                        </div>
                        <FileUploadTrigger asChild>
                          <Button variant="link" size="sm" className="sr-only">
                            Select file
                          </Button>
                        </FileUploadTrigger>
                      </FileUploadDropzone>
                      <FileUploadList>
                        {(field.value ?? []).map((file, index) => (
                          <FileUploadItem key={index} value={file} className="w-full">
                            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                              <FileText className="size-4" />
                            </div>
                            <FileUploadItemPreview className="hidden" />
                            <FileUploadItemMetadata className="ml-2 flex-1" />
                            <FileUploadItemDelete asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-muted-foreground hover:text-destructive"
                              >
                                <span className="sr-only">Remove</span>
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    </FileUpload>
                    <FieldDescription>
                      Upload the file containing your brand data.
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <ResponsiveDialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="import-form"
              disabled={!form.formState.isValid || isPending}
            >
              Preview Data
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <BrandsCsvPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={previewData}
        onConfirm={handleConfirmImport}
        isPending={isPending}
      />
    </>
  )
}
