const express = require('express');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post('/ai/chat', auth, [
	body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be between 1 and 500 characters')
], async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const { message } = req.body;
		const response = generateAIResponse(message);
		res.json({ message: response, timestamp: new Date() });
	} catch (error) {
		console.error('AI chat error:', error);
		res.status(500).json({ message: 'Server error while processing AI chat' });
	}
});

function generateAIResponse(message) {
	const lowerMessage = message.toLowerCase();
	if (lowerMessage.includes('subscription') || lowerMessage.includes('subscribe')) {
		return 'To subscribe for daily essentials like milk, bread, eggs, or curd, go to the subscription section on our homepage. You can choose your preferred frequency (daily, weekly, or monthly) and delivery time. We\'ll automatically deliver your essentials!';
	}
	if (lowerMessage.includes('delivery') || lowerMessage.includes('deliver')) {
		return 'Our delivery radius varies by category: Groceries (20km), Bakery (30-40km), Street Food (25km), and Sweets (PAN-India). Delivery fees are calculated based on distance. You can track your order in real-time!';
	}
	if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
		return 'We offer transparent pricing with the ability to compare prices across different vendors. You can see all prices before ordering and choose the best deal. Our platform helps you save money!';
	}
	if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
		return 'We accept Cash on Delivery (COD), online payments, and wallet payments. You can choose your preferred payment method during checkout. All payments are secure and encrypted.';
	}
	if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
		return 'You can track your order in real-time through our app. We\'ll send you updates when your order is confirmed, prepared, out for delivery, and delivered. You can also contact the vendor or delivery person directly.';
	}
	if (lowerMessage.includes('vendor') || lowerMessage.includes('store')) {
		return 'All our vendors are verified local businesses. We ensure quality and reliability by checking their documents and customer reviews. You can see vendor ratings and reviews before ordering.';
	}
	if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
		return "I'm here to help! You can ask me about subscriptions, delivery, pricing, payments, order tracking, or any other questions about our platform. How can I assist you today?";
	}
	return "Thank you for your message! I'm here to help with any questions about Locono. You can ask me about subscriptions, delivery, pricing, payments, or order tracking. How can I assist you?";
}

module.exports = router;
