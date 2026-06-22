import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield, AlertTriangle, AlertCircle, Lock, FileText, Bell } from 'lucide-react';

const DPA_CRITERIA = [
  {
    id: 'consent',
    label: 'Explicit consent is obtained from users before collecting or processing any personal data.',
    icon: FileText,
  },
  {
    id: 'legitimacy',
    label: 'A specific, declared, and legitimate purpose is clearly communicated to the data subject.',
    icon: Shield,
  },
  {
    id: 'proportionality',
    label: 'Data collection is limited strictly to what is necessary for the stated purpose (not excessive).',
    icon: AlertCircle,
  },
  {
    id: 'rights',
    label: 'Users are explicitly informed of their rights to access, correct, object to, or erase their stored data.',
    icon: Lock,
  },
  {
    id: 'security',
    label: 'Organizational, physical, and technical safeguards (like encryption and access controls) are active.',
    icon: Shield,
  },
  {
    id: 'breach',
    label: 'A formal incident response mechanism is ready to report data breaches within 72 hours.',
    icon: Bell,
  },
];

export default function DPAComplianceChecker({ onComplianceChange, required = false }) {
  const [checkedItems, setCheckedItems] = useState({
    consent: false,
    legitimacy: false,
    proportionality: false,
    rights: false,
    security: false,
    breach: false,
  });

  const complianceScore = Math.round(
    (Object.values(checkedItems).filter(Boolean).length / DPA_CRITERIA.length) * 100
  );

  const getStatus = () => {
    if (complianceScore === 100) return { label: 'Fully Compliant', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' };
    if (complianceScore >= 50) return { label: 'Partially Compliant', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
    return { label: 'High Risk / Non-Compliant', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' };
  };

  const status = getStatus();

  const actionItems = DPA_CRITERIA.filter(c => !checkedItems[c.id]);

  useEffect(() => {
    if (onComplianceChange) {
      onComplianceChange(complianceScore === 100);
    }
  }, [complianceScore]);

  const handleToggle = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0033CC] to-[#00D4FF] px-6 py-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-white" />
          <h3 className="font-heading font-bold text-white text-lg">Data Privacy Act 2012 Compliance</h3>
        </div>
        <p className="font-body text-xs text-white/80 mt-1">
          Republic Act No. 10173 - Philippine Data Privacy Act
        </p>
      </div>

      <div className="p-6">
        {/* Compliance Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-sm font-semibold text-slate-700">Compliance Score</span>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.color} ${status.border}`}>
              {status.label}
            </div>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: complianceScore === 100
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : complianceScore >= 50
                  ? 'linear-gradient(90deg, #eab308, #ca8a04)'
                  : 'linear-gradient(90deg, #ef4444, #dc2626)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${complianceScore}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="font-body text-xs text-slate-500 mt-2 text-right">{complianceScore}% Complete</p>
        </div>

        {/* Checklist */}
        <div className="space-y-3 mb-6">
          {DPA_CRITERIA.map((criteria, index) => {
            const Icon = criteria.icon;
            return (
              <motion.label
                key={criteria.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all hover:border-[#00D4FF]/30 hover:bg-[#00D4FF]/5"
                style={{
                  borderColor: checkedItems[criteria.id] ? '#00D4FF' : '#e2e8f0',
                  backgroundColor: checkedItems[criteria.id] ? 'rgba(0,212,255,0.05)' : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedItems[criteria.id]}
                  onChange={() => handleToggle(criteria.id)}
                  className="w-5 h-5 rounded border-2 border-slate-300 text-[#00D4FF] focus:ring-[#00D4FF] focus:ring-offset-0 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${checkedItems[criteria.id] ? 'text-[#00D4FF]' : 'text-slate-400'}`} />
                    <span className={`font-body text-xs font-semibold ${checkedItems[criteria.id] ? 'text-slate-800' : 'text-slate-600'}`}>
                      {criteria.id.charAt(0).toUpperCase() + criteria.id.slice(1)}
                    </span>
                  </div>
                  <p className="font-body text-[10px] text-slate-500 leading-relaxed">{criteria.label}</p>
                </div>
                {checkedItems[criteria.id] && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </motion.label>
            );
          })}
        </div>

        {/* Action Items */}
        <div className={`rounded-xl p-4 border-2 ${actionItems.length > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <h4 className="font-heading font-bold text-sm mb-2 flex items-center gap-2">
            {actionItems.length > 0 ? (
              <>
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-red-700">Action Items Required</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-green-700">Full Compliance Achieved</span>
              </>
            )}
          </h4>
          {actionItems.length > 0 ? (
            <ul className="space-y-1.5">
              {actionItems.map(item => (
                <li key={item.id} className="font-body text-[10px] text-red-600 flex items-start gap-1.5">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Complete: {item.label}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-[10px] text-green-700">
              All DPA 2012 requirements have been met. Your data handling practices are fully compliant with Philippine law.
            </p>
          )}
        </div>

        {required && (
          <p className="font-body text-[9px] text-slate-400 mt-4 text-center">
            This compliance check is mandatory before proceeding.
          </p>
        )}
      </div>
    </div>
  );
}