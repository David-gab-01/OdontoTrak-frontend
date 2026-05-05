import React from 'react';

const ProfileHeader = ({
  title,
  subtitle,
  avatarText,
  fields = [],
  actions,
  footer,
}) => (
  <div className="bg-white rounded-clinica shadow-sm border border-gray-100 p-6 mb-6">
    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-white">
        {avatarText || (title ? title.charAt(0).toUpperCase() : 'P')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-dentista-title leading-tight">{title}</h2>
            {subtitle && <p className="text-sm text-dentista-body opacity-80">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
        </div>

        {fields.length > 0 && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-dentista-body text-sm">
            {fields.map((field, index) => (
              <div key={index}>
                <p className="font-medium">{field.label}</p>
                <p>{field.value || 'Não informado'}</p>
              </div>
            ))}
          </div>
        )}

        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  </div>
);

export default ProfileHeader;
