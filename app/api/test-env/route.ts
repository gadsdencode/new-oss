import { NextResponse } from 'next/server';

/**
 * Diagnostic API route to check environment variables
 * Access: /api/test-env
 * 
 * This route helps debug environment variable availability
 */
export async function GET() {
  try {
    // Get all database-related environment variables
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET',
      POSTGRES_URL: process.env.POSTGRES_URL ? 'SET (length: ' + process.env.POSTGRES_URL.length + ')' : 'NOT SET',
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? 'SET' : 'NOT SET',
      POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? 'SET' : 'NOT SET',
      DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED ? 'SET' : 'NOT SET',
      POSTGRES_HOST: process.env.POSTGRES_HOST ? 'SET' : 'NOT SET',
      POSTGRES_USER: process.env.POSTGRES_USER ? 'SET' : 'NOT SET',
      POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
      VERCEL_ENV: process.env.VERCEL_ENV || 'NOT SET',
    };

    // Get all available database/postgres-related env keys
    const allDatabaseKeys = Object.keys(process.env)
      .filter(key => key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('NEON'))
      .sort();

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
      knownVariables: envVars,
      allDatabaseKeys,
      message: 'If DATABASE_URL shows NOT SET, environment variables are not properly configured in Vercel'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

