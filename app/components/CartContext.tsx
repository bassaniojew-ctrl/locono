'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = {
	productId: string;
	name: string;
	vendorId: string;
	vendorName?: string;
	price: number;
	unit?: string;
	quantity: number;
};

type CartContextValue = {
	items: CartItem[];
	open: boolean;
	openCart: () => void;
	closeCart: () => void;
	addItem: (item: CartItem) => void;
	removeItem: (productId: string) => void;
	updateQty: (productId: string, quantity: number) => void;
	clear: () => void;
	subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('CartContext missing');
	return ctx;
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [open, setOpen] = useState(false);

	function openCart() { setOpen(true); }
	function closeCart() { setOpen(false); }

	function addItem(newItem: CartItem) {
		setItems((prev) => {
			const found = prev.find((i) => i.productId === newItem.productId);
			if (found) {
				return prev.map((i) => i.productId === newItem.productId ? { ...i, quantity: i.quantity + newItem.quantity } : i);
			}
			return [...prev, newItem];
		});
	}

	function removeItem(productId: string) {
		setItems((prev) => prev.filter((i) => i.productId !== productId));
	}

	function updateQty(productId: string, quantity: number) {
		setItems((prev) => prev.map((i) => i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i));
	}

	function clear() { setItems([]); }

	const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

	return (
		<CartContext.Provider value={{ items, open, openCart, closeCart, addItem, removeItem, updateQty, clear, subtotal }}>
			{children}
		</CartContext.Provider>
	);
}


