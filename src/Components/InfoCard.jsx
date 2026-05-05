import React from "react";

const InfoCard = ({
  title,
  value,
  icon: Icon,
  iconClassName = "text-dentista-primary",
  iconBgClassName = "bg-gray-100",
  className = "",
}) => (
  <div className={`bg-white rounded-clinica shadow-sm border border-gray-100 p-5 flex items-center justify-between gap-4 ${className}`}>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-dentista-title">{value}</p>
    </div>
    {Icon && (
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBgClassName}`}>
        <Icon size={16} className={iconClassName} />
      </div>
    )}
  </div>
);

export default InfoCard;
