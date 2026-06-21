const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';

function serviceHeaders() {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
}

Deno.serve(async (req) => {
  try {
    const { name, message } = await req.json();
    if (!message) return Response.json({ error: 'Message is required' }, { status: 400 });

    const response = await fetch(`${SUPABASE_URL}/rest/v1/1marketph`, {
      method: 'POST',
      headers: serviceHeaders(),
      body: JSON.stringify({ entity_name: 'Feedback', title: name || 'Anonymous', data: { name: name || 'Anonymous', message } })
    });
    if (!response.ok) throw new Error(await response.text());

    return Response.json({ success: true, stored: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});