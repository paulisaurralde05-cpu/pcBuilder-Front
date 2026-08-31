import React from 'react'

function Button({ text, onClick, className }) {
  return (
    <div>
      <button className={className} onClick={onClick}>
        {text}
      </button>
    </div>
  )
}

export default Button   