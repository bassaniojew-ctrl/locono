import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const supabase = createServerClient();
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

		// Ensure vendor owns the product via RLS (update attempt)
		const updates = await req.json();
		const { data, error } = await supabase
			.from('products')
			.update(updates)
			.eq('id', params.id)
			.select()
			.single();
		if (error) return NextResponse.json({ message: error.message }, { status: 403 });
		return NextResponse.json({ message: 'Product updated', product: data });
	} catch (e: any) {
		return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const supabase = createServerClient();
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

		const { error } = await supabase
			.from('products')
			.delete()
			.eq('id', params.id);
		if (error) return NextResponse.json({ message: error.message }, { status: 403 });
		return NextResponse.json({ message: 'Product deleted' });
	} catch (e: any) {
		return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 });
	}
}


