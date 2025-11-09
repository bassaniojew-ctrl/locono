import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: { query: string } }
) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const category = searchParams.get('category');
		const limit = parseInt(searchParams.get('limit') || '10');

		const supabase = createServerClient();

		let query = supabase
			.from('products')
			.select('*, vendor:vendors(business_name,rating_average,rating_count,image)')
			.eq('is_available', true)
			.ilike('name', `%${params.query}%`)
			.limit(limit);

		if (category) {
			query = query.eq('category', category);
		}

		const { data, error } = await query;

		if (error) {
			console.error('Search products error:', error);
			return NextResponse.json(
				{ message: 'Server error while searching products' },
				{ status: 500 }
			);
		}

		return NextResponse.json(data || []);
	} catch (error: any) {
		console.error('Search products error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}

