const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';

function serviceHeaders() {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
}

async function selectRows(table, query = '') {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, { headers: serviceHeaders() });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
}

Deno.serve(async (req) => {
  try {
    const { user_email, conversation_user_email } = await req.json().catch(() => ({}));
    let messages = [];

    if (user_email && conversation_user_email) {
      const sent = await selectRows('chat_messages', `?sender_email=eq.${encodeURIComponent(user_email)}&select=*`);
      const received = await selectRows('chat_messages', `?sender_email=eq.${encodeURIComponent(conversation_user_email)}&select=*`);
      messages = [...sent, ...received].filter((m) =>
        (m.buyer_email === user_email || m.seller_email === user_email) &&
        (m.buyer_email === conversation_user_email || m.seller_email === conversation_user_email)
      ).sort((a, b) => new Date(a.created_at || a.created_date || 0) - new Date(b.created_at || b.created_date || 0));
    } else if (user_email) {
      const asBuyer = await selectRows('chat_messages', `?buyer_email=eq.${encodeURIComponent(user_email)}&select=*`);
      const asSeller = await selectRows('chat_messages', `?seller_email=eq.${encodeURIComponent(user_email)}&select=*`);
      messages = [...asBuyer, ...asSeller].sort((a, b) => new Date(b.created_at || b.created_date || 0) - new Date(a.created_at || a.created_date || 0));
    } else {
      messages = await selectRows('chat_messages', '?select=*&order=created_at.desc&limit=200');
    }

    return Response.json({ messages });
  } catch (error) {
    console.error('adminViewMessages error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});