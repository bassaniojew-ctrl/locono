const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');
		if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
		req.user = { _id: decoded.id, role: decoded.role };
		next();
	} catch (error) {
		res.status(401).json({ message: 'Token is not valid' });
	}
};

const adminAuth = async (req, res, next) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');
		if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
		if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
		req.user = { _id: decoded.id, role: 'admin' };
		next();
	} catch (error) {
		res.status(401).json({ message: 'Token is not valid' });
	}
};

const vendorAuth = async (req, res, next) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');
		if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
		if (decoded.role !== 'vendor') return res.status(403).json({ message: 'Vendor access required' });
		req.user = { _id: decoded.id, role: 'vendor', status: decoded.status || 'approved' };
		next();
	} catch (error) {
		res.status(401).json({ message: 'Token is not valid' });
	}
};

module.exports = { auth, adminAuth, vendorAuth };
