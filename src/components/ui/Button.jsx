import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  icon: Icon,
}) => {
  const baseStyles = 'flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
    outline: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600 dark:hover:bg-neutral-700',
    ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500 dark:text-neutral-200 dark:hover:bg-neutral-800',
  }
  
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      {Icon && <Icon className={`w-5 h-5 ${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  )
}

export default Button