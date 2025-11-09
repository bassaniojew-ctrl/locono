'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartContext';

export default function Navbar() {
    const { openCart } = useCart();
	return (
		<nav className="nav">
			<div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingTop: '.75rem', paddingBottom: '.75rem' }}>
				<Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '.6rem', textDecoration: 'none' }}>
					<div className="badge">Locono</div>
					<strong style={{ letterSpacing: .3 }}>Hyperlocal</strong>
				</Link>
				<div style={{ flex: 1, maxWidth: 520 }}>
					<div className="card" style={{ display: 'flex', alignItems: 'center', padding: '.5rem .75rem', gap: '.5rem' }}>
						<input placeholder="Search products, stores..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)' }} />
						<button className="btn" aria-label="Search">Search</button>
					</div>
				</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                    <Link className="btn" href="/login">Login</Link>
                    <button className="btn" onClick={openCart}>Cart</button>
                </div>
			</div>
		</nav>
	);
}


