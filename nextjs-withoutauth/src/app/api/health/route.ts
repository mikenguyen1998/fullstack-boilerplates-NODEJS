import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Liveness/readiness probe: GET /api/health */
export function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      version: process.env.npm_package_version ?? 'unknown',
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
