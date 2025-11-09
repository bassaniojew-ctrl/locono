const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

router.post('/register/customer', [
	body('name').trim().isLength({ min: 2 }),
	body('email').isEmail(),
	body('phone').isLength({ min: 5 }),
	body('password').isLength({ min: 6 })
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	const { name, email, phone } = req.body;
	const token = generateToken('user_' + Date.now(), 'customer');
	return res.status(201).json({
		message: 'Registered (placeholder). Use Supabase Auth in production.',
		token,
		user: { id: 'user_' + Date.now(), name, email, phone, role: 'customer' }
	});
});

router.post('/register/vendor', [
	body('businessName').trim().isLength({ min: 2 }),
	body('ownerName').trim().isLength({ min: 2 }),
	body('email').isEmail(),
	body('phone').isLength({ min: 5 }),
	body('password').isLength({ min: 6 }),
	body('businessType').isIn(['general_store', 'bakery', 'sweet_shop', 'street_food'])
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	const { businessName, ownerName, email, phone, businessType } = req.body;
	const token = generateToken('vendor_' + Date.now(), 'vendor');
	return res.status(201).json({
		message: 'Vendor registered (placeholder). Awaiting approval.',
		token,
		vendor: { id: 'vendor_' + Date.now(), businessName, ownerName, email, phone, businessType, status: 'approved', role: 'vendor' }
	});
});

router.post('/login', [
	body('email').isEmail(),
	body('password').exists()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	const { email, role = 'customer' } = req.body;
	const token = generateToken((role === 'vendor' ? 'vendor_' : 'user_') + Date.now(), role);
	return res.json({ message: 'Login successful (placeholder)', token, user: { id: 'id', name: email.split('@')[0], email, phone: '', role, status: 'active' } });
});

router.get('/me', auth, async (req, res) => {
	return res.json({ user: { id: req.user._id, role: req.user.role } });
});

router.put('/profile', auth, async (req, res) => {
	return res.status(501).json({ message: 'Profile update not implemented in Supabase-only build' });
});

module.exports = router;
