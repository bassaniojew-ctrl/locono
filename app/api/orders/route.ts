import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
	try {
		const supabase = createServerClient();
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

		const { data, error } = await supabase
			.from('orders')
			.select('*')
			.eq('customer_id', session.user.id)
			.order('created_at', { ascending: false });

		if (error) throw error;
		return NextResponse.json({ orders: data || [] });
	} catch (error: any) {
		return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { items, vendorId, deliveryAddress, paymentMethod } = body;
		if (!Array.isArray(items) || items.length === 0) {
			return NextResponse.json({ message: 'Items required' }, { status: 400 });
		}
		if (!vendorId) return NextResponse.json({ message: 'vendorId required' }, { status: 400 });
		if (!paymentMethod) return NextResponse.json({ message: 'paymentMethod required' }, { status: 400 });

		const supabase = createServerClient();
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

		// Calculate pricing
		const subtotal = items.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
		const deliveryFee = 0; // integrate distance-based fees later
		const tax = 0;
		const discount = 0;
		const total = subtotal + deliveryFee + tax - discount;

		const orderNumber = 'LOC-' + Date.now();

		const { data, error } = await supabase
			.from('orders')
			.insert({
				order_number: orderNumber,
				customer_id: session.user.id,
				vendor_id: vendorId,
				items,
				delivery_address: deliveryAddress,
				pricing: { subtotal, deliveryFee, tax, discount, total },
				payment: { method: paymentMethod, status: 'pending' },
				status: 'pending',
			})
			.select()
			.single();

		if (error) throw error;
		return NextResponse.json({ message: 'Order created', order: data });
	} catch (error: any) {
		return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
	}
}


