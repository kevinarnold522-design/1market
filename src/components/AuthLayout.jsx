import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(180deg,#3E97F1 0%,#60A5FA 100%)' }}>
      <div className="w-full max-w-md font-body">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFD700] mb-4 shadow-xl">
            <Icon className="w-8 h-8 text-[#2563EB]" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="text-yellow-100 mt-2 font-semibold">{subtitle}</p>}
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-yellow-200/70 p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-yellow-100 mt-6 font-semibold">{footer}</p>
        )}
      </div>
    </div>
  );
}