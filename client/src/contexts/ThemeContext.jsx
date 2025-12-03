import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }){
  const [theme, setTheme] = useState(() => {
    try{
      const t = localStorage.getItem('theme')
      return t === 'dark' ? 'dark' : 'light'
    }catch(e){ return 'light' }
  })

  useEffect(()=>{
    const el = document.documentElement
    if(theme === 'dark'){
      el.setAttribute('data-theme','dark')
      el.classList.add('dark')
    } else {
      el.setAttribute('data-theme','light')
      el.classList.remove('dark')
    }
    try{ localStorage.setItem('theme', theme) }catch(e){}
  },[theme])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(){ return useContext(ThemeContext) }

export default ThemeContext
