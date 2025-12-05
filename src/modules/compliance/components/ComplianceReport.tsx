'use client'

import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileWarning,
  RefreshCw,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import type { ComplianceReport as ComplianceReportType } from '../types'
import { ScoreCircle } from './ScoreCircle'
import { ViolationCard } from './ViolationCard'

interface ComplianceReportProps {
  report: ComplianceReportType
  onReset: () => void
}

export function ComplianceReport({ report, onReset }: ComplianceReportProps) {
  const StatusIcon = {
    PASS: CheckCircle2,
    FAIL: XCircle,
    WARNING: AlertTriangle,
  }[report.status]

  const statusConfig = {
    PASS: {
      label: 'Compliant',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      badgeVariant: 'success' as const,
      description: 'Your ad meets compliance requirements',
    },
    FAIL: {
      label: 'Non-Compliant',
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      badgeVariant: 'destructive' as const,
      description: 'Critical violations detected - high ban risk',
    },
    WARNING: {
      label: 'Needs Review',
      color: 'text-amber-400',
      bg: 'bg-amber-500/20',
      badgeVariant: 'warning' as const,
      description: 'Some issues found - risk of ad disapproval',
    },
  }[report.status]

  const criticalCount = report.violations.filter(v => v.severity === 'CRITICAL').length
  const warningCount = report.violations.filter(v => v.severity === 'WARNING').length
  const infoCount = report.violations.filter(v => v.severity === 'INFO').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Score and Status */}
      <Card className="overflow-hidden">
        <div className={cn(
          'h-1.5',
          report.status === 'PASS' && 'bg-gradient-to-r from-emerald-500 to-emerald-400',
          report.status === 'WARNING' && 'bg-gradient-to-r from-amber-500 to-amber-400',
          report.status === 'FAIL' && 'bg-gradient-to-r from-red-500 to-red-400',
        )} />
        
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Score Circle */}
            <div className="flex-shrink-0">
              <ScoreCircle score={report.score} />
            </div>

            {/* Status and Summary */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className={cn('p-2.5 rounded-xl', statusConfig.bg)}>
                  <StatusIcon className={cn('h-7 w-7', statusConfig.color)} />
                </div>
                <div>
                  <Badge variant={statusConfig.badgeVariant} className="text-sm px-4 py-1">
                    {statusConfig.label}
                  </Badge>
                  <p className="text-xs text-slate-400 mt-1">
                    {statusConfig.description}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <p className="text-slate-300 leading-relaxed mb-6">
                {report.overall_summary}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                {criticalCount > 0 && (
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{criticalCount} Critical</span>
                  </div>
                )}
                {warningCount > 0 && (
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">{warningCount} Warning{warningCount > 1 ? 's' : ''}</span>
                  </div>
                )}
                {infoCount > 0 && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <FileWarning className="h-4 w-4" />
                    <span className="text-sm font-medium">{infoCount} Info</span>
                  </div>
                )}
                {report.violations.length === 0 && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">No violations found</span>
                  </div>
                )}
              </div>
            </div>

            {/* Analyze Again Button */}
            <div className="flex-shrink-0">
              <Button variant="outline" onClick={onReset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Analyze Another
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Violations List */}
      {report.violations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-200">
              Detailed Violations ({report.violations.length})
            </h2>
          </div>

          <div className="grid gap-4">
            {report.violations.map((violation, index) => (
              <ViolationCard
                key={index}
                violation={violation}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Violations Success Message */}
      {report.violations.length === 0 && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Excellent Compliance!</AlertTitle>
          <AlertDescription>
            Your ad copy doesn't contain any policy violations. It should be safe to run on the selected platform.
            However, we recommend always testing with small budgets first.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

