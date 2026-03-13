'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, onRemove, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const { url } = await response.json()
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleUpload(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleRemove = async () => {
    if (value && onRemove) {
      onRemove()
    }
  }

  if (value) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted">
        <Image
          src={value}
          alt="Uploaded image"
          fill
          className="object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2"
          onClick={handleRemove}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full aspect-video rounded-lg border-2 border-dashed transition-colors ${
        isDragOver 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        {isUploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Uploading...</p>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-muted">
              {isDragOver ? (
                <Upload className="h-6 w-6" />
              ) : (
                <ImageIcon className="h-6 w-6" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {isDragOver ? 'Drop image here' : 'Click or drag to upload'}
              </p>
              <p className="text-xs">PNG, JPG, GIF, WebP up to 5MB</p>
            </div>
          </>
        )}
      </div>
      {error && (
        <p className="absolute bottom-2 left-0 right-0 text-center text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
