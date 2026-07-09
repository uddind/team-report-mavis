import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kegswzwzdcgbjkjmhldc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZ3N3end6ZGNnYmpram1obGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NTgyMjEsImV4cCI6MjA5OTAzNDIyMX0.WzW7D8Nhu5XNl6K8yKAHPi7OcaJn6DHUg0zvu4o_p1s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);