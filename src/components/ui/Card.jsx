import React from 'react'

const Card = ({ 
  title, 
  children, 
  icon: Icon, 
  footer, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center">
            {Icon && <Icon className="mr-2 text-primary-600 h-5 w-5" />}
            <h3 className="text-lg font-medium text-neutral-800">{title}</h3>
          </div>
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card