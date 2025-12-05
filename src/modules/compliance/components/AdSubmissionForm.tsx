'use client'

import { useState, useCallback, useRef, DragEvent } from 'react'
import { 
  Upload, 
  Link2, 
  FileImage, 
  X, 
  Loader2, 
  ShieldCheck,
  AlertCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PLATFORMS, PRODUCT_CATEGORIES } from '../constants'
import type { Platform, ProductCategory, FormSubmission } from '../types'
import { fileToBase64, isValidImageUrl, isValidImageFile, MAX_FILE_SIZE } from '../utils/imageUtils'
import { cn } from '@/lib/utils'

interface AdSubmissionFormProps {
  onSubmit: (data: FormSubmission) => void
  isLoading: boolean
}

export function AdSubmissionForm({ onSubmit, isLoading }: AdSubmissionFormProps) {
  const [marketingCopy, setMarketingCopy] = useState('')
  const [platform, setPlatform] = useState<Platform>('meta')
  const [category, setCategory] = useState<ProductCategory>('weight-loss')
  const [imageMode, setImageMode] = useState<'file' | 'url'>('file')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    if (!isValidImageFile(file)) {
      setFormError('Please upload a valid image file (JPG, PNG, GIF, or WebP)')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setFormError('Image file must be less than 10MB')
      return
    }

    setFormError(null)
    setImageFile(file)
    
    try {
      const base64 = await fileToBase64(file)
      setImagePreview(base64)
    } catch {
      setFormError('Failed to read image file')
    }
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }, [processFile])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await processFile(files[0])
    }
  }, [processFile])

  const handleUrlChange = useCallback((url: string) => {
    setImageUrl(url)
    if (url && isValidImageUrl(url)) {
      setImagePreview(url)
      setFormError(null)
    } else if (url) {
      setFormError('Please enter a valid image URL')
      setImagePreview(null)
    } else {
      setFormError(null)
      setImagePreview(null)
    }
  }, [])

  const clearImage = useCallback(() => {
    setImageFile(null)
    setImageUrl('')
    setImagePreview(null)
    setFormError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!marketingCopy.trim()) {
      setFormError('Please enter your marketing copy')
      return
    }

    let submissionData: FormSubmission = {
      marketingCopy: marketingCopy.trim(),
      platform,
      category,
    }

    if (imageMode === 'url' && imageUrl) {
      if (!isValidImageUrl(imageUrl)) {
        setFormError('Please enter a valid image URL')
        return
      }
      submissionData.imageUrl = imageUrl
    } else if (imageMode === 'file' && imageFile) {
      try {
        const base64 = await fileToBase64(imageFile)
        submissionData.imageBase64 = base64
      } catch {
        setFormError('Failed to process image file')
        return
      }
    }

    onSubmit(submissionData)
  }, [marketingCopy, platform, category, imageMode, imageUrl, imageFile, onSubmit])

  return (
    <Card className="card-hover border-slate-700/50">
      <CardHeader className="border-b border-slate-700/50 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-2xl text-white">Ad Compliance Check</CardTitle>
            <CardDescription className="text-slate-400 mt-1">
              Validate your healthcare ad against platform policies
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Marketing Copy */}
          <div className="space-y-2">
            <Label htmlFor="marketing-copy" className="text-base text-slate-200">
              Marketing Copy <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="marketing-copy"
              placeholder="Enter your ad copy here... e.g., 'Lose weight fast with our miracle supplement! Guaranteed results or your money back!'"
              value={marketingCopy}
              onChange={(e) => setMarketingCopy(e.target.value)}
              className="min-h-[160px] text-base leading-relaxed bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-500"
            />
            <p className="text-xs text-slate-500">
              Paste your complete ad text including headlines, body copy, and CTAs
            </p>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="text-base text-slate-200">Image (Optional)</Label>
            
            {/* Toggle between file and URL */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={imageMode === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setImageMode('file')
                  setImageUrl('')
                  if (imageFile) {
                    fileToBase64(imageFile).then(setImagePreview)
                  }
                }}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
              <Button
                type="button"
                variant={imageMode === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setImageMode('url')
                  setImageFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="gap-2"
              >
                <Link2 className="h-4 w-4" />
                Image URL
              </Button>
            </div>

            {imageMode === 'file' ? (
              <div 
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
                  isDragOver 
                    ? "border-blue-500 bg-blue-500/10 scale-[1.01]" 
                    : "border-slate-600 hover:border-blue-500/50 bg-slate-800/50"
                )}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileImage className={cn(
                  "h-12 w-12 mx-auto mb-3 transition-colors",
                  isDragOver ? "text-blue-400" : "text-slate-500"
                )} />
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  isDragOver ? "text-blue-300" : "text-slate-300"
                )}>
                  {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  JPG, PNG, GIF or WebP (max 10MB)
                </p>
              </div>
            ) : (
              <Input
                type="url"
                placeholder="https://example.com/your-ad-image.jpg"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-500"
              />
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-40 rounded-lg border border-slate-600"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-600 rounded-full hover:bg-red-500 transition-colors shadow-lg"
                >
                  <X className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Platform and Category Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-base text-slate-200">
                Target Platform <span className="text-red-400">*</span>
              </Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                <SelectTrigger className="bg-slate-800/80 border-slate-600 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PLATFORMS).map(([key, { name, icon }]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{icon}</span>
                        <span>{name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-base text-slate-200">
                Product Category <span className="text-red-400">*</span>
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
                <SelectTrigger className="bg-slate-800/80 border-slate-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRODUCT_CATEGORIES).map(([key, { name, icon }]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{icon}</span>
                        <span>{name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Display */}
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !marketingCopy.trim()}
            className="w-full text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing Compliance...
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                Analyze Ad Compliance
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
