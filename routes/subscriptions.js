const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
	return res.status(501).json({ message: 'Subscriptions API not implemented in Supabase-only build' });
});

router.get('/my-subscriptions', auth, async (req, res) => {
	return res.status(501).json({ message: 'Subscriptions API not implemented in Supabase-only build' });
});

router.get('/:id', auth, async (req, res) => {
	return res.status(501).json({ message: 'Subscriptions API not implemented in Supabase-only build' });
});

router.put('/:id', auth, async (req, res) => {
	return res.status(501).json({ message: 'Subscriptions API not implemented in Supabase-only build' });
});

router.put('/:id/pause', auth, async (req, res) => {
	return res.status(501).json({ message: 'Subscriptions API not implemented in Supabase-only build' });
});

router.put('/:id/resume', auth, async (req, res) => {
	return res.status(501).json({ message: 'Subscriptions API not implemented in Supabase-only build' });
});

router.put('/:id/cancel', auth, async (req, res) => {
	return res.status(501).json({ message: 'Subscriptions API not implemented in Supabase-only build' });
});

router.get('/vendor/deliveries', auth, async (req, res) => {
	return res.status(501).json({ message: 'Subscriptions API not implemented in Supabase-only build' });
});

router.post('/:id/process-delivery', auth, async (req, res) => {
	return res.status(501).json({ message: 'Subscriptions API not implemented in Supabase-only build' });
});

module.exports = router;
