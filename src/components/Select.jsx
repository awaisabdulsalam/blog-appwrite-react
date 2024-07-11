import React, { useId } from 'react'

const Select = ({ label, options, className, ...props }, ref) => {
    const id = useId();

  return (
    <div>
        { label && 
        <label htmlFor={id} >
        {label}    
        </label> }
        <select 
        {...props} 
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
        >
            {options?.map((option) => (
                <option key={option}>{option}</option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)