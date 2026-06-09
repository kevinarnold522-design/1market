import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { user_email, conversation_user_email } = await req.json();

    let messages;
    if (user_email && conversation_user_email) {
      // Get conversation between two specific users
      const sent = await base44.asServiceRole.entities.ChatMessage.filter({ sender_email: user_email });
      const received = await base44.asServiceRole.entities.ChatMessage.filter({ sender_email: conversation_user_email });
      const allMsgs = [...sent, ...received].filter(m =>
        (m.buyer_email === user_email || m.seller_email === user_email) &&
        (m.buyer_email === conversation_user_email || m.seller_email === conversation_user_email)
      );
      messages = allMsgs.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    } else if (user_email) {
      // Get all messages involving a specific user
      const asBuyer = await base44.asServiceRole.entities.ChatMessage.filter({ buyer_email: user_email });
      const asSeller = await base44.asServiceRole.entities.ChatMessage.filter({ seller_email: user_email });
      messages = [...asBuyer, ...asSeller].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else {
      // Get all recent messages
      messages = await base44.asServiceRole.entities.ChatMessage.list('-created_date', 200);
    }

    return Response.json({ messages });
  } catch (error) {
    console.error('adminViewMessages error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});