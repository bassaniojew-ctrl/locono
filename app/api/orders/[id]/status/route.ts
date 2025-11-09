import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { status } = await req.json();
		if (!status) return NextResponse.json({ message: 'status required' }, { status: 400 });

		const supabase = createServerClient();
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

		// Let RLS enforce vendor permissions; attempt update
		const { data, error } = await supabase
			.from('orders')
			.update({ status })
			.eq('id', params.id)
			.select()
			.single();

		if (error) return NextResponse.json({ message: error.message }, { status: 403 });
		return NextResponse.json({ message: 'Order status updated', order: data });
	} catch (error: any) {
		return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
	}
}


