"use client"

import * as React from "react"

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadList,
} from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Spinner } from "@/components/ui/spinner"

import { useUnitsImport, useUnitsTemplateDownload } from "../api"

interface UnitsImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UnitsImportDialog({
  open,
  onOpenChange,
}: UnitsImportDialogProps) {
  const [files, setFiles] = React.useState<File[]>([])

  const { mutate: importUnits, isPending: isImporting } = useUnitsImport()
  const { mutate: downloadTemplate, isPending: isDownloading } =
    useUnitsTemplateDownload()

  const isBusy = isImporting || isDownloading

  const handleSubmit = () => {
    const file = files[0]
    if (!file) return
    importUnits(file, {
      onSuccess: () => {
        setFiles([])
        onOpenChange(false)
      },
    })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader className="text-start">
          <ResponsiveDialogTitle>Import Units</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Upload a CSV file to import units. You can download a sample template
            to get started.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="py-1 pe-3">
          <div className="space-y-4">
            <div className="flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => downloadTemplate()}
                disabled={isBusy}
              >
                {isDownloading && <Spinner className="mr-2 size-4" />}
                Download sample CSV
              </Button>
            </div>

            <FileUpload
              value={files}
              onValueChange={setFiles}
              accept=".csv"
              maxFiles={1}
            >
              <FileUploadDropzone className="flex flex-col items-center justify-center gap-2 border-dashed p-8 text-center">
                <p className="text-sm font-medium">
                  Drop CSV here or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  Only .csv files, max 5MB.
                </p>
              </FileUploadDropzone>
              <FileUploadList>
                {files.map((file, index) => (
                  <FileUploadItem key={index} value={file}>
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                      >
                        <span className="sr-only">Delete</span>
                      </Button>
                    </FileUploadItemDelete>
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </FileUpload>
          </div>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isBusy || files.length === 0}
          >
            {isImporting && <Spinner className="mr-2 size-4" />}
            Import
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

