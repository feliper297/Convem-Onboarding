import React from 'react';

function UserAvatar({ name, avatarUrl, size = 'md', className = '' }) {
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizes = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-9 h-9 text-[11px]',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const sizeClass = sizes[size] || sizes.md;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || 'Avatar'}
        className={`${sizeClass} rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white shrink-0 bg-brand ${className}`}
    >
      {initials}
    </div>
  );
}

export default UserAvatar;
