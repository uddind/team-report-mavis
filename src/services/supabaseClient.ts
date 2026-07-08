import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kegswzwzdcgbjkjmhldc.supabase.coI';
const supabaseAnonKey = 'sb_publishable_Y_j2-0tqgCIzRfiza9IQPw_k-qmAUE_';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);