import type { Metadata } from 'next';
import './globals.css';
import CartProvider from './components/CartContext';
import CartModal from './components/CartModal';

export const metadata: Metadata = {
	title: 'Locono - Hyperlocal Marketplace',
	description: 'Connect with nearby stores, compare prices, and get your essentials delivered',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<CartProvider>
					{children}
					<CartModal />
				</CartProvider>
			</body>
		</html>
	);
}

