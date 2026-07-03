import { createClient } from '@supabase/supabase-js';
import { Order } from './types';

const supabaseUrl = process.env.SUPABASE_URL || 'https://kkfemwduwimomkalgzua.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_wCXTH0DusaCDVjLKSlIxtw_8KJ8oklp';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Saves order details to the Supabase backend database.
 * Designed to handle standard Postgres columns and JSON structures gracefully.
 */
export async function saveOrderToSupabase(order: Order, userId?: string | null) {
  try {
    console.log(`[Supabase] Initiating sync for Order ${order.id}...`);

    // Build the payload
    const orderPayload = {
      id: order.id,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      status: order.status,
      delivery_address: order.deliveryAddress, // Saved as JSONB/JSON or TEXT
      items: order.items,                     // Saved as JSONB/JSON or TEXT
      created_at: new Date().toISOString(),
      user_id: userId || null,
      eta: order.eta
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select();

    if (error) {
      console.error(`[Supabase Error] Direct insert failed for order ${order.id}:`, error.message);
      
      // Fallback: If inserting into 'orders' failed due to a missing or different schema,
      // we can try inserting into a generic 'logs' or 'order_sync' table if they have one,
      // or we can just throw so it is logged in the console.
      throw error;
    }

    console.log(`[Supabase Success] Order ${order.id} saved to Supabase successfully:`, data);
    return data;
  } catch (err: any) {
    console.error(`[Supabase Sync Failed] Could not sync order ${order.id} to Supabase. Details:`, err.message || err);
    // Note: We catch the error here so that local order placement is not disrupted
    // even if the user's Supabase tables are not fully configured with the exact schema yet.
  }
}
