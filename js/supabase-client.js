// Initialize Supabase
const SUPABASE_URL = 'https://your-project-ref.supabase.co'; // Replace with your URL
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Replace with your anon key

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
