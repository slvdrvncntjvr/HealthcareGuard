'use client'

import { useState, useCallback, useRef } from 'react'
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
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
    <Card className="card-hover">
      <CardHeader className="border-b border-slate-700/50 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-600/20 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-primary-400" />
          </div>
          <div>
            <CardTitle className="text-2xl">Ad Compliance Check</CardTitle>
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
            <Label htmlFor="marketing-copy" className="text-base">
              Marketing Copy <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="marketing-copy"
              placeholder="Enter your ad copy here... e.g., 'Lose weight fast with our miracle supplement! Guaranteed results or your money back!'"
              value={marketingCopy}
              onChange={(e) => setMarketingCopy(e.target.value)}
              className="min-h-[160px] text-base leading-relaxed"
            />
            <p className="text-xs text-slate-500">
              Paste your complete ad text including headlines, body copy, and CTAs
            </p>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="text-base">Image (Optional)</Label>
            
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
                className="relative border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileImage className="h-10 w-10 mx-auto text-slate-500 mb-3" />
                <p className="text-slate-400 text-sm">
                  {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  JPG, PNG, GIF or WebP (max 10MB)
                </p>
              </div>
            ) : (
              <Input
                type="url"
                placeholder="https://example.com/your-ad-image.jpg"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
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
                  className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Platform and Category Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-base">
                Target Platform <span className="text-red-400">*</span>
              </Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                <SelectTrigger>
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
              <Label htmlFor="category" className="text-base">
                Product Category <span className="text-red-400">*</span>
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
                <SelectTrigger>
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

