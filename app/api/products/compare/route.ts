import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const { productIds } = await req.json();

		if (!productIds || !Array.isArray(productIds) || productIds.length < 2 || productIds.length > 4) {
			return NextResponse.json(
				{ message: 'Please select 2-4 products to compare' },
				{ status: 400 }
			);
		}

		const supabase = createServerClient();

		const { data, error } = await supabase
			.from('products')
			.select('*, vendor:vendors(business_name,rating_average,rating_count,image)')
			.in('id', productIds)
			.eq('is_available', true);

		if (error) {
			console.error('Compare products error:', error);
			return NextResponse.json(
				{ message: 'Server error while comparing products' },
				{ status: 500 }
			);
		}

		return NextResponse.json(data || []);
	} catch (error: any) {
		console.error('Compare products error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}

