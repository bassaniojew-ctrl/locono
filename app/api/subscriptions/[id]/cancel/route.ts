import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const supabase = createServerClient();
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		const { data, error } = await supabase
			.from('subscriptions')
			.update({ status: 'cancelled' })
			.eq('id', params.id)
			.eq('customer_id', session.user.id)
			.select()
			.single();
		if (error) throw error;
		return NextResponse.json({ message: 'Subscription cancelled', subscription: data });
	} catch (e: any) {
		return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 });
	}
}


