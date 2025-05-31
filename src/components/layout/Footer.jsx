import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="py-3 bg-white border-t border-neutral-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-600">
            &copy; {currentYear} Склад Турбо. Все права защищены.
          </p>
          <div className="mt-2 md:mt-0">
            <p className="text-xs text-neutral-500">
              Версия 1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer