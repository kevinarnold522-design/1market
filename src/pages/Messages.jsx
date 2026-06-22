import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Search, ArrowLeft, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AISmartReply from '../components/messages/AISmartReply';

function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

function getInitials(email) {
  return (email || 'U').split('@')[0].slice(0, 2).toUpperCase();
}

export default function Messages() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) { setLoading(false); return; }
        const me = await base44.auth.me();
        setUser(me);
        await loadConversations(me);
      } catch {}
      setLoading(false);
    };
    init();
  }, []);

  const loadConversations = async (me) => {
    const [asBuyer, asSeller] = await Promise.all([
      base44.entities.ChatMessage.filter({ buyer_email: me.email }),
      base44.entities.ChatMessage.filter({ seller_email: me.email }),
    ]);
    const all = [...asBuyer, ...asSeller];
    const convoMap = {};
    all.forEach(msg => {
      const other = msg.buyer_email === me.email ? msg.seller_email : msg.buyer_email;
      const key = `${msg.listing_id}__${other}`;
      if (!convoMap[key]) {
        convoMap[key] = {
          key,
          listing_id: msg.listing_id,
          listing_title: msg.listing_title || 'Conversation',
          other_email: other,
          messages: [],
          last_time: msg.created_date,
        };
      }
      convoMap[key].messages.push(msg);
      if (new Date(msg.created_date) > new Date(convoMap[key].last_time)) {
        convoMap[key].last_time = msg.created_date;
      }
    });
    const convos = Object.values(convoMap).sort((a, b) => new Date(b.last_time) - new Date(a.last_time));
    setConversations(convos);
    return convos;
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const openConvo = (convo) => {
    const sorted = [...convo.messages].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    setActiveConvo(convo);
    setMessages(sorted);
    if (isMobile) setShowChat(true);
  };

  const sendMessage = async (e) => {
    e && e.preventDefault();
    if (!newMsg.trim() || !activeConvo || !user || sending) return;
    setSending(true);
    const isBuyer = user.email !== activeConvo.other_email;
    const msg = await base44.entities.ChatMessage.create({
      listing_id: activeConvo.listing_id,
      listing_title: activeConvo.listing_title,
      seller_email: isBuyer ? activeConvo.other_email : user.email,
      buyer_email: isBuyer ? user.email : activeConvo.other_email,
      sender_email: user.email,
      sender_name: user.full_name || 'Member',
      message: newMsg.trim(),
      chat_type: 'listing',
    });
    setMessages(m => [...m, msg]);
    setConversations(convos =>
      convos.map(c => c.key === activeConvo.key ? { ...c, messages: [...c.messages, msg], last_time: msg.created_date } : c)
    );
    setNewMsg('');
    setSending(false);
  };

  const filteredConvos = conversations.filter(c =>
    !search ||
    (c.listing_title || '').toLowerCase().includes(search.toLowerCase()) ||
    c.other_email.toLowerCase().includes(search.toLowerCase())
  );

  const lastMessage = (convo) => {
    const sorted = [...convo.messages].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    return sorted[0];
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#070F1A' }}>
      <div className="w-8 h-8 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6" style={{ background: '#070F1A' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
        <MessageSquare className="w-8 h-8 text-[#00D4FF]/40" />
      </div>
      <p className="font-heading font-bold text-xl text-white">Sign in to view Messages</p>
      <p className="font-body text-sm text-white/40">Connect and chat with sellers and buyers</p>
      <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
        className="px-6 py-3 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
        Sign In to Continue
      </button>
    </div>
  );

  const ConvoList = () => (
    <div className="flex flex-col h-full" style={{ width: isMobile ? '100%' : 280, flexShrink: 0 }}>
      <div className="p-3 border-b border-white/8 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl font-body text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/30" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConvos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
            <MessageSquare className="w-10 h-10 text-white/10" />
            <p className="font-body text-xs text-white/30">No conversations yet</p>
            <p className="font-body text-[10px] text-white/20">Message a seller from their profile or listing</p>
          </div>
        ) : filteredConvos.map(convo => {
          const last = lastMessage(convo);
          const isActive = activeConvo?.key === convo.key;
          return (
            <button key={convo.key} onClick={() => openConvo(convo)}
              className={`w-full text-left px-4 py-3 border-b border-white/5 transition-all hover:bg-white/5 ${isActive ? 'bg-[#00D4FF]/8' : ''}`}
              style={{ borderLeft: isActive ? '3px solid #00D4FF' : '3px solid transparent' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xs text-white"
                  style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                  {getInitials(convo.other_email)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-body font-bold text-xs text-white truncate">{convo.other_email}</p>
                    <p className="font-body text-[9px] text-white/25 flex-shrink-0 ml-1">{formatTime(convo.last_time)}</p>
                  </div>
                  <p className="font-body text-[10px] text-white/35 truncate">{last?.message || '...'}</p>
                  {convo.listing_title && convo.listing_title !== 'Conversation' && (
                    <p className="font-body text-[9px] text-white/20 truncate mt-0.5">{convo.listing_title}</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const ChatPanel = () => (
    <div className="flex-1 flex flex-col min-w-0 border-l border-white/8">
      {!activeConvo ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <MessageSquare className="w-8 h-8 text-[#00D4FF]/30" />
          </div>
          <p className="font-heading font-bold text-lg text-white/50">Select a conversation</p>
          <p className="font-body text-xs text-white/25">Choose from the list to start chatting</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 flex-shrink-0"
            style={{ background: 'rgba(13,31,60,0.8)' }}>
            {isMobile && (
              <button onClick={() => { setShowChat(false); setActiveConvo(null); }}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5 text-white" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs text-white"
              style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
              {getInitials(activeConvo.other_email)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-bold text-sm text-white truncate">{activeConvo.other_email}</p>
              {activeConvo.listing_title && activeConvo.listing_title !== 'Conversation' && (
                <p className="font-body text-[10px] text-white/35 truncate">{activeConvo.listing_title}</p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ background: 'linear-gradient(180deg,#07111F,#0A192F)' }}>
            {messages.map((msg, i) => {
              const isMe = msg.sender_email === user.email;
              return (
                <div key={msg.id || i} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-[9px] text-white mb-0.5"
                      style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                      {getInitials(msg.sender_email)}
                    </div>
                  )}
                  <div className={`max-w-[72%] flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`px-3.5 py-2.5 font-body text-sm leading-relaxed break-words rounded-2xl ${isMe ? 'rounded-br-md text-white' : 'rounded-bl-md text-white/85'}`}
                      style={isMe
                        ? { background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', boxShadow: '0 2px 12px rgba(37,99,235,0.3)' }
                        : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {msg.message}
                    </div>
                    <p className="font-body text-[9px] text-white/25 px-1">{formatTime(msg.created_date)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Smart Reply */}
          <AISmartReply
            messages={messages}
            listingTitle={activeConvo?.listing_title}
            onSelectReply={(reply) => setNewMsg(reply)}
          />

          {/* Input */}
          <form onSubmit={sendMessage} className="flex items-end gap-2 p-3 border-t border-white/8 flex-shrink-0"
            style={{ background: 'rgba(13,31,60,0.95)' }}>
            <textarea
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type a message... (Enter to send)"
              rows={1}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/40 resize-none"
              style={{ maxHeight: 120 }}
            />
            <button type="submit" disabled={!newMsg.trim() || sending}
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
              {sending
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Send className="w-4 h-4 text-white" />}
            </button>
          </form>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#070F1A' }}>
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <MessageSquare className="w-5 h-5 text-[#00D4FF]" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-white">Messages</h1>
            <p className="font-body text-xs text-white/35">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden flex" style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(0,212,255,0.1)', height: 'calc(100vh - 160px)', minHeight: 480 }}>
          {/* Conversation list — mobile: hide when chat open */}
          {(!isMobile || !showChat) && <ConvoList />}
          {/* Chat — mobile: only show when selected */}
          {(!isMobile || showChat) && <ChatPanel />}
        </div>
      </div>
    </div>
  );
}