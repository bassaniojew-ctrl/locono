import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const supabase = createServerClient();

		const { error } = await supabase.auth.signOut();

		if (error) {
			return NextResponse.json(
				{ message: error.message },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			message: 'Logged out successfully',
		});
	} catch (error: any) {
		console.error('Logout error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}

