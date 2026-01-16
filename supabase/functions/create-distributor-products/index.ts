import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProductData {
  brandId: string;
  name: string;
  liters: number;
  price: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Cliente com token do usuário (para verificar autenticação)
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verificar usuário autenticado
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Cliente com service_role para bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { distributorId, products } = await req.json() as { 
      distributorId: string; 
      products: ProductData[] 
    }

    if (!distributorId || !products || products.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Dados inválidos: distributorId e products são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verificar se o distributor pertence ao usuário autenticado
    const { data: distributor, error: distributorError } = await supabaseAdmin
      .from('distributors')
      .select('id, user_id')
      .eq('id', distributorId)
      .single()

    if (distributorError || !distributor) {
      console.error('Distributor lookup error:', distributorError)
      return new Response(
        JSON.stringify({ error: 'Distribuidora não encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (distributor.user_id !== user.id) {
      console.error('User mismatch:', { distributorUserId: distributor.user_id, authUserId: user.id })
      return new Response(
        JSON.stringify({ error: 'Você não tem permissão para esta distribuidora' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Preparar produtos para inserção
    const productsToInsert = products.map((p: ProductData, index: number) => ({
      distributor_id: distributorId,
      brand_id: p.brandId,
      name: p.name,
      liters: p.liters,
      price: p.price,
      is_available: true,
      sort_order: index,
    }))

    console.log('Inserting products:', productsToInsert.length)

    // Inserir produtos usando service_role (bypass RLS)
    const { data: insertedProducts, error: insertError } = await supabaseAdmin
      .from('products')
      .insert(productsToInsert)
      .select()

    if (insertError) {
      console.error('Error inserting products:', insertError)
      return new Response(
        JSON.stringify({ error: `Erro ao criar produtos: ${insertError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Products created successfully:', insertedProducts?.length)

    return new Response(
      JSON.stringify({ success: true, products: insertedProducts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
