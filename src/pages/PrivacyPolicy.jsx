import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Trash2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const SECTIONS = [
  {
    icon: '📋',
    title: '1. Introduction',
    content: `1Marketph.com ("we", "our", "us") is committed to protecting the privacy and personal data of all users of this website. This Privacy Policy explains how we collect, use, store, and protect your information in full compliance with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173) and its Implementing Rules and Regulations.

By accessing or using 1Marketph.com, you acknowledge that you have read, understood, and agree to the terms of this Privacy Policy.

Note: 1Marketph.com is a community marketplace platform currently in its early operational stage. We are committed to registering with the relevant Philippine government agencies (DTI/SEC) as we grow.`,
  },
  {
    icon: '📦',
    title: '2. Data We Collect',
    content: `We collect only the minimum information necessary to provide our services:

• Full Name — for account identification and personalization
• Email Address — for account security, login, and transactional notifications
• Password — stored in encrypted (hashed) form; we never store plain-text passwords
• Location (optional) — Manila or Cavite, for relevant listing filters
• Member Type — Buyer, Seller, or Both, to personalize your dashboard

We do NOT collect: government IDs, financial account numbers, credit card details, or biometric data.`,
  },
  {
    icon: '🎯',
    title: '3. How We Use Your Data',
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
    icon: '🔒',
    title: '4. Data Security',
    content: `We take data security seriously and implement industry-standard protections:

• All passwords are hashed using secure cryptographic algorithms
• Data is stored on encrypted cloud servers with restricted access
• SSL/TLS encryption is enforced for all data transmission
• Access to personal data is limited to authorized personnel only
• Regular security reviews and audits are conducted

Despite our best efforts, no online system is 100% immune to risk. We encourage you to use a strong, unique password for your 1Marketph.com account.`,
  },
  {
    icon: '⚖️',
    title: '5. Your Rights Under the Data Privacy Act of 2012',
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
    icon: '🍪',
    title: '6. Cookies & Tracking',
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
    icon: '🔗',
    title: '7. Third-Party Links',
    content: `1Marketph.com contains links to external business websites, social media pages, and booking platforms (e.g., hotel booking sites, brand stores). These third-party sites have their own privacy policies which we do not control. We encourage you to review the privacy policies of any external site you visit through our platform.`,
  },
  {
    icon: '👶',
    title: '8. Children\'s Privacy',
    content: `1Marketph.com is not directed at children under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has submitted personal information through our platform, please contact us immediately and we will delete it promptly.`,
  },
  {
    icon: '📝',
    title: '9. Policy Updates',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify registered users of significant changes via email. Continued use of 1Marketph.com after the effective date of changes constitutes your acceptance of the updated policy. The date of last update is shown at the bottom of this page.`,
  },
  {
    icon: '📧',
    title: '10. Contact & Data Privacy Officer',
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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#0A192F] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to 1Marketph.com
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#00D4FF]" />
              </div>
              <div>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF] mb-0.5">1Marketph.com</p>
                <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">Privacy Policy</h1>
              </div>
            </div>
            <p className="font-body text-sm text-white/50 max-w-2xl leading-relaxed">
              Your privacy is our priority. This policy explains how 1Marketph.com collects, uses, and protects your personal information in compliance with the Philippine Data Privacy Act of 2012 (RA 10173).
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { label: '🔒 Encrypted Storage' },
                { label: '🗑️ Deletion on Request' },
                { label: '📧 No Spam, Ever' },
                { label: '✅ DPA 2012 Compliant' },
              ].map(({ label }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <span className="font-body text-xs text-white/60">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        {SECTIONS.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl border border-[#0A192F]/5 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[#0A192F]/5 flex items-center gap-3">
              <span className="text-xl">{sec.icon}</span>
              <h2 className="font-heading font-bold text-base text-[#0A192F]">{sec.title}</h2>
            </div>
            <div className="px-6 py-5">
              <p className="font-body text-sm text-[#0A192F]/60 leading-relaxed whitespace-pre-line">{sec.content}</p>
            </div>
          </motion.div>
        ))}

        {/* Last updated */}
        <div className="text-center py-6">
          <p className="font-body text-xs text-[#0A192F]/30">Last updated: May 2026 · 1Marketph.com · Manila, Philippines</p>
          <p className="font-body text-xs text-[#0A192F]/20 mt-1">This policy is governed by the Philippine Data Privacy Act of 2012 (RA 10173)</p>
        </div>
      </div>
    </div>
  );
}