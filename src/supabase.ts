import { createClient } from '@supabase/supabase-js';
import { Order, Product } from './types';

const supabaseUrl = 
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) || 
  (typeof window !== 'undefined' && (window as any).env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || 
  'https://kkfemwduwimomkalgzua.supabase.co';

const supabaseKey = 
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) || 
  (typeof window !== 'undefined' && (window as any).env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 
  'sb_publishable_wCXTH0DusaCDVjLKSlIxtw_8KJ8oklp';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Normalizes a product record from Supabase, mapping snake_case keys to camelCase.
 */
export function normalizeSupabaseProduct(dbProduct: any): Product {
  if (!dbProduct) return dbProduct;

  // The "variants" column holds size/pack choices (e.g. Ghee 250gm vs 500gm)
  // as JSONB. Supabase's client usually gives this back as a parsed array
  // already, but handle a raw JSON string too just in case.
  let variants = dbProduct.variants;
  if (typeof variants === 'string') {
    try {
      variants = JSON.parse(variants);
    } catch (e) {
      variants = undefined;
    }
  }

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand || '',
    category: dbProduct.category || '',
    price: dbProduct.price !== undefined ? Number(dbProduct.price) : 0,
    mrp: dbProduct.mrp !== undefined ? Number(dbProduct.mrp) : 0,
    unit: dbProduct.unit || '',
    description: dbProduct.description || '',
    isVeg: dbProduct.is_veg !== undefined ? dbProduct.is_veg : (dbProduct.isVeg !== undefined ? dbProduct.isVeg : true),
    specialOffer: dbProduct.special_offer || dbProduct.specialOffer || '',
    colorTheme: dbProduct.color_theme || dbProduct.colorTheme || 'emerald',
    rating: dbProduct.rating !== undefined ? Number(dbProduct.rating) : 4.5,
    reviewsCount: dbProduct.reviews_count !== undefined ? Number(dbProduct.reviews_count) : (dbProduct.reviewsCount !== undefined ? dbProduct.reviewsCount : 10),
    inStock: dbProduct.in_stock !== undefined ? dbProduct.in_stock : (dbProduct.inStock !== undefined ? dbProduct.inStock : true),
    image: dbProduct.image || '',
    variants: Array.isArray(variants) && variants.length > 0 ? variants : undefined,
  };
}

/**
 * Normalizes an order record from Supabase, mapping snake_case keys to camelCase.
 */
export function normalizeSupabaseOrder(dbOrder: any): Order {
  if (!dbOrder) return dbOrder;

  let items = dbOrder.items || [];
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch (e) {
      items = [];
    }
  }

  let deliveryAddress = dbOrder.delivery_address || dbOrder.deliveryAddress;
  if (typeof deliveryAddress === 'string') {
    try {
      deliveryAddress = JSON.parse(deliveryAddress);
    } catch (e) {
      deliveryAddress = {};
    }
  }

  const normalizedItems = (Array.isArray(items) ? items : []).map((it: any) => ({
    product: normalizeSupabaseProduct(it.product),
    quantity: Number(it.quantity) || 1,
  }));

  return {
    // This table's identifier column is called "Name" (not "id") and holds
    // values like "ord-44714" - map it straight to Order.id.
    id: dbOrder.Name || dbOrder.id,
    items: normalizedItems,
    totalAmount: dbOrder.total_amount !== undefined ? Number(dbOrder.total_amount) : (dbOrder.totalAmount || 0),
    deliveryAddress: {
      name: deliveryAddress?.name || '',
      phone: deliveryAddress?.phone || '',
      flat: deliveryAddress?.flat || '',
      area: deliveryAddress?.area || '',
      landmark: deliveryAddress?.landmark || '',
      city: deliveryAddress?.city || '',
      pincode: deliveryAddress?.pincode || '',
      email: deliveryAddress?.email || '',
      address: deliveryAddress?.address || '',
      latitude: deliveryAddress?.latitude || '',
      longitude: deliveryAddress?.longitude || '',
    },
    paymentMethod: dbOrder.payment_method || dbOrder.paymentMethod || 'cod',
    status: dbOrder.status || 'pending',
    timestamp: dbOrder.created_at || dbOrder.timestamp || new Date().toISOString(),
    // There's no "eta" column in the orders table - derive a sensible default
    // from status instead of reading a column that doesn't exist.
    eta: dbOrder.eta !== undefined
      ? Number(dbOrder.eta)
      : (dbOrder.status === 'delivered' ? 0 : dbOrder.status === 'dispatched' ? 4 : dbOrder.status === 'preparing' ? 8 : 10),
  };
}

/**
 * Saves order details to the Supabase backend database.
 * Designed to handle standard Postgres columns and JSON structures gracefully.
 */
export async function saveOrderToSupabase(order: Order, userId?: string | null) {
  try {
    console.log(`[Supabase] Initiating sync for Order ${order.id}...`);

    // Build the payload - matches the actual orders table columns:
    // created_at, total_amount, payment_method, status, delivery_address,
    // items, user_id, Name (this table has no "id" or "eta" column).
    const orderPayload = {
      Name: order.id,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      status: order.status,
      delivery_address: order.deliveryAddress, // Saved as JSONB/JSON or TEXT
      items: order.items,                     // Saved as JSONB/JSON or TEXT
      created_at: new Date().toISOString(),
      user_id: userId || null,
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
