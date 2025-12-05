'use client'

import { Shield, FileSearch, Brain, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

const steps = [
  { icon: FileSearch, label: 'Reading your ad copy...', duration: 1500 },
  { icon: Brain, label: 'Analyzing against policies...', duration: 2000 },
  { icon: Shield, label: 'Checking compliance rules...', duration: 1500 },
  { icon: CheckCircle, label: 'Generating report...', duration: 1000 },
]

export function LoadingAnalysis() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    let accumulated = 0

    steps.forEach((step, index) => {
      accumulated += step.duration
      const timer = setTimeout(() => {
        setCurrentStep(Math.min(index + 1, steps.length - 1))
      }, accumulated)
      timers.push(timer)
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          {/* Animated Shield */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-primary-500/30 rounded-full pulse-ring" />
            <div className="relative p-4 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            Analyzing Your Ad
          </h3>
          <p className="text-slate-400 text-sm">
            Our AI is checking your content against platform policies
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isComplete = index < currentStep
            const StepIcon = step.icon

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-500/10 border border-primary-500/30'
                    : isComplete
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'bg-slate-800/30 border border-slate-700/30'
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-500/20'
                      : isComplete
                      ? 'bg-emerald-500/20'
                      : 'bg-slate-700/50'
                  }`}
                >
                  <StepIcon
                    className={`h-4 w-4 transition-colors ${
                      isActive
                        ? 'text-primary-400 animate-pulse'
                        : isComplete
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-300'
                      : isComplete
                      ? 'text-emerald-300'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
                {isActive && (
                  <div className="ml-auto flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                {isComplete && (
                  <CheckCircle className="ml-auto h-4 w-4 text-emerald-400" />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

