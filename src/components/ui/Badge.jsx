import React from 'react'

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  rounded = false 
}) => {
  const baseStyles = 'inline-flex items-center font-medium'
  
  const variantStyles = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    accent: 'bg-accent-100 text-accent-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    neutral: 'bg-neutral-100 text-neutral-800',
  }
  
  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }
  
  const roundedStyles = rounded ? 'rounded-full' : 'rounded'
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles}`}>
      {children}
    </span>
  )
}

export default Badge