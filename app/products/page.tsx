'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ProductCard, { Product } from '../components/ProductCard';

type SortKey = 'created_at' | 'price' | 'rating';

export default function ProductsPage() {
	const params = useSearchParams();
	const category = params.get('category') || '';
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [query, setQuery] = useState('');
	const [sortBy, setSortBy] = useState<SortKey>('created_at');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const title = useMemo(() => (category ? `Products · ${category.replace('_', ' ')}` : 'All Products'), [category]);

	useEffect(() => {
		setPage(1);
		loadProducts(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category, sortBy, sortOrder]);

	async function loadProducts(targetPage = page) {
		try {
			setLoading(true);
			const limit = 24;
			const from = (targetPage - 1) * limit;
			const to = from + limit - 1;

			let queryBuilder = supabase
				.from('products')
				.select('*, vendor:vendors(business_name,rating_average,rating_count)', { count: 'exact' })
				.eq('is_available', true)
				.range(from, to);

			if (category) queryBuilder = queryBuilder.eq('category', category);
			if (query) queryBuilder = queryBuilder.ilike('name', `%${query}%`);

			if (sortBy === 'price') queryBuilder = queryBuilder.order('price', { ascending: sortOrder === 'asc' });
			else if (sortBy === 'rating') queryBuilder = queryBuilder.order('rating_average', { ascending: false });
			else queryBuilder = queryBuilder.order('created_at', { ascending: false });

			const { data, error, count } = await queryBuilder;
			if (error) throw error;
			setProducts(data || []);
			setTotalPages(Math.max(1, Math.ceil((count || 0) / limit)));
			setPage(targetPage);
		} catch (e) {
			console.error('Load products error:', e);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="container">
			<div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
				<h1>{title}</h1>
				<div className="card" style={{ display: 'flex', gap: '.5rem', padding: '.5rem' }}>
					<input
						placeholder="Search products..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)' }}
					/>
					<button className="btn" onClick={() => loadProducts(1)}>Search</button>
				</div>
			</div>

			<div className="card" style={{ padding: '.75rem', marginBottom: '1rem', display: 'flex', gap: '.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
				<div>
					<span className="muted" style={{ marginRight: '.5rem' }}>Sort</span>
					<select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '.4rem .6rem' }}>
						<option value="created_at">Newest</option>
						<option value="price">Price</option>
						<option value="rating">Rating</option>
					</select>
				</div>
				<div>
					<select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '.4rem .6rem' }}>
						<option value="desc">Desc</option>
						<option value="asc">Asc</option>
					</select>
				</div>
			</div>

			{loading ? (
				<p>Loading...</p>
			) : products.length === 0 ? (
				<p className="muted">No products found</p>
			) : (
				<div className="grid">
					{products.map((p) => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>
			)}

			<div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center', marginTop: '1.25rem' }}>
				<button className="btn" disabled={page <= 1} onClick={() => loadProducts(page - 1)}>Prev</button>
				<div className="badge">Page {page} / {totalPages}</div>
				<button className="btn" disabled={page >= totalPages} onClick={() => loadProducts(page + 1)}>Next</button>
			</div>
		</div>
	);
}


