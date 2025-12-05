import { z } from 'zod'

// Platform types
export type Platform = 'meta' | 'google' | 'tiktok'

// Product category types
export type ProductCategory = 'weight-loss' | 'hair-loss' | 'skincare' | 'supplements'

// Severity levels for violations
export type Severity = 'CRITICAL' | 'WARNING' | 'INFO'

// Violation category
export type ViolationCategory = 'TEXT' | 'IMAGE'

// Compliance status
export type ComplianceStatus = 'PASS' | 'FAIL' | 'WARNING'

// Individual violation schema
export const ViolationSchema = z.object({
  severity: z.enum(['CRITICAL', 'WARNING', 'INFO']),
  category: z.enum(['TEXT', 'IMAGE']),
  text_segment: z.string(),
  policy_reference: z.string(),
  explanation: z.string(),
  suggestion: z.string(),
})

export type Violation = z.infer<typeof ViolationSchema>

// Full compliance report schema
export const ComplianceReportSchema = z.object({
  score: z.number().min(0).max(100),
  status: z.enum(['PASS', 'FAIL', 'WARNING']),
  violations: z.array(ViolationSchema),
  overall_summary: z.string(),
})

export type ComplianceReport = z.infer<typeof ComplianceReportSchema>

// Form submission data
export interface FormSubmission {
  marketingCopy: string
  imageUrl?: string
  imageBase64?: string
  platform: Platform
  category: ProductCategory
}

// API request/response types
export interface AnalyzeRequest {
  marketingCopy: string
  imageUrl?: string
  imageBase64?: string
  platform: Platform
  category: ProductCategory
}

export interface AnalyzeResponse {
  success: boolean
  data?: ComplianceReport
  error?: string
}

