import React from 'react'
import { Link } from 'react-router-dom'

function classNames(...xs){ return xs.filter(Boolean).join(' ') }

export default function Button({ children, variant='primary', size='md', to, className='', type='button', onClick, disabled=false, ariaLabel }){
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-5 py-3 text-base rounded-xl'
  }

  const variants = {
    primary: 'text-white bg-gradient-to-r from-[rgba(var(--brand),1)] to-[rgba(6,182,212,0.12)] shadow-[0_12px_40px_rgba(var(--brand),0.12)]',
    secondary: 'text-[--text] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]',
    ghost: 'text-[--text] bg-transparent',
    outline: 'text-[--text] bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.06)]'
  }

  const base = 'inline-flex items-center justify-center gap-2 font-semibold transform transition duration-180 ease-out select-none';
  const hover = disabled ? '' : 'hover:-translate-y-1 hover:shadow-glow-md';
  const focus = 'focus:outline-none focus:ring-4 focus:ring-[rgba(var(--brand),0.12)] focus:ring-offset-1';

  const classes = classNames(base, sizes[size], variants[variant], hover, focus, disabled ? 'opacity-50 pointer-events-none' : '', className)

  if(to){
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
