// components/cropper-file-upload.tsx
"use client"

import { CropIcon, UploadIcon, XIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Cropper,
  CropperArea,
  type CropperAreaData,
  CropperImage,
  type CropperPoint,
  type CropperProps,
} from "@/components/ui/cropper"
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

type OnFileReject = (file: File, message: string) => void

async function createCroppedImage(
  imageSrc: string,
  cropData: CropperAreaData,
  fileName: string,
  mimeType: string
): Promise<File> {
  const image = new Image()
  image.crossOrigin = "anonymous"

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      canvas.width = cropData.width
      canvas.height = cropData.height

      ctx.drawImage(
        image,
        cropData.x,
        cropData.y,
        cropData.width,
        cropData.height,
        0,
        0,
        cropData.width,
        cropData.height
      )

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"))
          return
        }

        const croppedFile = new File([blob], `cropped-${fileName}`, {
          type: mimeType || "image/png",
        })
        resolve(croppedFile)
      }, mimeType || "image/png")
    }

    image.onerror = () => reject(new Error("Failed to load image"))
    image.src = imageSrc
  })
}

interface FileWithCrop {
  original: File
  cropped?: File
}

export interface CropperFileUploadProps {
  value?: File[]
  onValueChange?: (files: File[]) => void
  accept?: string
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
  className?: string
  onFileReject?: OnFileReject
}

export function CropperFileUpload({
  value,
  onValueChange,
  accept = "image/*",
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  multiple,
  className,
  onFileReject,
}: CropperFileUploadProps) {
  const [files, setFiles] = React.useState<File[]>(value ?? [])
  const [filesWithCrops, setFilesWithCrops] = React.useState<
    Map<string, FileWithCrop>
  >(new Map())
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [crop, setCrop] = React.useState<CropperPoint>({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedArea, setCroppedArea] = React.useState<CropperAreaData | null>(
    null
  )
  const [showCropDialog, setShowCropDialog] = React.useState(false)

  React.useEffect(() => {
    if (value) setFiles(value)
  }, [value])

  const selectedImageUrl = React.useMemo(() => {
    if (!selectedFile) return null
    return URL.createObjectURL(selectedFile)
  }, [selectedFile])

  React.useEffect(
    () => () => {
      if (selectedImageUrl) URL.revokeObjectURL(selectedImageUrl)
    },
    [selectedImageUrl]
  )

  const emitFiles = React.useCallback(
    (filesMap: Map<string, FileWithCrop>) => {
      const result: File[] = []
      for (const { original, cropped } of filesMap.values()) {
        result.push(cropped ?? original)
      }
      setFiles(result)
      onValueChange?.(result)
    },
    [onValueChange]
  )

  const onFilesChange = React.useCallback(
    (newFiles: File[]) => {
      setFiles(newFiles)
      setFilesWithCrops((prev) => {
        const updated = new Map(prev)

        for (const file of newFiles) {
          if (!updated.has(file.name)) {
            updated.set(file.name, { original: file })
          }
        }

        const fileNames = new Set(newFiles.map((f) => f.name))
        for (const [fileName] of updated) {
          if (!fileNames.has(fileName)) {
            updated.delete(fileName)
          }
        }

        emitFiles(updated)
        return updated
      })
    },
    [emitFiles]
  )

  const onFileSelect = React.useCallback(
    (file: File) => {
      const fileWithCrop = filesWithCrops.get(file.name)
      const originalFile = fileWithCrop?.original ?? file

      setSelectedFile(originalFile)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedArea(null)
      setShowCropDialog(true)
    },
    [filesWithCrops]
  )

  const onCropAreaChange: NonNullable<CropperProps["onCropAreaChange"]> =
    React.useCallback((_, croppedAreaPixels) => {
      setCroppedArea(croppedAreaPixels)
    }, [])

  const onCropComplete: NonNullable<CropperProps["onCropComplete"]> =
    React.useCallback((_, croppedAreaPixels) => {
      setCroppedArea(croppedAreaPixels)
    }, [])

  const onCropReset = React.useCallback(() => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedArea(null)
  }, [])

  const onCropDialogOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      setShowCropDialog(false)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedArea(null)
    }
  }, [])

  const onCropApply = React.useCallback(async () => {
    if (!selectedFile || !croppedArea || !selectedImageUrl) return

    try {
      const mime = selectedFile.type || "image/png"
      const croppedFile = await createCroppedImage(
        selectedImageUrl,
        croppedArea,
        selectedFile.name,
        mime
      )

      setFilesWithCrops((prev) => {
        const updated = new Map(prev)
        const existing = updated.get(selectedFile.name)
        if (existing) {
          updated.set(selectedFile.name, {
            ...existing,
            cropped: croppedFile,
          })
        }
        emitFiles(updated)
        return updated
      })

      onCropDialogOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to crop image"
      )
    }
  }, [
    selectedFile,
    croppedArea,
    selectedImageUrl,
    emitFiles,
    onCropDialogOpenChange,
  ])

  return (
    <FileUpload
      value={files}
      onValueChange={onFilesChange}
      accept={accept}
      maxFiles={maxFiles}
      maxSize={maxSize}
      multiple={multiple}
      onFileReject={onFileReject}
      className={className}
    >
      <FileUploadDropzone className="flex flex-row flex-wrap border-dotted text-center">
        <UploadIcon className="size-4" />
        Drag and drop or{" "}
        <FileUploadTrigger asChild>
          <Button variant="link" size="sm" className="p-0">
            choose file
          </Button>
        </FileUploadTrigger>{" "}
        to upload
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file) => {
          const fileWithCrop = filesWithCrops.get(file.name)

          return (
            <FileUploadItem key={file.name} value={file}>
              <FileUploadItemPreview
                render={(originalFile, fallback) => {
                  if (
                    fileWithCrop?.cropped &&
                    originalFile.type.startsWith("image/")
                  ) {
                    const url = URL.createObjectURL(fileWithCrop.cropped)
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={originalFile.name}
                        className="size-full object-cover"
                      />
                    )
                  }

                  return fallback()
                }}
              />
              <FileUploadItemMetadata />
              <div className="flex gap-1">
                <Dialog
                  open={showCropDialog}
                  onOpenChange={onCropDialogOpenChange}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      type="button"
                      onClick={() => onFileSelect(file)}
                    >
                      <CropIcon />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Crop Image</DialogTitle>
                      <DialogDescription>
                        Adjust the crop area and zoom level for{" "}
                        {selectedFile?.name}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedFile && selectedImageUrl && (
                      <div className="flex flex-col gap-4">
                        <Cropper
                          aspectRatio={1}
                          shape="circle"
                          crop={crop}
                          onCropChange={setCrop}
                          zoom={zoom}
                          onZoomChange={setZoom}
                          onCropAreaChange={onCropAreaChange}
                          onCropComplete={onCropComplete}
                          className="h-96"
                        >
                          <CropperImage
                            src={selectedImageUrl}
                            alt={selectedFile.name}
                            crossOrigin="anonymous"
                          />
                          <CropperArea />
                        </Cropper>
                        <div className="flex flex-col gap-2">
                          <Label className="text-sm">
                            Zoom: {zoom.toFixed(2)}
                          </Label>
                          <Slider
                            value={[zoom]}
                            onValueChange={(val) => setZoom(val[0] ?? 1)}
                            min={1}
                            max={3}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button
                        type="button"
                        onClick={onCropReset}
                        variant="outline"
                      >
                        Reset
                      </Button>
                      <Button
                        type="button"
                        onClick={onCropApply}
                        disabled={!croppedArea}
                      >
                        Crop
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <FileUploadItemDelete asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hover:text-destructive-foreground dark:hover:text-destructive-foreground size-8 hover:bg-destructive/30 dark:hover:bg-destructive"
                  >
                    <XIcon />
                  </Button>
                </FileUploadItemDelete>
              </div>
            </FileUploadItem>
          )
        })}
      </FileUploadList>
    </FileUpload>
  )
}
