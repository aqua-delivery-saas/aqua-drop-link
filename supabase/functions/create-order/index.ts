import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderItemInput {
  product_id: string;
  product_name: string;
  product_liters: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface CreateOrderRequest {
  distributor_id: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'immediate' | 'scheduled';
  scheduled_date?: string | null;
  delivery_period?: 'manha' | 'tarde' | 'noite' | null;
  delivery_street: string;
  delivery_neighborhood?: string | null;
  delivery_city?: string | null;
  delivery_state?: string | null;
  delivery_zip_code?: string | null;
  delivery_number?: string | null;
  delivery_complement?: string | null;
  payment_method: 'dinheiro' | 'pix' | 'cartao' | 'cartao_entrega';
  subtotal: number;
  discount_amount: number;
  total: number;
  notes?: string | null;
  items: OrderItemInput[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create admin client with service role (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is authenticated (optional - for setting customer_id)
    let customerId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      
      if (!authError && user) {
        customerId = user.id;
        console.log('Authenticated user:', user.id);
      }
    }

    // Parse request body
    const body: CreateOrderRequest = await req.json();
    console.log('Creating order for distributor:', body.distributor_id);
    console.log('Customer ID:', customerId || 'anonymous');

    // Validate required fields
    if (!body.distributor_id || !body.customer_name || !body.customer_phone || !body.delivery_street || !body.payment_method) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios não preenchidos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.items || body.items.length === 0) {
      console.error('No items in order');
      return new Response(
        JSON.stringify({ error: 'Pedido deve conter pelo menos um item' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert order using service role (bypasses RLS)
    const { data: createdOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        distributor_id: body.distributor_id,
        customer_id: customerId,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        order_type: body.order_type,
        scheduled_date: body.scheduled_date || null,
        delivery_period: body.delivery_period || null,
        delivery_street: body.delivery_street,
        delivery_neighborhood: body.delivery_neighborhood || null,
        delivery_city: body.delivery_city || null,
        delivery_state: body.delivery_state || null,
        delivery_zip_code: body.delivery_zip_code || null,
        delivery_number: body.delivery_number || null,
        delivery_complement: body.delivery_complement || null,
        payment_method: body.payment_method,
        subtotal: body.subtotal,
        discount_amount: body.discount_amount,
        total: body.total,
        notes: body.notes || null,
        status: 'novo',
      })
      .select('id, order_number')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar pedido', details: orderError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created:', createdOrder.id, 'Number:', createdOrder.order_number);

    // Insert order items
    const orderItems = body.items.map(item => ({
      order_id: createdOrder.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_liters: item.product_liters,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback: delete the order if items failed
      await supabaseAdmin.from('orders').delete().eq('id', createdOrder.id);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar itens do pedido', details: itemsError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order items created successfully');

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: createdOrder.id,
          order_number: createdOrder.order_number,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
