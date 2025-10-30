export default ({ config }) => ({
    ...config,
    extra: {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY,
  },
});