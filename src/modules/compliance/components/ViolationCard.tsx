'use client'

import { 
  AlertTriangle, 
  XCircle, 
  Info, 
  Quote, 
  Lightbulb, 
  FileText, 
  Image as ImageIcon 
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Violation } from '../types'
import { SEVERITY_INFO } from '../constants'

interface ViolationCardProps {
  violation: Violation
  index: number
}

export function ViolationCard({ violation, index }: ViolationCardProps) {
  const severityConfig = SEVERITY_INFO[violation.severity]
  
  const SeverityIcon = {
    CRITICAL: XCircle,
    WARNING: AlertTriangle,
    INFO: Info,
  }[violation.severity]

  const CategoryIcon = violation.category === 'TEXT' ? FileText : ImageIcon

  const badgeVariant = {
    CRITICAL: 'destructive' as const,
    WARNING: 'warning' as const,
    INFO: 'default' as const,
  }[violation.severity]

  return (
    <Card 
      className={cn(
        'overflow-hidden animate-slide-up',
        severityConfig.bgClass
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg',
              violation.severity === 'CRITICAL' && 'bg-red-500/20',
              violation.severity === 'WARNING' && 'bg-amber-500/20',
              violation.severity === 'INFO' && 'bg-blue-500/20',
            )}>
              <SeverityIcon className={cn(
                'h-5 w-5',
                violation.severity === 'CRITICAL' && 'text-red-400',
                violation.severity === 'WARNING' && 'text-amber-400',
                violation.severity === 'INFO' && 'text-blue-400',
              )} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={badgeVariant}>
                  {severityConfig.label}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <CategoryIcon className="h-3 w-3" />
                  {violation.category}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {severityConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Policy Reference */}
        <div className="mb-4">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Policy Reference
          </span>
          <p className="text-sm text-primary-400 font-medium mt-1">
            {violation.policy_reference}
          </p>
        </div>

        {/* Offending Text */}
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Quote className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">
              {violation.category === 'TEXT' ? 'Flagged Text' : 'Image Issue'}
            </span>
          </div>
          <p className={cn(
            'text-sm font-medium',
            violation.severity === 'CRITICAL' && 'text-red-300',
            violation.severity === 'WARNING' && 'text-amber-300',
            violation.severity === 'INFO' && 'text-blue-300',
          )}>
            &ldquo;{violation.text_segment}&rdquo;
          </p>
        </div>

        {/* Explanation */}
        <div className="mb-4">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Why This Violates Policy
          </span>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            {violation.explanation}
          </p>
        </div>

        {/* Suggestion */}
        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <div className="flex items-center gap-2 text-xs text-emerald-400 mb-2">
            <Lightbulb className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Compliant Alternative</span>
          </div>
          <p className="text-sm text-emerald-300 leading-relaxed">
            {violation.suggestion}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

