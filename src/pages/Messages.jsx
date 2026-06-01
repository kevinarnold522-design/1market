import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarField from '../components/StarField';
import Navbar from '../components/home/Navbar';
import { base44 } from '@/api/base44Client';

export default function Messages() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) { setLoading(false); return; }
        const me = await base44.auth.me();
        setUser(me);
        // Load all chats involving this user
        const [asBuyer, asSeller] = await Promise.all([
          base44.entities.ChatMessage.filter({ buyer_email: me.email }),
          base44.entities.ChatMessage.filter({ seller_email: me.email }),
        ]);
        const all = [...asBuyer, ...asSeller];
        // Group by listing + other party
        const convoMap = {};
        all.forEach(msg => {
          const other = msg.buyer_email === me.email ? msg.seller_email : msg.buyer_email;
          const key = `${msg.listing_id}_${other}`;
          if (!convoMap[key]) convoMap[key] = { key, listing_id: msg.listing_id, listing_title: msg.listing_title, other_email: other, messages: [], last_time: msg.created_date };
          convoMap[key].messages.push(msg);
          if (msg.created_date > convoMap[key].last_time) convoMap[key].last_time = msg.created_date;
        });
        const convos = Object.values(convoMap).sort((a,b) => new Date(b.last_time) - new Date(a.last_time));
        setConversations(convos);
      } catch {}
      setLoading(false);
    };
    init();
  }, []);

  const openConvo = (convo) => {
    setActiveConvo(convo);
    setMessages(convo.messages.sort((a,b) => new Date(a.created_date) - new Date(b.created_date)));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeConvo || !user) return;
    const isBuyer = user.email !== activeConvo.other_email;
    const msg = await base44.entities.ChatMessage.create({
      listing_id: activeConvo.listing_id,
      listing_title: activeConvo.listing_title,
      seller_email: isBuyer ? activeConvo.other_email : user.email,
      buyer_email: isBuyer ? user.email : activeConvo.other_email,
      sender_email: user.email,
      sender_name: user.full_name || 'Member',
      message: newMsg.trim(),
    });
    setMessages(m => [...m, msg]);
    setNewMsg('');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-[#070F1A] flex flex-col items-center justify-center gap-4">
      <StarField /><Navbar />
      <MessageSquare className="w-12 h-12 text-white/20" />
      <p className="font-body text-white/50">Sign in to view your messages</p>
      <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
        className="px-6 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors">
        Sign In
      </button>
    </div>
  );

  const filteredConvos = conversations.filter(c =>
    !search || (c.listing_title || '').toLowerCase().includes(search.toLowerCase()) || c.other_email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <StarField />
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-5 h-5 text-[#00D4FF]" />
          <h1 className="font-heading font-bold text-white text-xl">Messages</h1>
        </div>
        <div className="grid md:grid-cols-5 gap-4 h-[70vh]">
          {/* Sidebar */}
          <div className="md:col-span-2 rounded-2xl overflow-hidden flex flex-col" style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(0,212,255,0.12)' }}>
            <div className="p-3 border-b border-white/8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                  className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl font-body text-xs text-white placeholder-white/25 focus:outline-none" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConvos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center p-6">
                  <MessageSquare className="w-8 h-8 text-white/15" />
                  <p className="font-body text-xs text-white/30">No conversations yet</p>
                </div>
              ) : filteredConvos.map(convo => (
                <button key={convo.key} onClick={() => openConvo(convo)}
                  className={`w-full text-left px-4 py-3 border-b border-white/5 transition-all hover:bg-white/5 ${activeConvo?.key === convo.key ? 'bg-[#00D4FF]/10 border-l-2 border-l-[#00D4FF]' : ''}`}>
                  <p className="font-body font-bold text-xs text-white truncate">{convo.listing_title || 'Listing'}</p>
                  <p className="font-body text-[10px] text-white/40 truncate">{convo.other_email}</p>
                  <p className="font-body text-[10px] text-white/25 mt-0.5">{convo.messages.length} message{convo.messages.length !== 1 ? 's' : ''}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="md:col-span-3 rounded-2xl overflow-hidden flex flex-col" style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(0,212,255,0.12)' }}>
            {!activeConvo ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center p-6">
                <MessageSquare className="w-10 h-10 text-white/15" />
                <p className="font-body text-sm text-white/30">Select a conversation</p>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-white/8">
                  <p className="font-body font-bold text-sm text-white">{activeConvo.listing_title || 'Listing'}</p>
                  <p className="font-body text-[10px] text-white/40">{activeConvo.other_email}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender_email === user.email ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-2xl font-body text-xs leading-relaxed ${msg.sender_email === user.email ? 'bg-[#2563EB] text-white rounded-br-sm' : 'bg-white/10 text-white/80 rounded-bl-sm'}`}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="p-3 border-t border-white/8 flex gap-2">
                  <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-body text-xs placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/40" />
                  <button type="submit" disabled={!newMsg.trim()}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}