# HealthGuard AI - Healthcare Ad Compliance Validator

A powerful AI-powered tool that validates healthcare advertisement content against platform policies (Meta, Google, TikTok) and FDA guidelines.

![HealthGuard AI](https://img.shields.io/badge/Powered%20by-GPT--4o-blue)

## Features

- 🛡️ **Multi-Platform Compliance** - Check ads against Meta, Google, and TikTok policies
- 🤖 **AI-Powered Analysis** - Uses GPT-4o for intelligent text and image analysis
- 📋 **Healthcare-Specific** - Validates against FDA guidelines for health claims
- 🖼️ **Image Analysis** - Detects problematic before/after images, body-focused content
- ⚡ **Instant Results** - Get detailed compliance reports in seconds
- 📊 **Detailed Reports** - Clear violation breakdowns with suggestions

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Radix UI primitives
- **AI:** OpenAI GPT-4o (multimodal)
- **Validation:** Zod for structured JSON output
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- OpenAI API key with GPT-4o access

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd HealthcareAD
```

2. Install dependencies:
```bash
npm install
```

3. Create your environment file:
```bash
cp .env.local.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=sk-your-api-key-here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter Marketing Copy** - Paste your ad text including headlines, body copy, and CTAs
2. **Add Image (Optional)** - Upload an image file or provide a URL
3. **Select Platform** - Choose Meta/Facebook, Google Ads, or TikTok
4. **Select Product Category** - Weight Loss, Hair Loss, Skincare, or Supplements
5. **Analyze** - Click "Analyze Ad Compliance" to get your report

## Compliance Rules Checked

### Prohibited Words
- "Cure", "Miracle", "Guaranteed"
- "Permanent Fix", "FDA Approved" (without proof)
- "Clinically Proven" (without evidence)

### Required Disclaimers
- "Results may vary"
- "Consult a physician"
- FDA disclosure statements

### Platform-Specific Rules

**Meta/Facebook:**
- No "Before and After" images for weight loss/cosmetics
- No images focusing on specific body parts
- No "negative self-perception" copy

**Google Ads:**
- No speculative medical treatment claims
- No unproven health claims
- Healthcare provider requirements

**TikTok:**
- No promotion of weight loss products to minors
- No unrealistic transformation content
- Age restrictions for supplements

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # OpenAI integration
│   ├── globals.css           # Tailwind styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/
│   └── ui/                   # Reusable UI components
├── lib/
│   └── utils.ts              # Utility functions
└── modules/
    └── compliance/           # Compliance feature module
        ├── components/       # Feature components
        ├── constants/        # Rules and configs
        ├── hooks/            # Custom React hooks
        ├── services/         # API logic and prompts
        ├── types/            # TypeScript types
        └── utils/            # Helper functions
```

## API Response Schema

```typescript
{
  score: number,           // 0-100 compliance score
  status: "PASS" | "FAIL" | "WARNING",
  violations: [
    {
      severity: "CRITICAL" | "WARNING" | "INFO",
      category: "TEXT" | "IMAGE",
      text_segment: string,
      policy_reference: string,
      explanation: string,
      suggestion: string
    }
  ],
  overall_summary: string
}
```

## License

MIT License - Feel free to use this project for your own purposes.

## Disclaimer

This tool provides guidance only and should not be considered legal or regulatory advice. Always consult the official platform advertising policies and relevant regulatory bodies (like the FDA) for the most up-to-date requirements.

