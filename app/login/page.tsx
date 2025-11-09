'use client';

import { useState } from 'react';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Login failed');
			window.location.href = '/';
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="container" style={{ maxWidth: 460 }}>
			<h1 style={{ marginBottom: '1rem' }}>Login</h1>
			<form onSubmit={onSubmit} className="card" style={{ padding: '1rem', display: 'grid', gap: '.75rem' }}>
				<input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'var(--text)' }} />
				<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '.6rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'var(--text)' }} />
				{error && <div className="badge" style={{ borderColor: 'rgba(244,63,94,.35)', background: 'rgba(244,63,94,.14)', color: '#fecaca' }}>{error}</div>}
				<button className="btn" disabled={loading}>{loading ? 'Please wait…' : 'Login'}</button>
			</form>
		</div>
	);
}


