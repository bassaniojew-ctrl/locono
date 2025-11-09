import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return NextResponse.json(
				{ message: 'Email and password are required' },
				{ status: 400 }
			);
		}

		const supabase = createServerClient();

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return NextResponse.json(
				{ message: error.message || 'Invalid credentials' },
				{ status: 401 }
			);
		}

		if (!data.user || !data.session) {
			return NextResponse.json(
				{ message: 'Login failed' },
				{ status: 500 }
			);
		}

		// Get user profile
		const { data: profile } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', data.user.id)
			.single();

		// Get vendor info if vendor
		let vendor = null;
		if (profile?.role === 'vendor') {
			const { data: vendorData } = await supabase
				.from('vendors')
				.select('*')
				.eq('profile_id', data.user.id)
				.single();
			vendor = vendorData;
		}

		return NextResponse.json({
			message: 'Login successful',
			user: {
				id: data.user.id,
				email: data.user.email,
				name: profile?.name,
				phone: profile?.phone,
				role: profile?.role || 'customer',
			},
			vendor: vendor ? {
				id: vendor.id,
				businessName: vendor.business_name,
				status: vendor.status,
			} : null,
			session: data.session,
		});
	} catch (error: any) {
		console.error('Login error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}

