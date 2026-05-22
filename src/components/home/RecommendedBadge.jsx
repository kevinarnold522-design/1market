import React from 'react';

export default function RecommendedBadge({ className = '' }) {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 border border-amber-200 text-amber-700 ${className}`}>
      <span>⭐</span>
      <span>Highly Recommended</span>
    </div>
  );
}

export function UnverifiedNotice({ onContinue, businessName }) {
  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">ℹ️</span>
        <div>
          <p className="font-body font-bold text-xs text-amber-800 mb-1">Community Recommendation</p>
          <p className="font-body text-[10px] text-amber-700 leading-relaxed">
            <strong>{businessName}</strong> is not a verified partner of 1Marketph.com. This listing is shown based on customer preferences, ratings, and location relevance across multiple platforms.
          </p>
          <button onClick={onContinue} className="mt-2 text-[10px] font-semibold text-amber-800 underline hover:text-amber-900 transition-colors">
            Continue anyway →
          </button>
        </div>
      </div>
    </div>
  );
}