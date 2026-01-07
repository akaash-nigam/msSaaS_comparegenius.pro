import OpenAI from 'openai';
import { logger } from '../utils/logger.js';
import { cacheGet, cacheSet } from './redis.js';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface ComparisonRequest {
  products: any[];
  attributes?: string[];
}

export async function generateComparison(request: ComparisonRequest) {
  if (!openai) {
    logger.warn('OpenAI API key not configured - AI features disabled');
    return { comparison: 'AI features require an OpenAI API key. Please configure OPENAI_API_KEY in .env file.', usage: null };
  }

  try {
    const cacheKey = `comparison:${JSON.stringify(request.products.map(p => p.id).sort())}`;
    const cached = await cacheGet(cacheKey);

    if (cached) {
      logger.debug('Returning cached comparison');
      return cached;
    }

    const prompt = buildComparisonPrompt(request);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert product comparison analyst. Provide clear, unbiased, and detailed comparisons based on factual data. Focus on helping users make informed purchase decisions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const result = {
      comparison: completion.choices[0].message.content,
      usage: completion.usage,
    };

    // Cache for 1 hour
    await cacheSet(cacheKey, result, 3600);

    return result;
  } catch (error) {
    logger.error('OpenAI comparison error:', error);
    throw error;
  }
}

export async function generateProductSummary(product: any) {
  if (!openai) {
    return null;
  }

  try {
    const cacheKey = `summary:${product.id}`;
    const cached = await cacheGet(cacheKey);

    if (cached) {
      logger.debug('Returning cached summary');
      return cached;
    }

    const prompt = `Generate a concise 2-3 sentence summary for this product:

Name: ${product.name}
Brand: ${product.brandName}
Category: ${product.categoryName}
Description: ${product.description}
Key Specs: ${JSON.stringify(product.specs, null, 2)}

The summary should highlight the most important features and who this product is best for.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a product expert. Create clear, helpful summaries that highlight key features and use cases.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const summary = completion.choices[0].message.content;

    // Cache for 24 hours
    await cacheSet(cacheKey, summary, 86400);

    return summary;
  } catch (error) {
    logger.error('OpenAI summary error:', error);
    throw error;
  }
}

export async function generateProsAndCons(product: any, reviews: any[] = []) {
  if (!openai) {
    return { pros: [], cons: [] };
  }

  try {
    const cacheKey = `proscons:${product.id}`;
    const cached = await cacheGet(cacheKey);

    if (cached) {
      return cached;
    }

    const reviewText = reviews.slice(0, 10).map(r => r.text).join('\n\n');

    const prompt = `Based on the product information and user reviews, generate a list of pros and cons:

Product: ${product.name}
${reviewText ? `User Reviews:\n${reviewText}` : ''}

Generate:
1. Top 3-5 pros (strengths)
2. Top 3-5 cons (weaknesses)

Format as JSON: { "pros": ["...", "..."], "cons": ["...", "..."] }`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a product analyst. Extract balanced pros and cons from product data and reviews.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Cache for 12 hours
    await cacheSet(cacheKey, result, 43200);

    return result;
  } catch (error) {
    logger.error('OpenAI pros/cons error:', error);
    throw error;
  }
}

function buildComparisonPrompt(request: ComparisonRequest): string {
  const { products, attributes } = request;

  let prompt = `Compare the following products:\n\n`;

  products.forEach((product, index) => {
    prompt += `Product ${index + 1}: ${product.name}\n`;
    prompt += `Brand: ${product.brandName}\n`;
    prompt += `Price: $${product.minPrice}\n`;
    prompt += `Specs: ${JSON.stringify(product.specs, null, 2)}\n\n`;
  });

  if (attributes && attributes.length > 0) {
    prompt += `Focus your comparison on these attributes: ${attributes.join(', ')}\n\n`;
  }

  prompt += `Provide:
1. A brief overview of each product
2. Key differences between them
3. Pros and cons of each
4. Recommendation based on different use cases (e.g., "Best for budget-conscious buyers", "Best for professionals", etc.)

Keep it concise and actionable.`;

  return prompt;
}
