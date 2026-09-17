import React from 'react';

export const Input = ({ label, type = 'text', name, value, onChange, placeholder, error, required = false, ...props }) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={name} className="input-label">{label} {required && '*'}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
