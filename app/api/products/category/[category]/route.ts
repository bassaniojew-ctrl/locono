import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: { category: string } }
) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const subcategory = searchParams.get('subcategory');
		const limit = parseInt(searchParams.get('limit') || '20');

		const supabase = createServerClient();

		let query = supabase
			.from('products')
			.select('*, vendor:vendors(business_name,rating_average,rating_count,image)')
			.eq('category', params.category)
			.eq('is_available', true)
			.limit(limit);

		if (subcategory) {
			query = query.eq('subcategory', subcategory);
		}

		const { data, error } = await query;

		if (error) {
			console.error('Get products by category error:', error);
			return NextResponse.json(
				{ message: 'Server error while fetching products' },
				{ status: 500 }
			);
		}

		return NextResponse.json(data || []);
	} catch (error: any) {
		console.error('Get products by category error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}

