import React from 'react'

const Table = ({ 
  columns, 
  data, 
  onRowClick,
  emptyMessage = "Нет данных для отображения",
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md p-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md p-4">
        <div className="flex flex-col justify-center items-center h-40">
          <svg 
            className="h-12 w-12 text-neutral-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
            />
          </svg>
          <p className="mt-4 text-neutral-500">{emptyMessage}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="table-header-cell">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`table-row ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="table-cell">
                  {column.cell ? column.cell(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table