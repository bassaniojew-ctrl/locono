const express = require('express');
const { auth, vendorAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
	return res.status(501).json({ message: 'Orders API not implemented in Supabase-only build' });
});

router.get('/my-orders', auth, async (req, res) => {
	return res.status(501).json({ message: 'Orders API not implemented in Supabase-only build' });
});

router.get('/:id', auth, async (req, res) => {
	return res.status(501).json({ message: 'Orders API not implemented in Supabase-only build' });
});

router.put('/:id/status', vendorAuth, async (req, res) => {
	return res.status(501).json({ message: 'Orders API not implemented in Supabase-only build' });
});

router.put('/:id/cancel', auth, async (req, res) => {
	return res.status(501).json({ message: 'Orders API not implemented in Supabase-only build' });
});

router.post('/:id/rate', auth, async (req, res) => {
	return res.status(501).json({ message: 'Orders API not implemented in Supabase-only build' });
});

router.get('/vendor/orders', vendorAuth, async (req, res) => {
	return res.status(501).json({ message: 'Orders API not implemented in Supabase-only build' });
});

module.exports = router;
