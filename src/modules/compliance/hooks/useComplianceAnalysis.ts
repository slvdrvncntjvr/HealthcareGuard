'use client'

import { useState, useCallback } from 'react'
import type { AnalyzeRequest, AnalyzeResponse, ComplianceReport } from '../types'

interface UseComplianceAnalysisReturn {
  report: ComplianceReport | null
  isLoading: boolean
  error: string | null
  analyze: (data: AnalyzeRequest) => Promise<void>
  reset: () => void
}

export function useComplianceAnalysis(): UseComplianceAnalysisReturn {
  const [report, setReport] = useState<ComplianceReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (data: AnalyzeRequest) => {
    setIsLoading(true)
    setError(null)
    setReport(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result: AnalyzeResponse = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Analysis failed')
      }

      setReport(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setReport(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    report,
    isLoading,
    error,
    analyze,
    reset,
  }
}

