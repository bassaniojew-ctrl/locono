import { createServerClient } from './supabase/server';
import { redirect } from 'next/navigation';

export async function getServerSession() {
	const supabase = createServerClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session;
}

export async function requireAuth() {
	const session = await getServerSession();
	if (!session) {
		redirect('/login');
	}
	return session;
}

export async function requireRole(role: 'admin' | 'vendor' | 'customer') {
	const session = await requireAuth();
	const { data: profile } = await createServerClient()
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();

	if (!profile || profile.role !== role) {
		redirect('/unauthorized');
	}

	return session;
}

export async function getUserProfile(userId: string) {
	const supabase = createServerClient();
	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single();
	
	if (error) throw error;
	return data;
}

