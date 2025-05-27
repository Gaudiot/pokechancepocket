'use client'

import { useState, useRef, useEffect } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/solid'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const toggleOpen = () => setOpen(prev => !prev)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function handleLoginPress() {
    alert('To login, please contact us at gaudiot.dev@gmail.com')
  }

  function handleSignUpPress() {
    alert('To sign up, please contact us at gaudiot.dev@gmail.com')
  }

  function handleSupportPress() {
    alert('To get support, please contact us at gaudiot.dev@gmail.com')
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button onClick={toggleOpen} aria-haspopup="true" aria-expanded={open}>
        <UserCircleIcon className="w-12 h-12 mr-8 cursor-pointer" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
          <ul>
            <li>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleLoginPress}>Login</button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleSignUpPress}>Cadastro</button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleSupportPress}>Suporte</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
} 