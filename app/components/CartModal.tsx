'use client';

import { useCart } from './CartContext';

export default function CartModal() {
	const { open, closeCart, items, subtotal, removeItem, updateQty } = useCart();
	if (!open) return null;
	return (
		<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'grid', placeItems: 'center', zIndex: 50 }} onClick={closeCart}>
			<div className="card" style={{ width: 'min(720px, 96vw)', maxHeight: '80vh', overflow: 'auto', padding: '1rem' }} onClick={(e) => e.stopPropagation()}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
					<h3>Shopping Cart</h3>
					<button className="btn" onClick={closeCart}>Close</button>
				</div>
				{items.length === 0 ? (
					<p className="muted">Your cart is empty</p>
				) : (
					<div style={{ display: 'grid', gap: '.75rem' }}>
						{items.map((i) => (
							<div key={i.productId} className="card" style={{ padding: '.75rem', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
								<div>
									<div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
										<strong>{i.name}</strong>
										<span className="badge">{i.vendorName || 'Vendor'}</span>
									</div>
									<div className="muted">₹{i.price}{i.unit ? `/${i.unit}` : ''}</div>
								</div>
								<div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
									<button className="btn" onClick={() => updateQty(i.productId, i.quantity - 1)}>-</button>
									<div className="badge">{i.quantity}</div>
									<button className="btn" onClick={() => updateQty(i.productId, i.quantity + 1)}>+</button>
									<button className="btn" onClick={() => removeItem(i.productId)}>Remove</button>
								</div>
							</div>
						))}
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<div className="badge">Subtotal</div>
							<h3>₹{subtotal.toFixed(2)}</h3>
						</div>
						<button className="btn">Proceed to checkout</button>
					</div>
				)}
			</div>
		</div>
	);
}


