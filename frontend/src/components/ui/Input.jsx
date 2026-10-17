import { useState } from 'react';

export default function Input({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  error = false,
  helperText,
  errorText,
  className = "",
  as,
  rows,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const Element = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={`label ${error ? 'text-error-600' : ''} ${isFocused ? 'text-instadog-600' : ''}`}
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <Element
        id={id}
        type={as === 'textarea' ? undefined : type}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => {
          setIsFocused(true);
          onChange?.(e);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        rows={rows}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />

      {error && errorText && <p className="error-text">{errorText}</p>}
      {!error && helperText && <p className="helper-text">{helperText}</p>}
    </div>
  );
}
