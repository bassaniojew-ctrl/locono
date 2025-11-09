const express = require('express');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Admin API not implemented in Supabase-only build' });
});

router.get('/users', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Admin API not implemented in Supabase-only build' });
});

router.get('/vendors', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Admin API not implemented in Supabase-only build' });
});

router.get('/orders', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Admin API not implemented in Supabase-only build' });
});

router.get('/products', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Admin API not implemented in Supabase-only build' });
});

router.put('/users/:id/status', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Admin API not implemented in Supabase-only build' });
});

router.put('/vendors/:id/status', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Admin API not implemented in Supabase-only build' });
});

router.put('/products/:id/status', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Admin API not implemented in Supabase-only build' });
});

router.get('/analytics', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Admin API not implemented in Supabase-only build' });
});

router.post('/notifications/send', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Admin API not implemented in Supabase-only build' });
});

module.exports = router;
