import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const category = searchParams.get('category');
		const subcategory = searchParams.get('subcategory');
		const vendor = searchParams.get('vendor');
		const search = searchParams.get('search');
		const minPrice = searchParams.get('minPrice');
		const maxPrice = searchParams.get('maxPrice');
		const sortBy = searchParams.get('sortBy') || 'created_at';
		const sortOrder = searchParams.get('sortOrder') || 'desc';
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '20');
		const isAvailable = searchParams.get('isAvailable') !== 'false';
		const featured = searchParams.get('featured') === 'true';

		const supabase = createServerClient();
		const skip = (page - 1) * limit;

		let query = supabase
			.from('products')
			.select('*, vendor:vendors(business_name,rating_average,rating_count,image)', { count: 'exact' })
			.eq('is_available', isAvailable);

		if (featured) {
			query = query.eq('featured', true);
		}

		if (category) {
			query = query.eq('category', category);
		}

		if (subcategory) {
			query = query.eq('subcategory', subcategory);
		}

		if (vendor) {
			query = query.eq('vendor_id', vendor);
		}

		if (minPrice) {
			query = query.gte('price', parseFloat(minPrice));
		}

		if (maxPrice) {
			query = query.lte('price', parseFloat(maxPrice));
		}

		if (search) {
			query = query.ilike('name', `%${search}%`);
		}

		// Handle sorting
		const ascending = sortOrder !== 'desc';
		if (sortBy === 'price') {
			query = query.order('price', { ascending });
		} else if (sortBy === 'rating') {
			query = query.order('rating_average', { ascending: false });
		} else {
			query = query.order('created_at', { ascending: false });
		}

		query = query.range(skip, skip + limit - 1);

		const { data, count, error } = await query;

		if (error) {
			console.error('Get products error:', error);
			return NextResponse.json(
				{ message: 'Server error while fetching products' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			products: data || [],
			pagination: {
				currentPage: page,
				totalPages: Math.ceil((count || 0) / limit),
				totalProducts: count || 0,
				hasNext: skip + (data?.length || 0) < (count || 0),
				hasPrev: page > 1,
			},
		});
	} catch (error: any) {
		console.error('Get products error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}

