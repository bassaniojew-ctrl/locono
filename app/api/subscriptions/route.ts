import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
	try {
		const supabase = createServerClient();
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

		const { data, error } = await supabase
			.from('subscriptions')
			.select('*')
			.eq('customer_id', session.user.id)
			.order('created_at', { ascending: false });
		if (error) throw error;
		return NextResponse.json({ subscriptions: data || [] });
	} catch (e: any) {
		return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const supabase = createServerClient();
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

		const body = await req.json();
		const { vendorId, productId, quantity, frequency, deliveryTime, deliveryAddress, unitPrice } = body;
		if (!vendorId || !productId || !quantity || !frequency || !deliveryTime || !deliveryAddress || !unitPrice) {
			return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
		}
		const totalPrice = unitPrice * quantity;

		const { data, error } = await supabase
			.from('subscriptions')
			.insert({
				customer_id: session.user.id,
				vendor_id: vendorId,
				product_id: productId,
				quantity,
				frequency,
				delivery_time: deliveryTime,
				delivery_address: deliveryAddress,
				pricing: { unitPrice, totalPrice },
				status: 'active',
				start_date: new Date().toISOString(),
			})
			.select()
			.single();
		if (error) throw error;
		return NextResponse.json({ message: 'Subscription created', subscription: data });
	} catch (e: any) {
		return NextResponse.json({ message: e.message || 'Server error' }, { status: 500 });
	}
}


