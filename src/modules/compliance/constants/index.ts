import type { Platform, ProductCategory } from '../types'

// Platform display names and metadata
export const PLATFORMS: Record<Platform, { name: string; icon: string; color: string }> = {
  meta: {
    name: 'Meta / Facebook',
    icon: '📘',
    color: '#1877F2',
  },
  google: {
    name: 'Google Ads',
    icon: '🔍',
    color: '#4285F4',
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
  },
}

// Product category display names
export const PRODUCT_CATEGORIES: Record<ProductCategory, { name: string; icon: string }> = {
  'weight-loss': {
    name: 'Weight Loss',
    icon: '⚖️',
  },
  'hair-loss': {
    name: 'Hair Loss',
    icon: '💇',
  },
  skincare: {
    name: 'Skincare',
    icon: '✨',
  },
  supplements: {
    name: 'Supplements',
    icon: '💊',
  },
}

// Prohibited words database
export const PROHIBITED_WORDS = [
  'cure',
  'cures',
  'cured',
  'miracle',
  'miraculous',
  'guaranteed',
  'guarantee',
  'permanent fix',
  'permanently',
  'fda approved',
  'fda-approved',
  'clinically proven',
  'doctor recommended',
  '100% effective',
  'instant results',
  'works instantly',
  'overnight results',
  'eliminate',
  'eradicate',
  'never fail',
  'risk-free',
]

// Required disclaimers
export const REQUIRED_DISCLAIMERS = [
  'Results may vary',
  'Consult a physician',
  'Consult your doctor',
  'Individual results may vary',
  'Not intended to diagnose, treat, cure, or prevent any disease',
  'These statements have not been evaluated by the FDA',
]

// Platform-specific policy rules
export const PLATFORM_POLICIES: Record<Platform, string[]> = {
  meta: [
    'No "Before and After" images for weight loss, cosmetics, or body transformation',
    'No images focusing on specific body parts (zoomed in)',
    'No "negative self-perception" copy that makes users feel bad about themselves',
    'No claims of specific weight loss amounts (e.g., "Lose 10 lbs")',
    'No unrealistic expectations or transformations',
    'Personal health attributes must not be assumed',
  ],
  google: [
    'No speculative or experimental medical treatment claims',
    'No unproven or misleading claims about health products',
    'Healthcare must be provided by qualified professionals',
    'No promotion of unapproved pharmaceuticals',
    'Must comply with local healthcare advertising laws',
  ],
  tiktok: [
    'No promotion of weight loss products to minors',
    'No before/after content showing unrealistic transformations',
    'No content promoting unhealthy body standards',
    'Must include appropriate age restrictions for supplements',
    'No claims contradicting medical consensus',
  ],
}

// Score thresholds for status
export const SCORE_THRESHOLDS = {
  pass: 80,
  warning: 50,
}

// Severity descriptions
export const SEVERITY_INFO = {
  CRITICAL: {
    label: 'Critical',
    description: 'High risk of account ban or suspension',
    color: 'red',
    bgClass: 'violation-critical',
  },
  WARNING: {
    label: 'Warning',
    description: 'Risk of ad disapproval',
    color: 'yellow',
    bgClass: 'violation-warning',
  },
  INFO: {
    label: 'Info',
    description: 'Best practice recommendation',
    color: 'blue',
    bgClass: 'violation-info',
  },
}

