const express = require('express');
const { getSupabase } = require('../config/database');
const { auth, vendorAuth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all products with filters (Supabase)
router.get('/', async (req, res) => {
	try {
		const {
			category,
			subcategory,
			vendor,
			search,
			minPrice,
			maxPrice,
			sortBy = 'createdAt',
			sortOrder = 'desc',
			page = 1,
			limit = 20,
			isAvailable = true
		} = req.query;

		const supabase = getSupabase();
		const skip = (parseInt(page) - 1) * parseInt(limit);

		let query = supabase
			.from('products')
			.select('*, vendor:vendors(businessName,rating,image)', { count: 'exact' })
			.eq('isAvailable', isAvailable === 'true');

		if (category) query = query.eq('category', category);
		if (subcategory) query = query.eq('subcategory', subcategory);
		if (vendor) query = query.eq('vendor', vendor);
		if (minPrice) query = query.gte('price', parseFloat(minPrice));
		if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
		if (search) query = query.ilike('name', `%${search}%`);

		query = query.order(sortBy, { ascending: sortOrder !== 'desc' }).range(skip, skip + parseInt(limit) - 1);

		const { data, count, error } = await query;
		if (error) throw error;

		return res.json({
			products: data || [],
			pagination: {
				currentPage: parseInt(page),
				totalPages: Math.ceil((count || 0) / parseInt(limit)),
				totalProducts: count || 0,
				hasNext: skip + (data?.length || 0) < (count || 0),
				hasPrev: parseInt(page) > 1
			}
		});
	} catch (error) {
		console.error('Get products error:', error);
		res.status(500).json({ message: 'Server error while fetching products' });
	}
});

// Get product by ID (Supabase)
router.get('/:id', async (req, res) => {
	try {
		const supabase = getSupabase();
		const { data, error } = await supabase
			.from('products')
			.select('*, vendor:vendors(businessName,rating,image,address,businessHours)')
			.eq('id', req.params.id)
			.single();
		if (error) throw error;
		if (!data) return res.status(404).json({ message: 'Product not found' });
		return res.json(data);
	} catch (error) {
		console.error('Get product error:', error);
		res.status(500).json({ message: 'Server error while fetching product' });
	}
});

// Search products (Supabase)
router.get('/search/:query', async (req, res) => {
	try {
		const { query } = req.params;
		const { category, limit = 10 } = req.query;
		const supabase = getSupabase();
		let q = supabase
			.from('products')
			.select('*, vendor:vendors(businessName,rating,image)')
			.eq('isAvailable', true)
			.ilike('name', `%${query}%`)
			.limit(parseInt(limit));
		if (category) q = q.eq('category', category);
		const { data, error } = await q;
		if (error) throw error;
		return res.json(data || []);
	} catch (error) {
		console.error('Search products error:', error);
		res.status(500).json({ message: 'Server error while searching products' });
	}
});

// Get products by category (Supabase)
router.get('/category/:category', async (req, res) => {
	try {
		const { category } = req.params;
		const { subcategory, limit = 20 } = req.query;
		const supabase = getSupabase();
		let q = supabase
			.from('products')
			.select('*, vendor:vendors(businessName,rating,image)')
			.eq('category', category)
			.eq('isAvailable', true)
			.limit(parseInt(limit));
		if (subcategory) q = q.eq('subcategory', subcategory);
		const { data, error } = await q;
		if (error) throw error;
		return res.json(data || []);
	} catch (error) {
		console.error('Get products by category error:', error);
		res.status(500).json({ message: 'Server error while fetching products' });
	}
});

// Compare products (Supabase)
router.post('/compare', async (req, res) => {
	try {
		const { productIds } = req.body;
		if (!productIds || productIds.length < 2 || productIds.length > 4) {
			return res.status(400).json({ message: 'Please select 2-4 products to compare' });
		}
		const supabase = getSupabase();
		const { data, error } = await supabase
			.from('products')
			.select('*, vendor:vendors(businessName,rating,image)')
			.in('id', productIds)
			.eq('isAvailable', true);
		if (error) throw error;
		return res.json(data || []);
	} catch (error) {
		console.error('Compare products error:', error);
		res.status(500).json({ message: 'Server error while comparing products' });
	}
});

// The following vendor-only write endpoints are not implemented in Supabase in this build.
router.post('/', vendorAuth, [
	body('name').trim().isLength({ min: 2 }),
], async (req, res) => {
	return res.status(501).json({ message: 'Not implemented in Supabase-only build' });
});

router.put('/:id', vendorAuth, async (req, res) => {
	return res.status(501).json({ message: 'Not implemented in Supabase-only build' });
});

router.delete('/:id', vendorAuth, async (req, res) => {
	return res.status(501).json({ message: 'Not implemented in Supabase-only build' });
});

router.post('/:id/reviews', auth, [
	body('rating').isInt({ min: 1, max: 5 })
], async (req, res) => {
	return res.status(501).json({ message: 'Not implemented in Supabase-only build' });
});

module.exports = router;
