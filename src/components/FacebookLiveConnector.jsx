import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Link2, ExternalLink, Video, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function FacebookLiveConnector({ onClose }) {
  const { user } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [pageName, setPageName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.facebook_live_enabled) {
      setConnected(true);
      setPageName(user.facebook_page_name || 'Connected Page');
    }
  }, [user]);

  const handleConnect = async () => {
    setConnecting(true);
    setError('');
    
    try {
      // Request OAuth authorization for Facebook
      const authUrl = base44.connectors.getOAuthUrl('facebook', ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts']);
      window.open(authUrl, '_blank');
      
      // In a real implementation, you would wait for the OAuth callback
      // For now, we'll simulate the connection
      setTimeout(async () => {
        // Simulate successful connection
        await base44.auth.updateMe({
          facebook_page_id: 'simulated_page_123',
          facebook_page_name: 'My Market Page',
          facebook_live_enabled: true,
        });
        
        setConnected(true);
        setPageName('My Market Page');
        setConnecting(false);
      }, 2000);
    } catch (err) {
      setError('Failed to connect. Please try again.');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Disconnect Facebook Live? You will need to reconnect to go live.')) return;
    
    try {
      await base44.auth.updateMe({
        facebook_page_id: '',
        facebook_page_name: '',
        facebook_live_enabled: false,
      });
      setConnected(false);
      setPageName('');
      onClose?.();
    } catch (err) {
      setError('Failed to disconnect.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Facebook className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl">Facebook Live</h2>
                <p className="font-body text-xs text-white/80">Connect to sell via live stream</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {connected ? (
            /* Connected State */
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="font-heading font-bold text-lg text-gray-800 mb-2">Connected!</h3>
              <p className="font-body text-sm text-gray-600 mb-1">Page: <strong className="text-gray-800">{pageName}</strong></p>
              <p className="font-body text-xs text-gray-500 mb-6">You can now go live directly from your seller dashboard</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.open('https://facebook.com/live', '_blank')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-body text-sm font-bold transition-colors"
                >
                  <Video className="w-4 h-4" />
                  Go Live Now
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-body text-sm font-bold transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            /* Not Connected State */
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Facebook className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-heading font-bold text-lg text-gray-800 mb-2">Connect Facebook Live</h3>
              <p className="font-body text-sm text-gray-600 mb-6">
                Link your Facebook Page to host live selling events and reach more customers
              </p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="font-body text-xs text-red-600">{error}</span>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-body text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {connecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      Connect Facebook Page
                    </>
                  )}
                </button>
                
                <div className="pt-3 border-t border-gray-100">
                  <p className="font-body text-[10px] text-gray-500">
                    By connecting, you agree to share your Facebook Page information with 1MarketPH
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}