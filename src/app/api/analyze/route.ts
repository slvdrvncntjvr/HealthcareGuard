import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ComplianceReportSchema, type Platform, type ProductCategory } from '@/modules/compliance/types'
import { buildSystemPrompt, buildUserPrompt } from '@/modules/compliance/services/prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { marketingCopy, imageUrl, imageBase64, platform, category } = body as {
      marketingCopy: string
      imageUrl?: string
      imageBase64?: string
      platform: Platform
      category: ProductCategory
    }

    // Validate required fields
    if (!marketingCopy || !platform || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: marketingCopy, platform, and category are required' },
        { status: 400 }
      )
    }

    // Build prompts
    const systemPrompt = buildSystemPrompt(platform, category)
    const hasImage = !!(imageUrl || imageBase64)
    const userPrompt = buildUserPrompt(marketingCopy, hasImage)

    // Build message content for OpenAI
    const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
      { type: 'text', text: userPrompt },
    ]

    // Add image if provided
    if (imageUrl) {
      content.push({
        type: 'image_url',
        image_url: { url: imageUrl, detail: 'high' },
      })
    } else if (imageBase64) {
      content.push({
        type: 'image_url',
        image_url: { url: imageBase64, detail: 'high' },
      })
    }

    // Call OpenAI GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: content,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 4000,
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      return NextResponse.json(
        { success: false, error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Parse and validate the response
    const parsedResponse = JSON.parse(responseContent)
    const validatedReport = ComplianceReportSchema.parse(parsedResponse)

    return NextResponse.json({
      success: true,
      data: validatedReport,
    })
  } catch (error) {
    console.error('Analysis error:', error)
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response as JSON' },
        { status: 500 }
      )
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

