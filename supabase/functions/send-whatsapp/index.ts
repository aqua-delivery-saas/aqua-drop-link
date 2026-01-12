const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendWhatsAppRequest {
  to: string;
  message: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const whapiToken = Deno.env.get('WHAPI_TOKEN');
    
    if (!whapiToken) {
      console.error('WHAPI_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'WHAPI_TOKEN not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { to, message }: SendWhatsAppRequest = await req.json();

    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format number for Whapi (5511999999999@s.whatsapp.net)
    let cleanNumber = to.replace(/\D/g, '');
    
    // Garantir código do país (55 para Brasil)
    if (!cleanNumber.startsWith('55')) {
      cleanNumber = '55' + cleanNumber;
    }
    
    const formattedNumber = cleanNumber + '@s.whatsapp.net';

    console.log('=== WHATSAPP SEND DEBUG ===');
    console.log('1. Raw "to" received:', to);
    console.log('2. Clean number with country code:', cleanNumber);
    console.log('3. Formatted for Whapi:', formattedNumber);
    console.log('===========================');

    // Send message via Whapi Cloud
    const response = await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whapiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        to: formattedNumber,
        body: message,
        typing_time: 0,
      }),
    });

    const result = await response.json();
    
    console.log('Whapi Response Status:', response.status);
    console.log('Whapi Response Body:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.error('Whapi error:', result);
      return new Response(
        JSON.stringify({ error: result.message || 'Failed to send WhatsApp message', details: result }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('WhatsApp message sent successfully:', result.message?.id);

    return new Response(
      JSON.stringify({ success: true, messageId: result.message?.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
