import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
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

		// Get user profile
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', session.user.id)
			.single();

		if (profileError) {
			console.error('Profile fetch error:', profileError);
			return NextResponse.json(
				{ message: 'Failed to fetch profile' },
				{ status: 500 }
			);
		}

		// Get vendor info if vendor
		let vendor = null;
		if (profile?.role === 'vendor') {
			const { data: vendorData } = await supabase
				.from('vendors')
				.select('*')
				.eq('profile_id', session.user.id)
				.single();
			vendor = vendorData;
		}

		return NextResponse.json({
			user: {
				id: session.user.id,
				email: session.user.email,
				name: profile?.name,
				phone: profile?.phone,
				role: profile?.role || 'customer',
				address: profile?.address,
			},
			vendor: vendor ? {
				id: vendor.id,
				businessName: vendor.business_name,
				ownerName: vendor.owner_name,
				businessType: vendor.business_type,
				status: vendor.status,
				rating: {
					average: vendor.rating_average,
					count: vendor.rating_count,
				},
			} : null,
		});
	} catch (error: any) {
		console.error('Get user error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}

