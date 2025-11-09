const { createClient } = require('@supabase/supabase-js');

let supabase = null;

const connectDB = async () => {
	const inferredSupabase = !!(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
	const dbType = (process.env.DB_TYPE || (inferredSupabase ? 'supabase' : 'supabase')).toLowerCase();
	if (dbType === 'supabase') {
		const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
		const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
		if (!url || !key) {
			console.error('Supabase credentials missing. Set SUPABASE_URL and SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
			process.exit(1);
		}
		supabase = createClient(url, key, {
			auth: { persistSession: false }
		});
		console.log('Supabase client initialized');
		return { type: 'supabase' };
	}

	console.error('Only Supabase is supported in this build.');
	process.exit(1);
};

const getSupabase = () => supabase;

module.exports = { connectDB, getSupabase };
