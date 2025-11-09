'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>(null);
	const [orders, setOrders] = useState<any[]>([]);
	const [subs, setSubs] = useState<any[]>([]);
	const [error, setError] = useState('');

	useEffect(() => { load(); }, []);

	async function load() {
		try {
			setLoading(true);
			const [meRes, ordersRes, subsRes] = await Promise.all([
				fetch('/api/auth/me'),
				fetch('/api/orders'),
				fetch('/api/subscriptions'),
			]);
			if (meRes.status === 401) { setError('Please login first'); return; }
			const me = await meRes.json();
			const ord = ordersRes.ok ? (await ordersRes.json()).orders : [];
			const su = subsRes.ok ? (await subsRes.json()).subscriptions : [];
			setUser(me.user);
			setOrders(ord || []);
			setSubs(su || []);
		} catch (e: any) {
			setError(e.message);
		} finally { setLoading(false); }
	}

	if (error) return <div className="container"><div className="card" style={{ padding: '1rem' }}>{error}</div></div>;

	return (
		<div className="container" style={{ display: 'grid', gap: '1rem' }}>
			<h1>My Dashboard</h1>
			<div className="grid">
				<div className="card" style={{ padding: '1rem' }}>
					<h3>Profile</h3>
					{loading ? <p>Loading…</p> : (
						<div className="muted">
							<div>Name: {user?.name || '-'}</div>
							<div>Email: {user?.email}</div>
							<div>Role: {user?.role}</div>
						</div>
					)}
				</div>
				<div className="card" style={{ padding: '1rem' }}>
					<h3>Recent Orders</h3>
					{orders.length === 0 ? <p className="muted">No orders</p> : (
						<div style={{ display: 'grid', gap: '.5rem' }}>
							{orders.slice(0, 5).map((o) => (
								<div key={o.id} className="card" style={{ padding: '.75rem', display: 'flex', justifyContent: 'space-between' }}>
									<div>
										<div className="badge">{o.order_number}</div>
										<div className="muted">{new Date(o.created_at).toLocaleString()}</div>
									</div>
									<div>{o.status}</div>
									<div>₹{o.pricing?.total}</div>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="card" style={{ padding: '1rem' }}>
					<h3>Subscriptions</h3>
					{subs.length === 0 ? <p className="muted">No subscriptions</p> : (
						<div style={{ display: 'grid', gap: '.5rem' }}>
							{subs.slice(0, 5).map((s) => (
								<div key={s.id} className="card" style={{ padding: '.75rem', display: 'flex', justifyContent: 'space-between' }}>
									<div>
										<div className="badge">{s.frequency}</div>
										<div className="muted">Qty {s.quantity} · {s.delivery_time}</div>
									</div>
									<div>{s.status}</div>
									<div>₹{s.pricing?.totalPrice}</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}


