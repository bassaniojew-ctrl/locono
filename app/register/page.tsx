'use client';

import { useState } from 'react';

export default function RegisterPage() {
	const [role, setRole] = useState<'customer' | 'vendor'>('customer');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [businessName, setBusinessName] = useState('');
	const [businessType, setBusinessType] = useState('general_store');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			const endpoint = role === 'vendor' ? '/api/auth/register/vendor' : '/api/auth/register/customer';
			const payload = role === 'vendor'
				? { ownerName: name, email, password, phone, businessName, businessType }
				: { name, email, password, phone };
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Registration failed');
			window.location.href = '/';
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="container" style={{ maxWidth: 520 }}>
			<h1 style={{ marginBottom: '1rem' }}>Create account</h1>
			<div className="card" style={{ padding: '.75rem', marginBottom: '1rem', display: 'flex', gap: '.5rem' }}>
				<button className="btn" onClick={() => setRole('customer')} style={{ filter: role === 'customer' ? 'brightness(1.05)' : 'none' }}>Customer</button>
				<button className="btn" onClick={() => setRole('vendor')} style={{ filter: role === 'vendor' ? 'brightness(1.05)' : 'none' }}>Vendor</button>
			</div>
			<form onSubmit={onSubmit} className="card" style={{ padding: '1rem', display: 'grid', gap: '.75rem' }}>
				<input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'var(--text)' }} />
				<input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'var(--text)' }} />
				<input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ padding: '.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'var(--text)' }} />
				<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'var(--text)' }} />
				{role === 'vendor' && (
					<>
						<input placeholder="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} style={{ padding: '.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'var(--text)' }} />
						<select value={businessType} onChange={(e) => setBusinessType(e.target.value)} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '.6rem' }}>
							<option value="general_store">General Store</option>
							<option value="bakery">Bakery</option>
							<option value="sweet_shop">Sweet Shop</option>
							<option value="street_food">Street Food</option>
						</select>
					</>
				)}
				{error && <div className="badge" style={{ borderColor: 'rgba(244,63,94,.35)', background: 'rgba(244,63,94,.14)', color: '#fecaca' }}>{error}</div>}
				<button className="btn" disabled={loading}>{loading ? 'Please wait…' : 'Create account'}</button>
			</form>
		</div>
	);
}


