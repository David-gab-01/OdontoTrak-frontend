import React from "react";

const SectionCard = ({ title, subtitle, children, className = "" }) => (
  <div className={`rounded-[22px] border border-gray-200 bg-slate-50 p-6 ${className}`}>
    {(title || subtitle) && (
      <div className="mb-4">
        {title && <h3 className="text-xl font-semibold text-dentista-title">{title}</h3>}
        {subtitle && <p className="text-sm text-dentista-body">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

export default SectionCard;
