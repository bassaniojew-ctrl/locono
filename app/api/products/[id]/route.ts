import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const supabase = createServerClient();

		const { data, error } = await supabase
			.from('products')
			.select('*, vendor:vendors(*)')
			.eq('id', params.id)
			.single();

		if (error) {
			return NextResponse.json(
				{ message: 'Product not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(data);
	} catch (error: any) {
		console.error('Get product error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}

