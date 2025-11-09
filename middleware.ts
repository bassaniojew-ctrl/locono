import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
	// Authentication is handled directly in API routes
	// Middleware can be extended for session refresh or redirects
	return NextResponse.next();
}

export const config = {
	matcher: [
		'/api/auth/:path*',
		'/api/orders/:path*',
		'/api/subscriptions/:path*',
		'/dashboard/:path*',
		'/vendor/:path*',
		'/admin/:path*',
	],
};

