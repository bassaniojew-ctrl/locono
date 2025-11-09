import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const {
			businessName,
			ownerName,
			email,
			password,
			phone,
			businessType,
			address,
		} = await req.json();

		if (!businessName || !ownerName || !email || !password || !phone || !businessType) {
			return NextResponse.json(
				{ message: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const validBusinessTypes = ['general_store', 'bakery', 'sweet_shop', 'street_food'];
		if (!validBusinessTypes.includes(businessType)) {
			return NextResponse.json(
				{ message: 'Invalid business type' },
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
					name: ownerName,
					phone,
					role: 'vendor',
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

		// Update profile
		await supabase
			.from('profiles')
			.update({ name: ownerName, phone, role: 'vendor' })
			.eq('id', authData.user.id);

		// Create vendor record
		const { data: vendorData, error: vendorError } = await supabase
			.from('vendors')
			.insert({
				profile_id: authData.user.id,
				business_name: businessName,
				owner_name: ownerName,
				business_type: businessType,
				address: address || {},
				status: 'pending',
			})
			.select()
			.single();

		if (vendorError) {
			console.error('Vendor creation error:', vendorError);
			// Clean up user if vendor creation fails
			await supabase.auth.admin.deleteUser(authData.user.id);
			return NextResponse.json(
				{ message: 'Failed to create vendor record' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: 'Vendor registered successfully. Awaiting approval.',
			vendor: {
				id: vendorData.id,
				businessName: vendorData.business_name,
				ownerName: vendorData.owner_name,
				businessType: vendorData.business_type,
				status: vendorData.status,
			},
			user: {
				id: authData.user.id,
				email: authData.user.email,
				name: ownerName,
				role: 'vendor',
			},
			session: authData.session,
		});
	} catch (error: any) {
		console.error('Vendor registration error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}

