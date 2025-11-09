import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
	try {
		const supabase = createServerClient();

		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const { name, phone, address } = await req.json();

		const updates: any = {};
		if (name) updates.name = name;
		if (phone) updates.phone = phone;
		if (address) updates.address = address;

		const { data, error } = await supabase
			.from('profiles')
			.update(updates)
			.eq('id', session.user.id)
			.select()
			.single();

		if (error) {
			return NextResponse.json(
				{ message: error.message },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			message: 'Profile updated successfully',
			user: {
				id: data.id,
				name: data.name,
				phone: data.phone,
				address: data.address,
				role: data.role,
			},
		});
	} catch (error: any) {
		console.error('Profile update error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}

