import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

const fetchStores = async (supabase: any, userId: string, setStore: any) => {
  if (!userId) return;

  try {
    const { data: stores, error } = await supabase
      .from('store')
      .select('id, store_name, store_phone, logo_url, description, subdomain, address')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching stores:', error.message);
      setStore(null);
    } else {
      setStore(stores[0]);
    }
  } catch (error: any) {
    console.error('Error in fetchStores:', error.message);
  }
};

export { fetchStores };