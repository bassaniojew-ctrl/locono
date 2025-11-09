export default function Footer() {
	return (
		<footer style={{ marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
			<div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
				<div>
					<h3 style={{ marginBottom: '.5rem' }}>Locono</h3>
					<p className="muted">Connecting local businesses with customers for a better shopping experience.</p>
				</div>
				<div>
					<h4 style={{ marginBottom: '.5rem' }}>Quick Links</h4>
					<ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.9 }}>
						<li><a href="#" className="muted">About</a></li>
						<li><a href="#" className="muted">Contact</a></li>
						<li><a href="#" className="muted">Privacy</a></li>
					</ul>
				</div>
				<div>
					<h4 style={{ marginBottom: '.5rem' }}>Categories</h4>
					<div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
						<span className="badge">Groceries</span>
						<span className="badge">Bakery</span>
						<span className="badge">Sweets</span>
						<span className="badge">Street Food</span>
					</div>
				</div>
			</div>
			<div style={{ textAlign: 'center', padding: '1rem', color: 'var(--muted)' }}>© {new Date().getFullYear()} Locono • All rights reserved</div>
		</footer>
	);
}


