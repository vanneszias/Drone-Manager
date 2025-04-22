from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Export the supabase client instance