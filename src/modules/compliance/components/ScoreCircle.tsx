'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScoreCircleProps {
  score: number
  size?: number
  strokeWidth?: number
}

export function ScoreCircle({ score, size = 180, strokeWidth = 12 }: ScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedScore / 100) * circumference

  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return { stroke: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: 'text-emerald-400' }
    if (s >= 50) return { stroke: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: 'text-amber-400' }
    return { stroke: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'text-red-400' }
  }

  const colors = getColor(score)

  // Animate the score
  useEffect(() => {
    const duration = 1500
    const start = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - start
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(score * easeOut))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [score])

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Background glow */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{ backgroundColor: colors.stroke }}
      />
      
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Animated progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${colors.stroke})`,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-5xl font-bold tabular-nums', colors.text)}>
          {animatedScore}
        </span>
        <span className="text-slate-400 text-sm font-medium mt-1">
          out of 100
        </span>
      </div>
    </div>
  )
}

