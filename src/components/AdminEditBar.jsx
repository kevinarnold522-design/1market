import React, { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { Shield, EyeOff, Pencil } from 'lucide-react';

// Context so any component can read editMode
const AdminEditContext = createContext({ editMode: false });
export const useAdminEditMode = () => useContext(AdminEditContext);

/**
 * Floating admin Edit Mode toggle bar.
 * Wrap your app (or page) with <AdminEditProvider> and use useAdminEditMode() to read editMode.
 * This component itself renders the floating toggle bar for admins.
 */
export function AdminEditProvider({ isAdmin, children }) {
  const [editMode, setEditMode] = useState(false);

  return (
    <AdminEditContext.Provider value={{ editMode: isAdmin && editMode, setEditMode }}>
      {children}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl"
          style={{ background: editMode ? 'rgba(0,212,255,0.95)' : 'rgba(13,31,60,0.97)', border: `1.5px solid ${editMode ? 'rgba(0,212,255,0.5)' : 'rgba(245,158,11,0.4)'}`, backdropFilter: 'blur(12px)' }}
        >
          <Shield className={`w-4 h-4 ${editMode ? 'text-[#0A192F]' : 'text-amber-400'}`} />
          <span className={`font-body text-xs font-bold ${editMode ? 'text-[#0A192F]' : 'text-amber-300'}`}>
            {editMode ? 'Edit Mode ON — Click any to edit' : 'Admin View'}
          </span>
          <button
            onClick={() => setEditMode(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body font-bold text-xs transition-all ${editMode ? 'bg-[#0A192F] text-[#00D4FF]' : 'bg-amber-500 text-white hover:bg-amber-400'}`}
          >
            {editMode ? <><EyeOff className="w-3 h-3"/> Exit Edit</> : <><Pencil className="w-3 h-3"/> Enable Editing</>}
          </button>
        </motion.div>
      )}
    </AdminEditContext.Provider>
  );
}

export default AdminEditProvider;