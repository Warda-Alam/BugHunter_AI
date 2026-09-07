import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { AuditResult } from '@/src/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function runPageSpeed(url: string, strategy: 'mobile' | 'desktop') {
  const apiKey = process.env.PAGESPEED_API_KEY;
  const params = new URLSearchParams({ url, strategy, key: apiKey || '' });
  
  ['PERFORMANCE', 'ACCESSIBILITY', 'BEST_PRACTICES', 'SEO'].forEach((c) =>
    params.append('category', c)
  );

  const res = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
    { next: { revalidate: 0 } }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `PageSpeed ${strategy} failed`);
  }
  return res.json();
}

function parseSeoMeta(html: string) {
  const $ = cheerio.load(html);
  const title = $('title').first().text().trim() || null;
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || null;
  const h1s = $('h1');
  const h1 = h1s.first().text().trim() || null;
  const h1Count = h1s.length;
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const hasCharset =
    $('meta[charset]').length > 0 || html.toLowerCase().includes('charset=');

  return { title, metaDescription, h1, h1Count, hasViewport, hasCharset };
}

function extractScores(data: any) {
  if (!data?.lighthouseResult) {
    return { performance: 0, accessibility: 0, bestPractices: 0, seo: 0, screenshot: null };
  }
  const lr = data.lighthouseResult;
  return {
    performance: Math.round((lr.categories?.performance?.score || 0) * 100),
    accessibility: Math.round((lr.categories?.accessibility?.score || 0) * 100),
    bestPractices: Math.round((lr.categories?.['best-practices']?.score || 0) * 100),
    seo: Math.round((lr.categories?.seo?.score || 0) * 100),
    screenshot: lr.audits?.['final-screenshot']?.details?.data || null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) normalized = `https://${normalized}`;

    const [mobileData, desktopData, pageHtml] = await Promise.all([
      runPageSpeed(normalized, 'mobile').catch((e) => ({ error: e.message })),
      runPageSpeed(normalized, 'desktop').catch((e) => ({ error: e.message })),
      fetch(normalized, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AuditBot/1.0)' },
        next: { revalidate: 0 },
      })
        .then((r) => (r.ok ? r.text() : null))
        .catch(() => null),
    ]);

    const seo = pageHtml ? parseSeoMeta(pageHtml) : {
      title: null, metaDescription: null, h1: null, h1Count: 0,
      hasViewport: false, hasCharset: false,
    };

    const result: AuditResult = {
      url: normalized,
      pagespeed: {
        mobile: extractScores(mobileData),
        desktop: extractScores(desktopData),
      },
      seo,
      https: normalized.startsWith('https://'),
      mobileFriendly: seo.hasViewport && !(mobileData as any).error,
    };

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}