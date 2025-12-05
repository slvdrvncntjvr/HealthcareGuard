'use client'

import { Shield, Activity, Lock, Zap } from 'lucide-react'
import { AdSubmissionForm, ComplianceReport, LoadingAnalysis, useComplianceAnalysis } from '@/modules/compliance'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Multi-Platform Compliance',
    description: 'Check against Meta, Google, and TikTok policies',
  },
  {
    icon: Activity,
    title: 'AI-Powered Analysis',
    description: 'GPT-4o vision for text and image screening',
  },
  {
    icon: Lock,
    title: 'FDA Guidelines',
    description: 'Healthcare-specific claim validation',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get detailed compliance reports in seconds',
  },
]

export default function HomePage() {
  const { report, isLoading, error, analyze, reset } = useComplianceAnalysis()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg shadow-lg shadow-primary-500/25">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  HealthGuard<span className="text-primary-400">AI</span>
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Healthcare Ad Compliance
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:block">Powered by</span>
              <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded">
                GPT-4o
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Only show when no report */}
        {!report && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Validate Your{' '}
              <span className="bg-gradient-to-r from-primary-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Healthcare Ads
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Protect your ad accounts from bans. Our AI analyzes your marketing copy and images 
              against Meta, Google, and TikTok healthcare advertising policies.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-sm"
                >
                  <feature.icon className="h-4 w-4 text-primary-400" />
                  <span className="text-slate-300">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="animate-slide-up">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>
                {error}
                {error.includes('API') && (
                  <span className="block mt-2 text-red-300">
                    Make sure your OpenAI API key is configured in .env.local
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Show form, loading, or report */}
          {isLoading ? (
            <div className="animate-fade-in">
              <LoadingAnalysis />
            </div>
          ) : !report ? (
            <div className="max-w-2xl mx-auto animate-slide-up">
              <AdSubmissionForm onSubmit={analyze} isLoading={isLoading} />
            </div>
          ) : (
            <ComplianceReport report={report} onReset={reset} />
          )}
        </div>

        {/* Footer Info */}
        {!report && (
          <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/30 border border-slate-700/30 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-400">
                Checking against latest 2024 platform policies
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/30 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Shield className="h-4 w-4" />
              <span>HealthGuard AI - Healthcare Ad Compliance Validator</span>
            </div>
            <div className="text-xs text-slate-600">
              This tool provides guidance only. Always consult platform policies directly.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

