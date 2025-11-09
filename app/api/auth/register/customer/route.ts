import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const { name, email, password, phone } = await req.json();

		if (!name || !email || !password || !phone) {
			return NextResponse.json(
				{ message: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const supabase = createServerClient();

		// Sign up user with Supabase Auth
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name,
					phone,
					role: 'customer',
				},
			},
		});

		if (authError) {
			return NextResponse.json(
				{ message: authError.message },
				{ status: 400 }
			);
		}

		if (!authData.user) {
			return NextResponse.json(
				{ message: 'Failed to create user' },
				{ status: 500 }
			);
		}

		// Update profile with additional info
		const { error: profileError } = await supabase
			.from('profiles')
			.update({ name, phone })
			.eq('id', authData.user.id);

		if (profileError) {
			console.error('Profile update error:', profileError);
		}

		return NextResponse.json({
			message: 'Customer registered successfully',
			user: {
				id: authData.user.id,
				email: authData.user.email,
				name,
				phone,
				role: 'customer',
			},
			session: authData.session,
		});
	} catch (error: any) {
		console.error('Registration error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}

