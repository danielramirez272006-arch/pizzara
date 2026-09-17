import React from 'react';

export const Button = ({ children, variant = 'primary', type = 'button', onClick, className = '', ...props }) => {
  const baseStyle = 'btn';
  const variantClass = variant === 'secondary' ? 'btn-secondary' : variant === 'danger' ? 'btn-danger' : 'btn-primary';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
