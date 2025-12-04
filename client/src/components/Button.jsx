import React from 'react'
import { Link } from 'react-router-dom'

function classNames(...xs){ return xs.filter(Boolean).join(' ') }

export default function Button({ children, variant='primary', size='md', to, className='', type='button', onClick, disabled=false, ariaLabel }){
  const sizes = {
    sm: 'px-4 py-2.5 text-base rounded-lg',
    md: 'px-6 py-3.5 text-lg rounded-lg',
    lg: 'px-8 py-4 text-xl rounded-xl'
  }

  const variants = {
    primary: 'text-white bg-gradient-to-r from-[rgba(var(--brand),1)] to-[rgba(6,182,212,0.3)] shadow-[0_16px_48px_rgba(var(--brand),0.28)] hover:shadow-[0_20px_60px_rgba(var(--brand),0.35)]',
    secondary: 'text-white bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.2)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:bg-[rgba(255,255,255,0.18)]',
    ghost: 'text-[--text] bg-transparent',
    outline: 'text-[--text] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] shadow-[0_6px_16px_rgba(0,0,0,0.3)]'
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
