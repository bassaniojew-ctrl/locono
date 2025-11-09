import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
	try {
		const supabase = createServerClient();
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

		const { data: vendor } = await supabase
			.from('vendors')
			.select('id')
			.eq('profile_id', session.user.id)
			.single();
		if (!vendor) return NextResponse.json({ message: 'Vendor not found' }, { status: 403 });

		const body = await req.json();
		const {
			name, description, category, subcategory, price, unit, stock, images, tags, is_subscription_available
		} = body;
		if (!name || !category || !subcategory || !price || !unit) {
			return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
		}

		const { data, error } = await supabase
			.from('products')
			.insert({
				name,
				description,
				category,
				subcategory,
				vendor_id: vendor.id,
				price,
				unit,
				stock: stock || 0,
				images: images || [],
				tags: tags || [],
				is_subscription_available: !!is_subscription_available,
				is_available: true,
			})
			.select()
			.single();

		if (error) throw error;
		return NextResponse.json({ message: 'Product created', product: data });
	} catch (e: any) {
		return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 });
	}
}


