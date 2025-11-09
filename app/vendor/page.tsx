'use client';

import { useEffect, useState } from 'react';

export default function VendorDashboardPage() {
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState<any[]>([]);
	const [orders, setOrders] = useState<any[]>([]);
	const [error, setError] = useState('');

	useEffect(() => { load(); }, []);

	async function load() {
		try {
			setLoading(true);
			// Fetch vendor's products
			const res = await fetch('/api/products?limit=100');
			const data = await res.json();
			setProducts(data.products || []);
			setOrders([]);
		} catch (e: any) {
			setError(e.message);
		} finally { setLoading(false); }
	}

	return (
		<div className="container" style={{ display: 'grid', gap: '1rem' }}>
			<h1>Vendor Dashboard</h1>
			{error && <div className="card" style={{ padding: '1rem' }}>{error}</div>}
			<div className="card" style={{ padding: '1rem' }}>
				<h3>Products</h3>
				{loading ? <p>Loading…</p> : (
					<div style={{ display: 'grid', gap: '.5rem' }}>
						{products.map((p: any) => (
							<div key={p.id} className="card" style={{ padding: '.75rem', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '.5rem', alignItems: 'center' }}>
								<div>
									<strong>{p.name}</strong>
									<div className="muted">₹{p.price}/{p.unit}</div>
								</div>
								<button className="btn">Edit</button>
								<button className="btn">Delete</button>
							</div>
						))}
					</div>
				)}
			</div>
			<div className="card" style={{ padding: '1rem' }}>
				<h3>Recent Orders</h3>
				{orders.length === 0 ? <p className="muted">No orders yet</p> : null}
			</div>
		</div>
	);
}


