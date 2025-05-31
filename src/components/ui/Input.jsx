import React from 'react'

const Input = ({ 
  label, 
  type = 'text', 
  id, 
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-neutral-400" />
          </div>
        )}
        
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-3 py-2 border ${error ? 'border-error-300' : 'border-neutral-300'} 
                     rounded-md shadow-sm focus:outline-none focus:ring-2 
                     ${error ? 'focus:ring-error-500 focus:border-error-500' : 'focus:ring-primary-500 focus:border-primary-500'} 
                     ${Icon ? 'pl-10' : ''} 
                     ${disabled ? 'bg-neutral-100 cursor-not-allowed' : ''}`}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  )
}

export default Input