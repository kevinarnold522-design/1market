/**
 * AISmartReply — appears in Messages page
 * Suggests contextual smart replies based on the conversation.
 */
import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AISmartReply({ messages, listingTitle, onSelectReply }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [generated, setGenerated] = useState(false);

  const lastMessages = (messages || []).slice(-4).map(m =>
    `${m.sender_name || 'Unknown'}: "${m.message}"`
  ).join('\n');

  const generate = async () => {
    setLoading(true);
    setSuggestions([]);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful assistant for a Filipino marketplace (1MarketPH.com).
Generate 3 short, natural reply suggestions for this conversation about "${listingTitle || 'a listing'}".

Recent messages:
${lastMessages || 'No messages yet - this is a new inquiry.'}

Rules:
- Keep each reply under 25 words
- Be friendly and Filipino-natural (light Taglish is OK)  
- One reply should confirm interest, one should ask about price/availability, one should be a polite follow-up
- Do NOT use markdown or asterisks`,
        response_json_schema: {
          type: 'object',
          properties: {
            replies: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      });
      setSuggestions(res?.replies || []);
      setGenerated(true);
    } catch {
      setSuggestions(['Hi! Is this still available?', 'Pwede bang tawad?', 'Interested po ako, can we meetup?']);
      setGenerated(true);
    }
    setLoading(false);
  };

  if (generated && suggestions.length > 0) {
    return (
      <div className="px-3 pb-2">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3 h-3 text-[#00D4FF]" />
          <span className="font-body text-[10px] text-white/40 font-bold uppercase tracking-wider">AI Suggestions</span>
          <button onClick={() => { setSuggestions([]); setGenerated(false); }}
            className="ml-auto font-body text-[9px] text-white/20 hover:text-white/50">hide</button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => { onSelectReply(s); setSuggestions([]); setGenerated(false); }}
              className="px-2.5 py-1.5 rounded-xl font-body text-xs text-white/70 hover:text-white transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
              {s}
            </button>
          ))}
          <button onClick={generate} className="px-2.5 py-1.5 rounded-xl font-body text-[10px] text-white/30 hover:text-white/60 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            ↻ More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 pb-2">
      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs transition-all"
        style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
        {loading
          ? <><Loader2 className="w-3 h-3 text-[#00D4FF] animate-spin" /><span className="text-[#00D4FF]/70">Thinking...</span></>
          : <><Sparkles className="w-3 h-3 text-[#00D4FF]" /><span className="text-[#00D4FF]/70">AI Smart Reply</span></>}
      </button>
    </div>
  );
}