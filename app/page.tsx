'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	unit: string;
	category: string;
	subcategory: string;
	vendor?: {
		business_name: string;
		rating_average: number;
		rating_count: number;
	};
}

export default function HomePage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadFeaturedProducts();
	}, []);

	async function loadFeaturedProducts() {
		try {
			const { data, error } = await supabase
				.from('products')
				.select('*, vendor:vendors(business_name,rating_average,rating_count)')
				.eq('is_available', true)
				.eq('featured', true)
				.limit(8);

			if (error) throw error;
			setProducts(data || []);
		} catch (error) {
			console.error('Error loading products:', error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Navbar />
			<main className="container">
			{/* Hero Section */}
			<section className="card" style={{ textAlign: 'center', marginBottom: '2rem', padding: '2.5rem' }}>
				<h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
					Locono - Hyperlocal Marketplace
				</h1>
				<p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>
					Connect with nearby stores, compare prices, and get your essentials delivered
				</p>
				<div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
					<Link
						href="/products?category=groceries"
						style={{
							padding: '1rem 2rem',
							background: '#4CAF50',
							color: 'white',
							textDecoration: 'none',
							borderRadius: '8px',
							fontWeight: 'bold',
						}}
					>
						Shop Groceries
					</Link>
					<Link
						href="/products?category=bakery"
						style={{
							padding: '1rem 2rem',
							background: '#FF9800',
							color: 'white',
							textDecoration: 'none',
							borderRadius: '8px',
							fontWeight: 'bold',
						}}
					>
						Shop Bakery
					</Link>
					<Link
						href="/products?category=sweets"
						style={{
							padding: '1rem 2rem',
							background: '#E91E63',
							color: 'white',
							textDecoration: 'none',
							borderRadius: '8px',
							fontWeight: 'bold',
						}}
					>
						Shop Sweets
					</Link>
					<Link
						href="/products?category=street_food"
						style={{
							padding: '1rem 2rem',
							background: '#9C27B0',
							color: 'white',
							textDecoration: 'none',
							borderRadius: '8px',
							fontWeight: 'bold',
						}}
					>
						Street Food
					</Link>
				</div>
			</section>

			{/* Categories */}
			<section style={{ marginBottom: '2rem' }}>
				<h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Shop by Category</h2>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
						gap: '1.5rem',
					}}
				>
					{['groceries', 'bakery', 'street_food', 'sweets'].map((category) => (
						<Link
							key={category}
							href={`/products?category=${category}`}
							style={{
								padding: '2rem',
								border: '2px solid #ddd',
								borderRadius: '12px',
								textAlign: 'center',
								textDecoration: 'none',
								color: 'inherit',
								transition: 'transform 0.2s',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'scale(1.05)';
								e.currentTarget.style.borderColor = '#4CAF50';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'scale(1)';
								e.currentTarget.style.borderColor = '#ddd';
							}}
						>
							<h3 style={{ textTransform: 'capitalize', marginBottom: '0.5rem' }}>
								{category.replace('_', ' ')}
							</h3>
							<p style={{ color: '#666', fontSize: '0.9rem' }}>
								Browse {category.replace('_', ' ')} products
							</p>
						</Link>
					))}
				</div>
			</section>

			{/* Featured Products */}
			<section>
				<h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Featured Products</h2>
				{loading ? (
					<p>Loading products...</p>
				) : products.length === 0 ? (
					<p>No featured products available</p>
				) : (
					<div className="grid">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</section>

			{/* Subscription Section */}
			<section className="card" style={{ marginTop: '2rem', padding: '2rem' }}>
				<h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Daily Essentials Subscription</h2>
				<p className="muted" style={{ marginBottom: '2rem' }}>
					Never run out of daily essentials with our subscription service
				</p>
				<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
					{['Milk', 'Eggs', 'Bread', 'Curd'].map((item) => (
						<div
							key={item}
							style={{
								padding: '1rem 2rem',
								background: 'white',
								borderRadius: '8px',
								border: '2px solid #4CAF50',
							}}
						>
							{item}
						</div>
					))}
				</div>
				<Link
					href="/subscriptions"
					style={{
						display: 'inline-block',
						marginTop: '1.5rem',
						padding: '1rem 2rem',
						background: '#4CAF50',
						color: 'white',
						textDecoration: 'none',
						borderRadius: '8px',
						fontWeight: 'bold',
					}}
				>
					Start Subscription
				</Link>
			</section>
			</main>
			<Footer />
		</>
	);
}

