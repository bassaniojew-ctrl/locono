type VendorInfo = {
	business_name?: string;
	rating_average?: number;
	rating_count?: number;
};

export type Product = {
	id: string;
	name: string;
	description?: string;
	price: number;
	unit: string;
	vendor?: VendorInfo;
    images?: { url: string; alt?: string }[];
};

import { useCart } from './CartContext';

export default function ProductCard({ product }: { product: Product }) {
	const { addItem, openCart } = useCart();
	function addToCart() {
		addItem({
			productId: product.id,
			name: product.name,
			vendorId: (product as any).vendor_id || 'vendor',
			vendorName: product.vendor?.business_name,
			price: product.price,
			unit: product.unit,
			quantity: 1,
		});
		openCart();
	}
    const imageUrl = product.images?.[0]?.url;
    return (
        <div className="card" style={{ padding: '1rem' }}>
            {imageUrl && (
                <div style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginBottom: '.75rem',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <img src={imageUrl} alt={product.images?.[0]?.alt || product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
            )}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
				<h3 style={{ fontSize: '1.05rem' }}>{product.name}</h3>
				<span className="badge">₹{product.price}/{product.unit}</span>
			</div>
			<p className="muted" style={{ minHeight: 40 }}>{product.description}</p>
			{product.vendor?.business_name && (
				<div className="muted" style={{ fontSize: '.9rem', marginTop: '.5rem' }}>{product.vendor.business_name}</div>
			)}
			<div style={{ marginTop: '.75rem', display: 'flex', gap: '.5rem' }}>
				<button className="btn" onClick={addToCart}>Add to Cart</button>
				<button className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'none' }}>Compare</button>
			</div>
		</div>
	);
}


