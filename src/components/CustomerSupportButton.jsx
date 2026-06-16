import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, MessageCircle, Mail, Phone, FileText, ExternalLink, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ_ITEMS = [
  { q: 'How do I list my product?', a: 'Go to Profile → My Listings → Add New Listing. Fill in details and publish.' },
  { q: 'How do I become a verified seller?', a: 'Go to Profile → Settings → Request Verification. Our team will review within 48 hours.' },
  { q: 'How do I contact a seller?', a: 'Click on any listing and tap "Contact Seller" to send a message or call.' },
  { q: 'Is 1Marketph free to use?', a: 'Yes! Signing up, browsing, and listing basic items is 100% free.' },
];

export default function CustomerSupportButton() {
  const [open, setOpen] = useState(false);
  const [showFaq, setShowFaq] = useState(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-support', handler);
    return () => window.removeEventListener('open-support', handler);
  }, []);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.open('https://www.facebook.com/share/14kSkbPDNnd/?mibextid=wwXIfr', '_blank', 'noopener,noreferrer')}
        className="fixed top-24 right-4 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'linear-gradient(135deg,#0A192F,#1d3a6e)', border: '1.5px solid rgba(0,212,255,0.35)', boxShadow: '0 0 18px rgba(0,212,255,0.2)' }}
        title="Customer Support"
      >
        <HelpCircle className="w-5 h-5 text-[#00D4FF]" />
      </motion.button>

      {/* Support Panel */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-start justify-end pt-20 pr-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="w-80 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto max-h-[80vh] overflow-y-auto"
              style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              {/* Header */}
              <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between"
                style={{ background: 'linear-gradient(135deg,#0A192F,#1d3a6e)' }}>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#00D4FF]" />
                  <span className="font-heading font-bold text-white text-sm">Support Center</span>
                </div>
                <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-3.5 h-3.5 text-white/60" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {/* Quick actions */}
                <div className="space-y-1.5">
                  <p className="font-body text-[10px] text-white/30 uppercase tracking-wider mb-2">Contact Us</p>
                  <a href="mailto:kevin@1marketph.com"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <Mail className="w-4 h-4 text-[#00D4FF]" />
                    <div>
                      <p className="font-body text-xs text-white font-semibold">Email Support</p>
                      <p className="font-body text-[10px] text-white/30">kevin@1marketph.com</p>
                    </div>
                  </a>
                  <a href="https://www.facebook.com/share/14kSkbPDNnd/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="font-body text-xs text-white font-semibold">Facebook Messenger</p>
                      <p className="font-body text-[10px] text-white/30">Fastest response</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/20 ml-auto" />
                  </a>
                </div>

                {/* FAQ */}
                <div>
                  <p className="font-body text-[10px] text-white/30 uppercase tracking-wider mb-2">Common Questions</p>
                  <div className="space-y-1.5">
                    {FAQ_ITEMS.map((item, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-white/8">
                        <button onClick={() => setShowFaq(showFaq === i ? null : i)}
                          className="w-full flex items-center justify-between p-2.5 text-left hover:bg-white/5 transition-colors">
                          <p className="font-body text-xs text-white/70 pr-2">{item.q}</p>
                          <ChevronRight className={`w-3.5 h-3.5 text-white/20 flex-shrink-0 transition-transform ${showFaq === i ? 'rotate-90' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {showFaq === i && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden">
                              <p className="font-body text-[11px] text-[#00D4FF]/70 px-2.5 pb-2.5">{item.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                <Link to="/privacy-policy" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <FileText className="w-3.5 h-3.5 text-white/40" />
                  <p className="font-body text-xs text-white/50">Privacy Policy & Terms</p>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}