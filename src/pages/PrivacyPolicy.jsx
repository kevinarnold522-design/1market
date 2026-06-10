import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield, Lock, Trash2, Mail, ArrowLeft, CheckCircle,
  Database, Target, Eye, Scale, Cookie, Link as LinkIcon,
  Baby, RefreshCw, Phone, Info
} from 'lucide-react';

const SECTION_ICONS = [Info, Database, Target, Lock, Scale, Cookie, LinkIcon, Baby, RefreshCw, Phone];

const SECTIONS = [
  {
    title: '1. Introduction',
    color: '#00D4FF',
    bg: 'rgba(0,212,255,0.08)',
    border: 'rgba(0,212,255,0.2)',
    content: `1Marketph.com ("we", "our", "us") is committed to protecting the privacy and personal data of all users of this website. This Privacy Policy explains how we collect, use, store, and protect your information in full compliance with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173) and its Implementing Rules and Regulations.

By accessing or using 1Marketph.com, you acknowledge that you have read, understood, and agree to the terms of this Privacy Policy.

Note: 1Marketph.com is a community marketplace platform currently in its early operational stage. We are committed to registering with the relevant Philippine government agencies (DTI/SEC) as we grow.`,
  },
  {
    title: '2. Data We Collect',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.2)',
    content: `We collect only the minimum information necessary to provide our services:

• Full Name — for account identification and personalization
• Email Address — for account security, login, and transactional notifications
• Password — stored in encrypted (hashed) form; we never store plain-text passwords
• Location (optional) — Manila or Cavite, for relevant listing filters
• Member Type — Buyer, Seller, or Both, to personalize your dashboard

We do NOT collect: government IDs, financial account numbers, credit card details, or biometric data.`,
  },
  {
    title: '3. How We Use Your Data',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
    content: `Your personal information is used exclusively for:

• Creating and managing your 1Marketph.com account
• Sending account verification and security-related emails
• Sending order or transaction updates relevant to your activity
• Improving platform features and user experience (in aggregate, anonymized form)

We will NEVER:
• Sell your personal data to third parties
• Share your data with advertising networks or data brokers
• Use your email for unsolicited marketing or spam
• Use your data for purposes beyond what is stated in this policy`,
  },
  {
    title: '4. Data Security',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
    content: `We take data security seriously and implement industry-standard protections:

• All passwords are hashed using secure cryptographic algorithms
• Data is stored on encrypted cloud servers with restricted access
• SSL/TLS encryption is enforced for all data transmission
• Access to personal data is limited to authorized personnel only
• Regular security reviews and audits are conducted

Despite our best efforts, no online system is 100% immune to risk. We encourage you to use a strong, unique password for your 1Marketph.com account.`,
  },
  {
    title: '5. Your Rights Under the Data Privacy Act of 2012',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    content: `As a data subject under Philippine law, you have the following rights:

• Right to be Informed — You have the right to know how your data is processed
• Right to Access — You may request a copy of the personal data we hold about you
• Right to Rectification — You may request correction of inaccurate data
• Right to Erasure / Blocking — You may request deletion of your personal data
• Right to Object — You may object to the processing of your personal data
• Right to Data Portability — You may request your data in a portable format
• Right to Lodge a Complaint — You may file a complaint with the National Privacy Commission (NPC)

To exercise any of these rights, contact us at: privacy@1marketph.com`,
  },
  {
    title: '6. Cookies & Tracking',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.2)',
    content: `1Marketph.com uses minimal, functional cookies only:

• Session cookies — to keep you logged in during your visit
• Preference cookies — to remember your location filter (Manila/Cavite)

We do NOT use:
• Third-party advertising cookies
• Cross-site tracking pixels
• Google Analytics (or similar) for individual user tracking

You may disable cookies in your browser settings, though some site functionality may be affected.`,
  },
  {
    title: '7. Third-Party Links',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.2)',
    content: `1Marketph.com contains links to external business websites, social media pages, and booking platforms (e.g., hotel booking sites, brand stores). These third-party sites have their own privacy policies which we do not control. We encourage you to review the privacy policies of any external site you visit through our platform.`,
  },
  {
    title: "8. Children's Privacy",
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.2)',
    content: `1Marketph.com is not directed at children under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has submitted personal information through our platform, please contact us immediately and we will delete it promptly.`,
  },
  {
    title: '9. Policy Updates',
    color: '#84cc16',
    bg: 'rgba(132,204,22,0.08)',
    border: 'rgba(132,204,22,0.2)',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify registered users of significant changes via email. Continued use of 1Marketph.com after the effective date of changes constitutes your acceptance of the updated policy. The date of last update is shown at the bottom of this page.`,
  },
  {
    title: '10. Contact & Data Privacy Officer',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.2)',
    content: `For any privacy-related concerns, requests, or complaints, please contact:

1Marketph.com Data Privacy Office
Founder: Kevin W. Roberto
Email: privacy@1marketph.com
Address: Manila, Philippines

You may also file a complaint with the National Privacy Commission (NPC):
Website: www.privacy.gov.ph
Hotline: (02) 8234-2228`,
  },
];

const TRUST_BADGES = [
  { icon: Lock, label: 'Encrypted Storage', color: '#00D4FF' },
  { icon: Trash2, label: 'Deletion on Request', color: '#ef4444' },
  { icon: Mail, label: 'No Spam, Ever', color: '#10b981' },
  { icon: CheckCircle, label: 'DPA 2012 Compliant', color: '#f59e0b' },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001a80 50%,#000d40 100%)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0033CC,#001a80)', borderBottom: '1px solid rgba(0,212,255,0.2)' }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-[#00D4FF] transition-colors mb-8 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to 1Marketph.com
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,212,255,0.12)', border: '1.5px solid rgba(0,212,255,0.3)' }}>
                <Shield className="w-7 h-7 text-[#00D4FF]" />
              </div>
              <div>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]/70 mb-0.5 font-semibold">1Marketph.com</p>
                <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">Privacy Policy</h1>
              </div>
            </div>
            <p className="font-body text-sm text-white/50 max-w-2xl leading-relaxed mb-6">
              Your privacy is our priority. This policy explains how 1Marketph.com collects, uses, and protects your personal information in compliance with the Philippine Data Privacy Act of 2012 (RA 10173).
            </p>
            <div className="flex flex-wrap gap-3">
              {TRUST_BADGES.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                  <span className="font-body text-xs text-white/70 font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-4">
        {SECTIONS.map((sec, i) => {
          const Icon = SECTION_ICONS[i];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(0,26,128,0.5)', border: `1px solid rgba(0,212,255,0.18)`, backdropFilter: 'blur(12px)' }}
            >
              <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(0,212,255,0.18)', background: 'rgba(0,51,204,0.25)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${sec.color}20`, border: `1px solid ${sec.color}40` }}>
                  <Icon className="w-4 h-4" style={{ color: sec.color }} />
                </div>
                <h2 className="font-heading font-bold text-sm text-white">{sec.title}</h2>
              </div>
              <div className="px-6 py-5">
                <p className="font-body text-sm text-white/60 leading-relaxed whitespace-pre-line">{sec.content}</p>
              </div>
            </motion.div>
          );
        })}

        {/* Last updated */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-3"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <Shield className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span className="font-body text-xs text-[#00D4FF] font-semibold">Protected by Philippine Data Privacy Act of 2012 (RA 10173)</span>
          </div>
          <p className="font-body text-xs text-white/25">Last updated: May 2026 · 1Marketph.com · Manila, Philippines</p>
        </div>
      </div>
    </div>
  );
}