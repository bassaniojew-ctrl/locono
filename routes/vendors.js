const express = require('express');
const { vendorAuth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
	return res.status(501).json({ message: 'Vendors API not implemented in Supabase-only build' });
});

router.get('/:id', async (req, res) => {
	return res.status(501).json({ message: 'Vendors API not implemented in Supabase-only build' });
});

router.get('/:id/products', async (req, res) => {
	return res.status(501).json({ message: 'Vendors API not implemented in Supabase-only build' });
});

router.put('/profile', vendorAuth, async (req, res) => {
	return res.status(501).json({ message: 'Vendors API not implemented in Supabase-only build' });
});

router.get('/dashboard/data', vendorAuth, async (req, res) => {
	return res.status(501).json({ message: 'Vendors API not implemented in Supabase-only build' });
});

router.get('/orders/list', vendorAuth, async (req, res) => {
	return res.status(501).json({ message: 'Vendors API not implemented in Supabase-only build' });
});

router.put('/:id/status', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Vendors API not implemented in Supabase-only build' });
});

router.get('/admin/pending', adminAuth, async (req, res) => {
	return res.status(501).json({ message: 'Vendors API not implemented in Supabase-only build' });
});

module.exports = router;
